const axios = require('axios')
const WebSocket = require('ws')
const server = require('http').createServer()
require('dotenv').config()
const wss = new WebSocket.Server({ server, port: process.env.WEBSOCKET_PORT })

const getUserWithToken = async (externalApiUrl, token) => {
  try {
    const response = await axios.get(externalApiUrl + '/get-user-with-token', {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    console.log(error)
  }
}

wss.on('connection', async (ws, req) => {
  console.log('Someone connected')
  const parsedURL = decodeURI(req.url).replace('/', '')
  const urlJsObj = JSON.parse(parsedURL)
  const resp = await axios.get('http://auth-provider.gamy-tech.com/accounts/' + urlJsObj.ClientId)

  const socketToJSP = new WebSocket('ws://srv0.gamy-tech.com:8080/GamyTechServer2.2B/game/' + parsedURL)
  socketToJSP.on('message', msg => ws.send(msg))
  
  ws.on('message', async msg => {
    const convertedToJS = JSON.parse(msg)
    console.log(convertedToJS)

    if (urlJsObj.ClientId !== 'gamytech-client-id') {
      switch (convertedToJS.Service) {
        case 'Login': {
          if (urlJsObj.Token !== undefined) {
            const user = await getUserWithToken(resp.data.websocketUrl, urlJsObj.Token)

            setTimeout(() => {
              socketToJSP.send(JSON.stringify({
                Service: 'Login',
                Email: user.email,
                Balance: user.balance,
                ExternalUserId: user.id,
                UserName: user.user_name,
                ClientId: urlJsObj.ClientId,
                DeviceId: urlJsObj.DeviceId
              }))
            }, 500)
          }
        }
        default:
          socketToJSP.send(msg)
          break;
      }
    } else {
      socketToJSP.send(msg)
    }
  })
})










