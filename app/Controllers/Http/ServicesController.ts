import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { AuthenticationException } from '@adonisjs/auth/build/standalone'
import { randomUUID } from 'crypto'
import Drive from '@ioc:Adonis/Core/Drive'

import Worker from 'App/Models/Worker'
import Deals from 'App/Models/Deal'
import ServicePhoto from 'App/Models/ServicePhoto'
import File from 'App/Models/File'
import Service from 'App/Models/Service'

import ServiceSchema from 'App/Schemas/Service'
import ServiceUpdateSchema from 'App/Schemas/ServiceUpdate'

export default class ServicesController {
  public async index({ auth, response }: HttpContextContract) {
    try {
      if (auth.user?.is_worker) {
        const worker = await Worker.findByOrFail('userId', auth.user.id)
        let services = await Service.query()
          .where('worker_id', '=', worker?.id as number)
          .preload('occupation')
          .preload('photos', pQuery => pQuery.preload('file'))
        
        return services;
      } else {
        response.status(400).json({ error: 'Usuário deve ser um trabalhador' })
      }
    } catch (e) {
      console.log(e)
      response.status(500).json({ error: "Houve um problema, por favor tente novamente mais tarde" })
    }
  }

  public async store({ request, auth, response }: HttpContextContract) {
    try {
      const body = request.body()
      const parsed = {
        worker_occupation: {
          worker_id: parseInt(body.worker_id),
          occupation_id: parseInt(body.occupation_id)
        }
      }
      request.updateBody(parsed)
      const temp = await request.validate({
        schema: ServiceSchema
      });
      if (auth.user?.is_worker) {
        const worker = await Worker.findBy('userId', auth.user.id)
        if (worker?.id != temp.worker_occupation.worker_id) {
          return response.status(401).json({ error: 'ID do trabalhador diferente do id do usuário' })
        }
        const service = await Service.create({
          occupation_id: temp.worker_occupation.occupation_id,
          worker_id: temp.worker_occupation.worker_id
        })
        if (temp?.photos?.length != 0 && !!temp.photos) {
          for (let i = 0; i < temp.photos.length; i++) {
            const photo = temp.photos[i];
            const name = `${service.id}-${randomUUID()}-${Date.now()}`;
            await photo?.moveToDisk('servicePhotos', {
              name
            }, 's3')
            const fileInfo = await Drive.getStats(`servicePhotos/${name}`)
            const file = await File.create({ cloudId: fileInfo.etag, drive: 's3', mimeType: photo?.extname, path: `servicePhotos/${name}`, size: fileInfo.size })
            await ServicePhoto.create({ service_id: service.id, file_id: file.id })
          }
        }
        return service;
      } else {
        response.status(400).json({ error: 'Usuário deve ser um trabalhador' })
      }
    } catch (error) {
      console.log(error)
      switch (error.message) {
        case "E_VALIDATION_FAILURE: Validation Exception":
          response.status(400).json({ error: error?.messages?.errors[0]?.message })
          break;
        default:
          response.status(500).json({ error: "Houve um problema, por favor tente novamente mais tarde" })
      }
    }
  }

  public async show({ request }: HttpContextContract) {
    let service = await Service.query()
      .preload('occupation')
      .preload('worker', (wQuery) => wQuery.preload('user', (uQuery) => uQuery.preload('userPhoto', (pQuery) => pQuery.preload('file'))))
      .preload('photos', pQuery => pQuery.preload('file'))
      .select('*').where('id', request.params().id as number).firstOrFail();
      for (let i in service.photos) {
        let p = service.photos[i];
        if(p.file){
          let path = await Drive.getSignedUrl(p.file.path)
          service.photos[i].file.path = path
        }
      }
    if(service.worker.user.userPhoto){
      service.worker.user.userPhoto.file.path = await Drive.getSignedUrl(service.worker.user.userPhoto.file.path)
    }
    let totalDeals = (await Deals.query().where('worker_id', '=', service.worker_id).count('* as total'))
    totalDeals = totalDeals[0].$extras.total
    return { workerTotalDeals: totalDeals, ...service.toJSON() };
  }

  public async update({ request, auth, response }: HttpContextContract) {
    try {
      const temp = await request.validate({
        schema: ServiceUpdateSchema
      });
      const service = await Service.query()
        .where('id', '=', temp.service)
        .preload('photos', pQuery => pQuery.preload('file'))
        .firstOrFail()
      const photos = service.photos.map(photo => photo.serialize())
      const worker = await Worker.findByOrFail('userId', auth?.user?.id)
      if (service?.worker_id == worker.id) {
        const photosToDelete = photos.filter(photo => !temp?.savedPhotos?.includes(photo.id.toString()));
        for (let i = 0; i < photosToDelete.length; i++) {
          const photo = photosToDelete[i];
          ServicePhoto.query().where('id', '=', photo.id).delete().then(()=>{
            File.query().where('id', '=', photo.file.id).delete()
          })
          Drive.delete(photo.file.path)
        }
        if (temp?.photos?.length != 0 && !!temp.photos) {
          for (let i = 0; i < temp.photos.length; i++) {
            const photo = temp.photos[i];
            const name = `${service.id}-${randomUUID()}-${Date.now()}`;
            await photo?.moveToDisk('servicePhotos', {
              name
            }, 's3')
            const fileInfo = await Drive.getStats(`servicePhotos/${name}`)
            const file = await File.create({ cloudId: fileInfo.etag, drive: 's3', mimeType: photo?.extname, path: `servicePhotos/${name}`, size: fileInfo.size })
            await ServicePhoto.create({ service_id: service.id, file_id: file.id })
          }
        }
        return service;
      } else {
        return response.status(401).json({ error: 'Serviço não pertencente ao usuário logado' })
      }
    } catch (e) {
      console.log(e)
      console.log(e.messages.errors)
    }
    return;
  }

  public async toggle({ request, auth, response }: HttpContextContract) {
    try {
      const id = request.input('id')
      const service = await Service.findOrFail(id)
      const worker = await Worker.findBy('userId', auth.user?.id);
      if (service.worker_id != worker?.id) {
        return response.status(401).json({ error: 'Serviço não pertencente ao usuário logado' })
      }
      service.active = !service.active
      await service.save()
      return true
    } catch (error) {
      console.log(error)
      response.status(500).json({error: "Erro"})
    }
  }

  public async worker({request}: HttpContextContract){
    try{
      const worker = await Worker.findBy('userId', request.params().id as number);
      const services = await Service.query()
        .preload('occupation')
        .preload('worker', (wQuery) => wQuery.preload('user', (uQuery) => uQuery.preload('userPhoto', (pQuery) => pQuery.preload('file'))))
        .preload('photos', pQuery => pQuery.preload('file'))
        .select('*').where('worker_id', worker?.id as number).exec();
      return services.map((service) => service.serialize());
    }catch(e){
      console.log(e)
    }
  }
}
