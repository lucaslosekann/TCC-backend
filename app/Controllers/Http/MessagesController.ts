import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Message from 'App/Models/Message';

export default class MessagesController {
  public async index({request, auth, response}: HttpContextContract) {
    const roomId = request.params().roomid
    if(!roomId){
      return response.badRequest();
    }
    try{
      const unReceivedMessages = await Message.query()
        .select('*')
        .where('to', auth?.user?.id as any)
        .andWhere('room', roomId)
        .andWhere('pending', true).exec()
  
      if(unReceivedMessages.length > 0){
        await Message.query()
          .delete()
          .where('to', auth?.user?.id as any)
          .andWhere('room', roomId)
          .andWhere('pending', true).exec()
      }
      return unReceivedMessages
    }catch(e){
      console.log(e)
    }
  }

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
