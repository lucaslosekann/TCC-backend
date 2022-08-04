import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';
import NotificationTokenSchema from 'App/Schemas/NotificationToken';
import UserUpdateSchema from 'App/Schemas/UserUpdate';

export default class UsersController {
  public async index({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({ auth }: HttpContextContract) {
    const id = auth.user?.id;
    const user = await User.query().preload('address').preload('userPhoto', (photoQuery) => photoQuery.preload('file')).select('*').where('id', id as number).firstOrFail();
    return user;
  }

  public async update({ request, auth}: HttpContextContract) {
    const payload = await request.validate({
      schema: UserUpdateSchema
    });
    const user = await User.findOrFail(auth.user?.id);
    await user.merge(payload).save();
    return user;
  }

  public async destroy({}: HttpContextContract) {}

  public async updateNotificationToken( {request, auth} : HttpContextContract){
    const { token } = await request.validate({
      schema: NotificationTokenSchema
    }); 
    const userWithToken = await User.findBy('notification_token', token)
    if(!!userWithToken){
      if(userWithToken.id == auth.user?.id){
        return userWithToken;
      }else{
        await User
          .query()
          .where('notification_token', token)
          .update({ notification_token: null })
        const user = await User.findOrFail(auth.user?.id);
        user.notification_token = token;
        await user.save()
      }
    }else{
      console.log(userWithToken, token)
      const user = await User.findOrFail(auth.user?.id);
      user.notification_token = token;
      await user.save()
    }
    

  }
}