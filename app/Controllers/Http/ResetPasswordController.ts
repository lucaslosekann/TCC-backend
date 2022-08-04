import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ApiToken from 'App/Models/ApiToken'
import ResetPassword from 'App/Schemas/ResetPassword'
import { isBefore, parseISO, subHours } from 'date-fns'

export default class ResetPasswordsController {

  public async store({ request, response }: HttpContextContract) {
    const payload = await request.validate({
      schema: ResetPassword
    })
    const token = await ApiToken.findBy('token', payload.token)
    if(!token)return response.status(400).json({error: "Token Invalido"});

    if(isBefore(parseISO(token.createdAt.toString()), subHours(new Date(), 2))){
      await token.delete()
      return response.status(400).json({error: "Este token já expirou, por favor tente novamente"});
    }

    await token.load('user')
    const user = token.user;

    user.password = payload.password;
    await user.save()
    await token.delete()
  }

}
