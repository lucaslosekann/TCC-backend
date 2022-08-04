import Mail from '@ioc:Adonis/Addons/Mail'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'
import { randomBytes } from 'crypto'
import { promisify } from 'util'
import ApiToken from 'App/Models/ApiToken'

const ForgotPasswordSchema = schema.create({
  email: schema.string()
})

export default class ForgotPasswordsController {
  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {}

  public async store({ request, response }: HttpContextContract) {
    const payload = await request.validate({
      schema: ForgotPasswordSchema
    })
    try {
      const user = await User.findByOrFail('email', payload.email)
      try{
        const random = await promisify(randomBytes)(3);
        const token = random.toString('hex').toUpperCase();

        ApiToken.updateOrCreate({userId: user.id, type: 'forgotpassword', name: 'Random Bytes Token'}, {
          token,
          type: 'forgotpassword',
          name: 'Random Bytes Token'
        })

        await Mail.send((message) => {
          message
            .from('jobhub@jobhub.com.br')
            .to(payload.email)
            .subject('Seu código de recuperação da conta do Jobhub é: '+ token)
            .htmlView('emails/forgotpassword', {name: user.name, token})
        }).then((a)=>{
          console.log(a)
        })
      }catch(e){
        console.log(e)
      }
    } catch (e) {
      return response.status(404).json({error: "Não existe um usuário cadastrado com esse email"});
    }
  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
