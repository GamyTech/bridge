const axios = require('axios')
const WebSocket = require('ws')
const server = require('http').createServer()
const wss = new WebSocket.Server({ server, port: 3000 })
const decrypt = require('./helpers/AesBase64Crypto')

wss.on('connection', async (ws, req) => {
  console.log('Someone connected')
  const parsedURL = req.url.replace('/backend/', '')
  const urlJsObj = JSON.parse(decodeURI(parsedURL))

  urlJsObj.CliendId = 'gamytech-client-id'
  console.log(urlJsObj.CliendId)
  const resp = await axios.get('http://auth-provider.gamy-tech.com/accounts/' + urlJsObj.CliendId)
  console.log(resp.data.websocketUrl)

  setTimeout(() => {
    const socketToJSP = new WebSocket('ws://srv0.gamy-tech.com:8080/GamyTechServer2.2B/game/' + parsedURL)
    socketToJSP.on('message', msg => {
      // const decodedMsg = decrypt(msg)
      // const convertedToJS = JSON.parse(decodedMsg)
      ws.send(msg)
    })

    if (urlJsObj.CliendId !== 'gamytech-client-id') {
      const XYZCompanyWebSocket = new WebSocket(resp.data.websocketUrl + parsedURL)
      XYZCompanyWebSocket.on('message', msg => {
        console.log('XYZCompanyWebSocket -> :', msg)
        ws.send(msg)
      })
    }
  
    ws.on('message', msg => {
      const convertedToJS = JSON.parse(msg)

      if (urlJsObj.CliendId !== 'gamytech-client-id') {
        switch (convertedToJS.Service) {
          case 'CashIn':
          case 'CashInApco':
          case 'CashOutRequest':
          case 'Login':
          case 'Logout':
          case 'PurchaseItem':
          case 'RegisterUser':
          // case 'ApiRequest':
          // case 'ApiUpdate':
          // case 'DeleteCard':
          // case 'ForgotPassword':
          // case 'ResetPassword':
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
  }, 1000)
})










