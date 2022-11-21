import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SocialsController {
  public async google({ally}: HttpContextContract) {
    const google = ally.use('google')
    console.log(google)
  }

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
