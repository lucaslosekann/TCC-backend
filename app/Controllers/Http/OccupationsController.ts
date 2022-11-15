import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator';
import Occupation from 'App/Models/Occupation'
import OccupationSchema, { OccupationSchemaEdit } from 'App/Schemas/Occupation'
import { randomUUID } from 'crypto';
import Drive from '@ioc:Adonis/Core/Drive'
import File from 'App/Models/File';
import Database from '@ioc:Adonis/Lucid/Database';

export default class OccupationsController {
  public async index({}: HttpContextContract) {
    let occ = await Occupation.query().preload('occupationPhoto').select('*').exec(); 
    for (let i in occ) {
      let o = occ[i];
      if(o.occupationPhoto){
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
      if(!!payload.photo){
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
      response.redirect('/');
    } catch (error) {
      session.flash('error', 'Erro')
      response.redirect('/');
    }
  }

  public async show({ request }: HttpContextContract) {
    let occupation = await Occupation.query().preload('services', (sQuery =>{
      sQuery.preload('worker', async (wQuery)=>{
        wQuery.preload('user', uQuery=>{
          uQuery.preload('userPhoto', photoQuery => photoQuery.preload('file'))
        }).withCount('deals').select(
          Database.from('deals').join('ratings', 'deals.id', 'ratings.deal_id').whereColumn('workers.id','deals.worker_id').avg('ratings.rating').limit(1).as('avg')
        )
      }).where('active', true)
    })).select('*').where('id', request.params().id).firstOrFail();

    for (let i in occupation.services) {
      let s = occupation.services[i];
      if(s.worker.user.userPhoto){
        let path = await Drive.getSignedUrl(s.worker.user.userPhoto.file.path)
        occupation.services[i].worker.user.userPhoto.file.path = path;
      }
      console.log(occupation.services[i].worker)
    }
    
    return occupation;
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

      if(payload.nochange){
        await editing.merge(newOcc).save()
        return response.redirect('/');
      }
      if(!!payload.photo){
        const name = `${payload.occupation_name}-${randomUUID()}-${Date.now()}`;
        await payload.photo.moveToDisk('occupationPhotos', {
          name
        }, 's3')
        const fileInfo = await Drive.getStats(`occupationPhotos/${name}`)
        const file = await File.create({ cloudId: fileInfo.etag, drive: 's3', mimeType: payload.photo?.extname, path: `occupationPhotos/${name}`, size: fileInfo.size })
        if(editing.occupation_photo){
          const old_photo = await File.findOrFail(editing.occupation_photo);
          newOcc.occupation_photo = file.id
          await editing.merge(newOcc).save()
          await Drive.delete(old_photo.path);
          await old_photo.delete();
        }else{
          newOcc.occupation_photo = file.id
          await editing.merge(newOcc).save()
        }
      }else{
        if(editing.occupation_photo){
          const old_photo = await File.findOrFail(editing.occupation_photo);
          newOcc.occupation_photo = null;
          await editing.merge(newOcc).save()
          await Drive.delete(old_photo.path);
          await old_photo.delete()
        }else{
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
      if(occupation.occupationPhoto){
        Drive.delete(occupation.occupationPhoto.path)
      }
      await occupation.delete();
      return response.redirect('/');
    } catch (e) { 
      session.flash('error', 'Erro')
      console.log(e)
    }
  }
  public async showByid({request}: HttpContextContract){
    const occupation = await Occupation.findOrFail(request.params().id);
    return occupation;
  }
}
