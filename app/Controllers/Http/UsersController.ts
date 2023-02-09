import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';
import Notification from 'App/Models/Notification';
import User from 'App/Models/User';
import NotificationTokenSchema from 'App/Schemas/NotificationToken';
import UserUpdateSchema from 'App/Schemas/UserUpdate';
import notificate from 'App/Services/PushNotifications';
import axios from 'axios';
import Drive from '@ioc:Adonis/Core/Drive'
import Worker from 'App/Models/Worker';
import UserPhoto from 'App/Models/UserPhoto';
import Address from 'App/Models/Address';

export default class UsersController {
  public async index({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({ auth }: HttpContextContract) {
    const id = auth.user?.id;
    const user = await User.query().preload('address').preload('userPhoto', (photoQuery) => photoQuery.preload('file')).select('*').where('id', id as number).firstOrFail();
    if(user.userPhoto){
      user.userPhoto.file.path = await Drive.getSignedUrl(user.userPhoto.file.path);
    }
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

  public async destroy({request}: HttpContextContract) {
    const id = request.params().id;
    try {
      const user = await User.findOrFail(id);
      const worker = await Worker.findBy('user_id', id);
      const photo = await UserPhoto.findBy('user_id', id);
      const address = await Address.findBy('user_id', id);
      await worker?.delete()
      await photo?.delete()
      await address?.delete()
      await user.delete()
      return true
    } catch (error) {
      console.log(error);
      return false;
    }
  }

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
      const user = await User.findOrFail(auth.user?.id);
      user.notification_token = token;
      await user.save()
    }
    let pendingNotifications = await Notification.query()
    .select('*')
    .where('receiver_id', auth.user?.id as any).exec()
    const messages = pendingNotifications.map(notification => {
      return {
        to: token,
        sound: 'default',
        title: notification.sender_name,
        body: notification.message_type == 'proposal' ? 'Você recebeu uma proposta!' : notification.content || "",
        data: {from: notification.sender_id, senderName: notification.sender_name},
      }
    })
    if(messages.length > 0){
      axios({
        method: 'post',
        url: 'https://exp.host/--/api/v2/push/send',
        data: messages,
        headers: {
            'Accept': 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
          },
      }).catch(e=>{
        console.log(e.response.data )
      });
      await Notification.query()
      .delete()
      .where('receiver_id', auth.user?.id as any).exec()
    }
  }

  public async getChatInfoByUser({ request, response }: HttpContextContract) {
    try {
      console.log(request.params().id)
      let user = await User.query().preload('userPhoto', (photoQuery) => photoQuery.preload('file', f=> f.select('path')).select('file_id')).select('name', 'id').where('id', request.params().id as number).firstOrFail();
      user = user.serialize() as any;
      return {name: user.name, path: user?.userPhoto?.file?.path ? (await Drive.getSignedUrl(user?.userPhoto?.file?.path)) : null}
    } catch (e) {
      console.log(e)
      response.status(500);
    }
  }

}