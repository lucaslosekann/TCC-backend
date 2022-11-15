import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class WebAdmin {
  public async handle({session, auth, response}: HttpContextContract, next: () => Promise<void>) {
    if(auth.user?.is_admin){
      await next()
    }else{
      session.flash('login_error', 'Página exclusiva para administradores')
      auth.logout();
      response.redirect('/login')
    }
  }
}

  