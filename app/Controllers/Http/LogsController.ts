import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Log from 'App/Models/Log'
import Env from '@ioc:Adonis/Core/Env'

export default class LogsController {
    public async index({ request }: HttpContextContract) {
        if(request.qs().senha == Env.get('LOGS_PASS')){
            const logs = Log.all()
            return logs
        }else{
            return 'PRECISA DE SENHA BURRAO'
        }
    }
}
