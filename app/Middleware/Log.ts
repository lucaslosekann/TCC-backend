import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import LogModel from 'App/Models/Log'

export default class Log {
  public async handle({ request, route }: HttpContextContract, next: () => Promise<void>) {

    const data = {
      ip: request.ip(),
      route: route?.pattern
    }
    LogModel.create(data)
    
    await next()
  }
}
