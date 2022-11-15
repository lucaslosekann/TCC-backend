import authenticate from 'App/Middleware/AuthSocketIO';
import Message from 'App/Models/Message';
import Notification from 'App/Models/Notification';
import Offer from 'App/Models/Offer';
import User from 'App/Models/User';
import Worker from 'App/Models/Worker';
import notificate from 'App/Services/PushNotifications';
import Ws from 'App/Services/Ws'
import { Socket } from 'socket.io';
Ws.boot()

Ws.io.on('connection', async (socket: Socket) => {
  socket.on('disconnect', ()=>{
    console.log('disconnected')
  })
  try{
    const user = await authenticate(socket)
    console.log("User with id "+user.id+" connected")
    socket.on('send-message', async(payload)=>{
      if(payload.from == user.id && !!validateId(payload.room, user?.id)){
        const clients = Ws.io.sockets.adapter.rooms.get(payload.room);
        const numClients = clients ? clients.size : 0;
        let offer;
        if(payload?.message_type == 'proposal'){
          let {price, service_id, type} = JSON.parse(payload.text);
          const worker = await Worker.findBy('userId', payload.to);
          let data = {
            consumer_id: payload.from,
            worker_id: worker?.id,
            price,
            type,
            service_id
          } as any;
          offer = await Offer.create(data);
          payload.text = JSON.stringify({...JSON.parse(payload.text), offer_id: offer.id})
        }
        socket.emit('my_message', payload);
        if(numClients < 2){
          try{
            await Message.create({
              to: payload.to,
              from: payload.from,
              instant: payload.instant,
              text: payload.text,
              room: payload.room,
              type: payload?.message_type
            })

            const sender = await User.findOrFail(payload.from)
            const receiver = await User.find(payload.to)

            if(!receiver?.notification_token){
              Notification.create({
                receiver_id: payload.to,
                sender_name: sender?.name,
                sender_id: payload.from,
                message_type: payload.message_type
              })
              return;
            };
            notificate(receiver.notification_token, 
              sender?.name,
                payload?.message_type == 'proposal' ? 'Você recebeu uma proposta!' : payload.text,
                 {from: payload.from, senderName: sender?.name})
          }catch(e){
            console.log(e)
          }
          return
        }
        socket.to(payload.room).emit("receive_message", payload);
      }
    })
    socket.on('join-room', async (roomId)=>{
      if(!validateId(roomId, user?.id))return;
      if([...socket.rooms].indexOf(roomId) >= 0)return;
      if([...socket.rooms].length > 1){
        [...socket.rooms].forEach(room => {
          if(room == socket.id)return
          socket.leave(room)
          console.log(`User with ID ${user.id} left room ${room}`);
        })
      }

      socket.join(roomId)

      console.log(`User with ID ${user.id} joined room ${roomId}`);

      const unReceivedMessages = await Message.query()
      .select('*')
      .where('to', user?.id)
      .andWhere('room', roomId)
      .andWhere('pending', true).exec()

      if(unReceivedMessages.length > 0){
        socket.emit("update", unReceivedMessages);
        await Message.query()
          .delete()
          .where('to', user?.id)
          .andWhere('room', roomId)
          .andWhere('pending', true).exec()
      }
      
    })
    socket.on('leave-room', (roomId)=>{
      socket.leave(roomId)
      console.log(`User with ID ${user.id} left room ${roomId}`);
    })
    
  }catch(errors){
    console.log(':(')
    console.log(errors)
  }
})


function validateId(roomId, userId){
  let idArray = roomId.split('-');
  idArray = idArray.map(id => parseInt(id));
  if(idArray.length !== 2) return false;
  const belong = idArray.some(id => userId === id)
  if(!belong) return false;
  return idArray;
}