import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Consumer from "App/Models/Consumer";
import User from "App/Models/User";
import Worker from "App/Models/Worker";
import UserSchema from "App/Schemas/User";
import Drive from '@ioc:Adonis/Core/Drive'
import UserPhoto from "App/Models/UserPhoto";
import File from "App/Models/File";



export default class AuthController {
  public async login({ request, response, auth }: HttpContextContract) {
    const email = request.input("email");
    const password = request.input("password");
    try {
      const token = await auth.use("api").attempt(email, password, {
        expiresIn: "15 days",
      })
      const user = await User.query().preload('userPhoto').select('*').where('id', auth.user?.id as any).firstOrFail();
      return {...token.toJSON(), user};
    } catch (error) {
      switch(error.responseText){
        case "E_INVALID_AUTH_UID: User not found":
          response.status(400).json({error: "Usuário não encontrado"})
          break;
        case "E_INVALID_AUTH_PASSWORD: Password mis-match":
          response.status(400).json({error: "Senha Incorreta"})
          break;
        default: 
          response.status(500).json({error: "Houve um problema, por favor tente novamente mais tarde"})
      }
    }
  }
  public async register({ request, response, auth }: HttpContextContract) {
    try {
      console.log('a')
      const payload = await request.validate({
        schema: UserSchema,
        messages: {
          required: 'O {{ field }} é obrigatório para criar uma nova conta',
          'email.unique': 'Este email já está em uso',
          'phone.unique': 'Este numero de telefone já está em uso',
          'name.notIn': 'O nome é inválido',
          'phone.number': 'O numero de telefone deve ser composto apenas por números',
          'photo.file.size': 'A foto deve ter menos de 5MB',
        }
      })
      const isWorker = payload.isWorker;
      delete payload.isWorker;
      const photo = payload.photo;
      delete payload.photo;
      const newUser = await User.create({...payload, is_worker: isWorker});
      if(isWorker){
        if(!!photo){
          await Worker.create({
            userId: newUser.id
          });
        }else{
          response.status(400).json({error: "Para ser um trabalhador é obrigatório inserir uma foto"})
        }
      }else{
        await Consumer.create({
          userId: newUser.id
        })
      }
      if(!!photo){
        const name = `${newUser.id}-${Date.now()}`;
        await photo?.moveToDisk('profileImages',{
          name
        }, 's3')
        const fileInfo = await Drive.getStats(`profileImages/${name}`)
        const file = await File.create({cloudId: fileInfo.etag, drive: 's3', mimeType: photo?.extname, path: `profileImages/${name}`, size: fileInfo.size})
        const url = await Drive.getSignedUrl(`/image/profileImages/${name}`)
        await UserPhoto.create({user_id: newUser.id, file_id: file.id, signedUrl:url})
      }
      

      const token = await auth.use("api").login(newUser, {
        expiresIn: "7 days",
      });
      const user = await User.query().preload('userPhoto').select('*').where('id', auth.user?.id as any).firstOrFail();
      return {...token.toJSON(), user};
    } catch (error) {
      console.log(error);
      switch(error.message){
        case "E_VALIDATION_FAILURE: Validation Exception":
          response.status(400).json({error: error?.messages?.errors[0]?.message})
          break;
        default: 
          response.status(500).json({error: "Houve um problema, por favor tente novamente mais tarde"})
      }
    }
  }
  public async logout({ auth }: HttpContextContract){
    await auth.use('api').revoke()
    return {
      revoked: true
    }
  }
}
