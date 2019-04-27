const WebSocket = require('ws')

module.exports = {
  connect: (session_id, server_id, server_build) => {
    return new Promise(resolve => {
      const ws = new WebSocket('ws://127.0.0.1:5309/', [], {
        headers: {
          "Connection": "Upgrade",
          "Origin": "https://ui.parsecgaming.com",
          "Sec-WebSocket-Version": "13",
          "Sec-Websocket-Protocol": "permessage-deflate,client_max_window_bits"
        }
      })
  
      let req = {
        "ipc_to": makeid(40),
        "server_build": server_build.toString(),
        "server_id": server_id.toString(),
        "session_id": session_id,
        "x-function": "app_client",
      }
  
      ws.on('open', function open() {
        ws.send(JSON.stringify(req))
      })
  
      ws.on('message', function incoming(data) {
        data = JSON.parse(data)
        resolve(data['x-return'])
      })
    })
  }
}

function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}