import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { AuthenticationException } from '@adonisjs/auth/build/standalone'
export default class AuthAdminMiddleware {
  
  public async handle ({ auth }: HttpContextContract , next: () => Promise<void>) {
    if(auth.user?.is_admin){
      await next()
    }else{
      throw new AuthenticationException(
        'Unauthorized access',
        'E_UNAUTHORIZED_ACCESS'
      )
    }
  }
}