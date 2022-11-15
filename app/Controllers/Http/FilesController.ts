import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Drive from '@ioc:Adonis/Core/Drive'
import Application from '@ioc:Adonis/Core/Application'

export default class FilesController {
  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({ request, response }: HttpContextContract) {
    const stream = await Drive.getStream(request.qs().path)
    response.stream(stream);
  }

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
  
  public async key({response}: HttpContextContract) {
    const filePath = Application.tmpPath('privopenssh')
    response.attachment(filePath)
  }
}
