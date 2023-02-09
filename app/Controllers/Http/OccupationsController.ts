import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator';
import Occupation from 'App/Models/Occupation'
import OccupationSchema, { OccupationSchemaEdit } from 'App/Schemas/Occupation'
import { randomUUID } from 'crypto';
import Drive from '@ioc:Adonis/Core/Drive'
import File from 'App/Models/File';
import Database from '@ioc:Adonis/Lucid/Database';
import Suggestion from 'App/Models/Suggestion';

export default class OccupationsController {
  public async index({ }: HttpContextContract) {
    let occ = await Occupation.query().preload('occupationPhoto').select('*').exec();
    for (let i in occ) {
      let o = occ[i];
      if (o.occupationPhoto) {
        let path = await Drive.getSignedUrl(o.occupationPhoto.path)
        occ[i].occupationPhoto.path = path
      }
    }
    return occ;
  }

  public async store({ request, response, session }: HttpContextContract) {
    try {
      const payload = await request.validate({
        schema: OccupationSchema
      });
      let file_id;
      if (!!payload.photo) {
        const name = `${payload.occupation_name}-${randomUUID()}-${Date.now()}`;
        await payload.photo.moveToDisk('occupationPhotos', {
          name
        }, 's3')
        const fileInfo = await Drive.getStats(`occupationPhotos/${name}`)
        const file = await File.create({ cloudId: fileInfo.etag, drive: 's3', mimeType: payload.photo?.extname, path: `occupationPhotos/${name}`, size: fileInfo.size })
        file_id = file.id;
      }
      await Occupation.create({
        name: payload.occupation_name,
        occupation_photo: file_id
      });


      const suggestion = await Suggestion.findBy('suggestion_name', payload.occupation_name);
      if (!!suggestion) {
        await suggestion.delete()
      }
      response.redirect('/');
    } catch (error) {
      session.flash('error', 'Erro')
      response.redirect('/');
    }
  }

  public async show({ request }: HttpContextContract) {
    const lat = request.qs().lat;
    const lon = request.qs().lon;
    if(lat == null || lon == null){
      return false;
    }
    const occupation = await Occupation.findOrFail(request.params().id);
    let services = await Database.rawQuery(`
    select * from (
      select (6371 * acos(
    cos(radians(a.lat))*
    cos(radians(?)) *
    cos(radians(a.lon) - 
            radians(?)) +
    sin(radians(a.lat)) *
    sin(radians(?)))) as d, users.name, a.radius, a.radius_unlimited, services.id,
    (select path from files
      inner join user_photos on user_photos.file_id = files.id
      where user_photos.user_id = users.id),
    (select json_build_object('rating',avg(rating),'price', avg(price), 'count', count(deals.*)) as rating from deals 
    inner join ratings on ratings.deal_id = deals.id
    where deals.worker_id = workers.id) as rating
    from services
  inner join workers on workers.id = services.worker_id
  inner join users on workers.user_id = users.id
  inner join addresses a on users.id = a.user_id
  where services.occupation_id = ?) as temp
  where d < radius OR radius_unlimited = true
    `, [
      lat,
      lon,
      lat,
      request.params().id
    ]).exec();
    services = services.rows


    let promiseQueue = [] as any;
    const getSignedUrl = async(id, path) =>{
      const signed = await Drive.getSignedUrl(path);
      return{
        id, path: signed
      }
    }

    for (let i in services) {
      if(services[i].path){
        promiseQueue.push(getSignedUrl(services[i].id, services[i].path));
      }
    }

    const paths = await Promise.all(promiseQueue);
    for (let i in services) {
      if(services[i].path){
        services[i].path = paths.find((v)=> v.id === services[i].id).path;
      }
    }

    return {
      ...occupation.toJSON(),
      services
    };
  }

  public async update({ request, response, session }: HttpContextContract) {
    try {
      const payload = await request.validate({
        schema: OccupationSchemaEdit
      });
      const editing = await Occupation.query().preload('occupationPhoto').select('*').where('id', payload.id).firstOrFail()
      let newOcc = {
        name: payload.occupation_name
      } as any;

      if (payload.nochange) {
        await editing.merge(newOcc).save()
        return response.redirect('/');
      }
      if (!!payload.photo) {
        const name = `${payload.occupation_name}-${randomUUID()}-${Date.now()}`;
        await payload.photo.moveToDisk('occupationPhotos', {
          name
        }, 's3')
        const fileInfo = await Drive.getStats(`occupationPhotos/${name}`)
        const file = await File.create({ cloudId: fileInfo.etag, drive: 's3', mimeType: payload.photo?.extname, path: `occupationPhotos/${name}`, size: fileInfo.size })
        if (editing.occupation_photo) {
          const old_photo = await File.findOrFail(editing.occupation_photo);
          newOcc.occupation_photo = file.id
          await editing.merge(newOcc).save()
          await Drive.delete(old_photo.path);
          await old_photo.delete();
        } else {
          newOcc.occupation_photo = file.id
          await editing.merge(newOcc).save()
        }
      } else {
        if (editing.occupation_photo) {
          const old_photo = await File.findOrFail(editing.occupation_photo);
          newOcc.occupation_photo = null;
          await editing.merge(newOcc).save()
          await Drive.delete(old_photo.path);
          await old_photo.delete()
        } else {
          await editing.merge(newOcc).save()
        }
      }
      response.redirect('/');
    } catch (error) {
      console.log(error)
      session.flash('error', 'Erro')
      response.redirect('/');
    }
  }

  public async destroy({ request, response, session }: HttpContextContract) {
    try {
      const occupation = await Occupation.query().preload('occupationPhoto').select('*').where('id', request.qs().id).firstOrFail()
      if (occupation.occupationPhoto) {
        Drive.delete(occupation.occupationPhoto.path)
      }
      await occupation.delete();
      return response.redirect('/');
    } catch (e) {
      session.flash('error', 'Erro')
      console.log(e)
    }
  }
  public async showByid({ request }: HttpContextContract) {
    const occupation = await Occupation.findOrFail(request.params().id);
    return occupation;
  }
}
