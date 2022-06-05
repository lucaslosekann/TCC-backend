import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Service from 'App/Models/Service'
import ServiceSchema from 'App/Schemas/Service'
import { AuthenticationException } from '@adonisjs/auth/build/standalone'
import Worker from 'App/Models/Worker'
import Occupation from 'App/Models/Occupation'

export default class ServicesController {
  public async index({}: HttpContextContract) {
    return Service.all()
  }

  public async store({ request, auth }: HttpContextContract) {
    const temp = await request.validate({
      schema: ServiceSchema
    });
    const payload = {suggestedPrice: temp.suggestedPrice, ...temp.worker_occupation};
    const worker = await Worker.findBy('user_id', auth.user?.id);
    if(payload.worker_id != worker?.id){
      throw new AuthenticationException(
        'Unauthorized access',
        'E_UNAUTHORIZED_ACCESS'
      )
    }
    const newService = await Service.create(payload);
    return newService;
  }

  public async show({ request }: HttpContextContract) {
    const service = await Service.findOrFail(request.params().id);
    return service;
  }

  public async update({ request, auth }: HttpContextContract) {
    const temp = await request.validate({
      schema: ServiceSchema
    });
    const service = await Service.findOrFail(request.params().id)

    const payload = {suggestedPrice: temp.suggestedPrice};
    const worker = await Worker.findBy('user_id', auth.user?.id);
    if(service.worker_id != worker?.id){
      throw new AuthenticationException(
        'Unauthorized access',
        'E_UNAUTHORIZED_ACCESS'
      )
    }

    await service.merge(payload).save()
    return service;
  }

  public async destroy({ request, auth }: HttpContextContract) {
    const service = await Service.findOrFail(request.params().id)
    const worker = await Worker.findBy('user_id', auth.user?.id);
    if(service.worker_id != worker?.id){
      throw new AuthenticationException(
        'Unauthorized access',
        'E_UNAUTHORIZED_ACCESS'
      )
    }
    await service.delete()
  }
}