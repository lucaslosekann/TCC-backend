import authenticate from 'App/Middleware/AuthSocketIO';
import Message from 'App/Models/Message';
import User from 'App/Models/User';
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
        if(numClients < 2){
          try{
            await Message.create({
              to: payload.to,
              from: payload.from,
              instant: payload.instant,
              text: payload.text,
              room: payload.room
            })
            const receiver = await User.find(payload.to)
            if(!receiver?.notification_token)return;
            const sender = await User.findOrFail(payload.from)

            notificate(receiver.notification_token, sender?.name, payload.text, {from: payload.from, senderName: sender?.name})
          }catch(e){
            console.log(e)
          }
          return
        }
        socket.to(payload.room).emit("receive_message", payload);
        console.log(payload)
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