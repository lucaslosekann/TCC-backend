import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { LoginSchema } from 'App/Schemas/User';

export default class LoginController {
  public async index({session, view, auth, response }: HttpContextContract) {
    try {
      await auth.use('web').authenticate()
      return response.redirect('/')
    } catch (error) {
      
    }
    const error = session.flashMessages.get('login_error')
    return view.render('login', {
      error
    });
  }
  public async create({}: HttpContextContract) {}
  public async store({session, auth, request, response}: HttpContextContract) {
    const {email, password} = await request.validate({
      schema: LoginSchema
    })
    try {
      await auth.use('web').attempt(email, password)
      response.redirect('/')
    } catch {
      session.flash('login_error', 'Credenciais Inválidas')
      response.redirect('/login');
    }
  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({auth, response}: HttpContextContract) {
    await auth.use('web').logout()
    response.redirect('/login')
  }
}
