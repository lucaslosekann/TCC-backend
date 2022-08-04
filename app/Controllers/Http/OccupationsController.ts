import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Occupation from 'App/Models/Occupation'
import OccupationSchema from 'App/Schemas/Occupation'

export default class OccupationsController {
  public async index({}: HttpContextContract) {
    return Occupation.all();
  }

  public async store({ request }: HttpContextContract) {
    const payload = await request.validate({
      schema: OccupationSchema
    });
    const newOccupation = await Occupation.create(payload);
    return newOccupation;
  }

  public async show({ request }: HttpContextContract) {
    const occupation = Occupation.query().preload('services', (sQuery =>{
      sQuery.preload('worker', wQuery=>{
        wQuery.preload('user', uQuery=>{
          uQuery.preload('userPhoto', photoQuery => photoQuery.preload('file'))
        })
      })
    })).select('*').where('id', request.params().id).firstOrFail();
  
    return occupation;
  }

  public async update({ request }: HttpContextContract) {
    const payload = await request.validate({
      schema: OccupationSchema
    });
    const occupation = await Occupation.findOrFail(request.params().id);
    await occupation.merge(payload).save();
    return occupation;
  }

  public async destroy({ request }: HttpContextContract) {
    const occupation = await Occupation.findOrFail(request.params().id);
    await occupation.delete();
    return request.params().id;
  }
}
