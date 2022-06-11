import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Consumer from "App/Models/Consumer";
import User from "App/Models/User";
import Worker from "App/Models/Worker";
import UserSchema from "App/Schemas/User";
import Drive from '@ioc:Adonis/Core/Drive'
import UserPhoto from "App/Models/UserPhoto";
import File from "App/Models/File";



export default class AuthController {
  public async login({ request, auth }: HttpContextContract) {
    const email = request.input("email");
    const password = request.input("password");
    const token = await auth.use("api").attempt(email, password, {
      expiresIn: "15 days",
    });
    const user =  User.query().preload('userPhoto').select('*').where('id', auth.user?.id as any).firstOrFail();
    return {...token.toJSON(), user};
  }
  public async register({ request, response, auth }: HttpContextContract) {
    try {
      const payload = await request.validate({
        schema: UserSchema
      })
      const isWorker = payload.isWorker;
      delete payload.isWorker;
      const photo = payload.photo;
      delete payload.photo;
      const newUser = await User.create({...payload, is_worker: isWorker});
      if(isWorker){
        await Worker.create({
          userId: newUser.id
        });
      }else{
        await Consumer.create({
          userId: newUser.id
        })
      }
      try{
        const name = `${newUser.id}-${Date.now()}`;
        await photo?.moveToDisk('profileImages',{
          name
        }, 's3')
        const fileInfo = await Drive.getStats(`profileImages/${name}`)
        const file = await File.create({cloudId: fileInfo.etag, drive: 's3', mimeType: photo?.extname, path: `profileImages/${name}`, size: fileInfo.size})
        const url = await Drive.getSignedUrl(`/image/profileImages/${name}`)
        await UserPhoto.create({user_id: newUser.id, file_id: file.id, signedUrl:url})
      }catch(e){
        console.log(e)
      }
      

      const token = await auth.use("api").login(newUser, {
        expiresIn: "7 days",
      });
      const user =  User.query().preload('userPhoto').select('*').where('id', auth.user?.id as any).firstOrFail();
      return {...token.toJSON(), user};
    } catch (error) {
      response.badRequest(error.messages)
    }
  }
  public async me({ auth }: HttpContextContract){
    const id = auth.user?.id;
    const user = await User.query().preload('address').preload('userPhoto').select('*').where('id', id as number).firstOrFail();
    return user;
  }
  public async logout({ auth }: HttpContextContract){
    await auth.use('api').revoke()
    return {
      revoked: true
    }
  }
}
