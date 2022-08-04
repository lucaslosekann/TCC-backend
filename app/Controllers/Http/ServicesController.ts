import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Service from 'App/Models/Service'
import ServiceSchema from 'App/Schemas/Service'
import { AuthenticationException } from '@adonisjs/auth/build/standalone'
import Worker from 'App/Models/Worker'
import Occupation from 'App/Models/Occupation'
import Deals from 'App/Models/Deal'

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
    const service = await Service.query()
    .preload('occupation')
    .preload('worker', (wQuery) => wQuery.preload('user', (uQuery)=>uQuery.preload('userPhoto', (pQuery) => pQuery.preload('file'))))
    .preload('photos')
    .select('*').where('id', request.params().id as number).firstOrFail() as any;
    let totalDeals = (await Deals.query().where('worker_id', '=', service.worker_id).count('* as total'))
    totalDeals = totalDeals[0].$extras.total
console.log(totalDeals)
    return {workerTotalDeals: totalDeals, ...service.toJSON()};
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
