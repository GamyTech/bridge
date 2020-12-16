const axios = require('axios')
const WebSocket = require('ws')
const server = require('http').createServer()
require('dotenv').config()
const wss = new WebSocket.Server({ server, port: process.env.WEBSOCKET_PORT })
const decrypt = require('./helpers/AesBase64Crypto')

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

const updateUserBalanceWithWebsocket = async (ws, newBalance) => {
  try {
    console.log('api => ', ws.externalApiUrl)
    console.log('user id => ', ws.externalUserId)
    console.log('user token => ', ws.token)
    console.log('new balance => ', newBalance)
    const response = await axios.patch(ws.externalApiUrl + '/users/' + ws.externalUserId, { balance: newBalance }, {
      headers: {
        Authorization: 'Bearer ' + ws.token,
        ContentType: 'application/json'
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

  ws.externalApiUrl = resp.data.websocketUrl
  ws.token = urlJsObj.Token

  const socketToJSP = new WebSocket('ws://srv0.gamy-tech.com:8080/GamyTechServer2.2B/game/' + parsedURL)
  socketToJSP.on('message', async msg => {
    const decryptedMessage = JSON.parse(decrypt(msg))
    console.log(decrypt(msg))
    if (urlJsObj.ClientId !== 'gamytech-client-id') {
    // For the winner
      if (decryptedMessage.Service === 'StoppedGame' && decryptedMessage.Wallet !== undefined) {
        ws.balance = ws.balance - decryptedMessage.Fee + decryptedMessage.Bet
        await updateUserBalanceWithWebsocket(ws, ws.balance)
      }

      // For the loser
      if (decryptedMessage.Service === 'StoppedGame' && decryptedMessage.Wallet === undefined) {
        ws.balance = ws.balance - decryptedMessage.Fee
        await updateUserBalanceWithWebsocket(ws, ws.balance)
      }
    }

    ws.send(msg)
  })
  
  ws.on('message', async msg => {
    const convertedToJS = JSON.parse(msg)
    console.log('SENDING =>', JSON.parse(msg))

    if (urlJsObj.ClientId !== 'gamytech-client-id') {
      switch (convertedToJS.Service) {
        case 'Login': {
          if (urlJsObj.Token !== undefined) {
            const user = await getUserWithToken(resp.data.websocketUrl, urlJsObj.Token)
            ws.externalUserId = user.id
            ws.balance = user.balance

            socketToJSP.send(JSON.stringify({
              Service: 'Login',
              Email: user.email,
              Balance: user.balance,
              ExternalUserId: user.id,
              UserName: user.user_name,
              ClientId: urlJsObj.ClientId,
              DeviceId: urlJsObj.DeviceId
            }))
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
