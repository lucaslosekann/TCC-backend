import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Log from 'App/Models/Log'
import Env from '@ioc:Adonis/Core/Env'

export default class LogsController {
    public async index({ request }: HttpContextContract) {
        if(request.qs().senha == Env.get('LOGS_PASS')){
            return await Log.all() 
        }else{
            return 'PRECISA DE SENHA BURRAO'
        }
    }
}
