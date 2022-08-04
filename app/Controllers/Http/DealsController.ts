import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Deal from 'App/Models/Deal';
import DealSchema from 'App/Schemas/Deals';

export default class DealsController {
  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {}

  public async store({ request }: HttpContextContract) {
    const payload = await request.validate({
      schema: DealSchema
    });
    const newSchema = await Deal.create(payload);
    return newSchema;
  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
