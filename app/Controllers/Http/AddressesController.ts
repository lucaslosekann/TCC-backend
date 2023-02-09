import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Address from 'App/Models/Address'
import User from 'App/Models/User';
import { AddressStoreSchema, AddressUpdateSchema } from 'App/Schemas/Address';


export default class AddressesController {

  public async store({ request, auth }: HttpContextContract) {
    const payload = await request.validate({
      schema: AddressStoreSchema
    })
    const address = await Address.findBy('user_id', auth.user?.id as number);
    if(address){
      return {
        "errors": [
          {
            "rule": "unique",
            "field": "user_id",
            "message": "a user can only have one address"
          }
        ]
      }
    }
    const newAddress = await Address.create({...payload, user_id: auth.user?.id});
    return newAddress;
  }

  public async show({ request }: HttpContextContract) {
    return Address.findOrFail(request.params().id);
  }

  public async update({ request, auth }: HttpContextContract) {
    const payload = await request.validate({
      schema: AddressUpdateSchema
    })
    const address = await Address.updateOrCreate({'user_id': auth.user?.id as number}, {...payload, user_id: auth.user?.id});
    return address;
  }

  public async destroy({ auth }: HttpContextContract) {
    const address = await Address.findByOrFail('user_id', auth.user?.id as number);
    await address.delete()
  }
}
