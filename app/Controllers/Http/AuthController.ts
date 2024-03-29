import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Consumer from "App/Models/Consumer";
import User from "App/Models/User";
import Worker from "App/Models/Worker";
import UserSchema, { ChangePasswordSchema, ChangePhotoSchema } from "App/Schemas/User";
import Drive from '@ioc:Adonis/Core/Drive'
import UserPhoto from "App/Models/UserPhoto";
import File from "App/Models/File";
import Hash from '@ioc:Adonis/Core/Hash'


export default class AuthController {
  public async login({ request, response, auth }: HttpContextContract) {
    const email = request.input("email");
    const password = request.input("password");
    try {
      const token = await auth.use("api").attempt(email, password, {
        expiresIn: "15 days",
      })
      const temp = await User.query().preload('userPhoto').select('*').where('id', auth.user?.id as any).firstOrFail();
      let worker_id;
      if(temp.is_worker){
        const worker = await Worker.findBy('userId', temp.id);
        worker_id = worker?.id;
      }
      let user = {...temp.serialize()} as any;
      user = {...user, worker_id: worker_id || null}
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
      const isWorker = true;
      delete payload.isWorker;
      const photo = payload.photo;
      delete payload.photo;
      const newUser = await User.create({...payload, is_worker: isWorker});
      let worker_id;
      if(isWorker){
          const worker = await Worker.create({
            userId: newUser.id
          });
          worker_id = worker.id;
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
      const temp = await User.query().preload('userPhoto').select('*').where('id', auth.user?.id as any).firstOrFail();
      let user = {...temp.serialize()} as any;
      user = {...user, worker_id: worker_id || null}
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
  public async changePassword({ auth, response, request }: HttpContextContract){
    try {
      const payload = await request.validate({
        schema: ChangePasswordSchema,
      })
      const match = await Hash.verify(auth.user?.password as any, payload.password_old)
      if(!match){
        return response.status(403).json({error: "A senha não corresponde à atual"})
      }
      const user = await User.findOrFail(auth.user?.id)
      user.password = payload.password
      await user.save()
      return true;
    } catch (error) {
      response.status(500).json({error: "Erro"})
    }
  }
  public async changePhoto({ auth, response, request }: HttpContextContract){
    try {
      const payload = await request.validate({
        schema: ChangePhotoSchema,
      })
      const user = await User.findOrFail(auth.user?.id)
      const photo = await UserPhoto.findBy('user_id', user.id)
      if(!!photo){
        const file = await File.findOrFail(photo.file_id);
        const old_photo_path = file.path;
  
        const new_photo = payload.photo;
        const name = `${auth.user?.id}-${Date.now()}`;
        await new_photo?.moveToDisk('profileImages',{
          name
        }, 's3')
        const fileInfo = await Drive.getStats(`profileImages/${name}`)
        file.cloudId = fileInfo.etag as string;
        file.drive = 's3'
        file.mimeType = new_photo.extname as string;
        file.path = `profileImages/${name}`
        file.size = fileInfo.size;
        await file.save()
        await Drive.delete(old_photo_path)
        return true;
      }else{
        const new_photo = payload.photo;
        const name = `${auth.user?.id}-${Date.now()}`;
        await new_photo?.moveToDisk('profileImages',{
          name
        }, 's3')
        const fileInfo = await Drive.getStats(`profileImages/${name}`)
        const file = await File.create({cloudId: fileInfo.etag, drive: 's3', mimeType: new_photo?.extname, path: `profileImages/${name}`, size: fileInfo.size})
        const url = await Drive.getSignedUrl(`profileImages/${name}`)
        await UserPhoto.create({user_id: auth.user?.id, file_id: file.id, signedUrl:url})
        return true;
      }
      
    } catch (error) {
      console.log(error)
      response.status(500).json({error: "Erro"})
    }
  }

  public async removePhoto({ auth, response, request }: HttpContextContract){
    try {
      const user = await User.findOrFail(auth.user?.id)
      const photo = await UserPhoto.findBy('user_id', user.id)
      if(!!photo){
        const file = await File.findOrFail(photo.file_id);
        await Drive.delete(file.path)
        await photo.delete()
        return true;
      }
      return true
    } catch (error) {
      console.log(error)
      response.status(500).json({error: "Erro"})
    }
  }
}
