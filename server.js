const axios = require('axios')
const WebSocket = require('ws')
const server = require('http').createServer()
const wss = new WebSocket.Server({ server, port: 3000 })

wss.on('connection', async (ws, req) => {
  console.log('Someone connected')
  const parsedURL = decodeURI(req.url).replace('/', '')
  const urlJsObj = JSON.parse(parsedURL)
  const resp = await axios.get('http://auth-provider.gamy-tech.com/accounts/' + urlJsObj.ClientId)

  const socketToJSP = new WebSocket('ws://srv0.gamy-tech.com:8080/GamyTechServer2.2B/game/' + parsedURL)
  socketToJSP.on('message', msg => ws.send(msg))

  let XYZCompanyWebSocket
  if (urlJsObj.CliendId !== 'gamytech-client-id') {
    XYZCompanyWebSocket = new WebSocket(resp.data.websocketUrl)
    XYZCompanyWebSocket.on('message', msg => ws.send(msg))
  }
  
  ws.on('message', msg => {
    const convertedToJS = JSON.parse(msg)

    if (urlJsObj.ClientId !== 'gamytech-client-id') {
      switch (convertedToJS.Service) {
        case 'Login':
        case 'Logout':
        case 'RegisterUser':
        case 'ForgotPassword':
        case 'ResetPassword':
        case 'CashIn':
        case 'CashInSkrill':
        case 'CashOutRequest':
          XYZCompanyWebSocket.send(msg)
          break;
        default:
          socketToJSP.send(msg)
          break;
      }
    } else {
      socketToJSP.send(msg)
    }
  })
})










