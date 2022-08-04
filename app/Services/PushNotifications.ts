const axios = require('axios')
export default async function notificate(token:string, title: string, body: string, data: object) {
    const message = {
        to: token,
        sound: 'default',
        title,
        body,
        data,
      };

      axios({
        method: 'post',
        url: 'https://exp.host/--/api/v2/push/send',
        data: message,
        headers: {
            'Accept': 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
          },
      }).catch(console.log);
} 