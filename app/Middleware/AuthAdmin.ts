import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
export default class AuthAdminMiddleware {
  
  public async handle ({ auth, response }: HttpContextContract , next: () => Promise<void>) {
    if(auth.user?.is_admin){
      await next()
    }else{
      return response.status(403).json({
        errors: [
          {
            message: "E_FORBIDDEN_ACCESS: Forbidden access"
          }
        ]
      })
    }
  }
}