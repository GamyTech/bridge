const forge = require('node-forge')
const WebSocket = require('ws')
const server = require('http').createServer()
const wss = new WebSocket.Server({ server, port: 8080 })

const PASSWORD = '*M0$#3g@mYT3c#3759*'
const SALT = 'asdfghjk'
const IV = '0123456789abcdef'

const key = forge.pkcs5.pbkdf2(PASSWORD, SALT, 10, 16);


const decrypt = (encryptedMsg) => {
  const bytes = forge.util.decode64(encryptedMsg)
  let decipher = forge.cipher.createDecipher('AES-CBC', key)
  decipher.start({ iv: IV })
  decipher.update(forge.util.createBuffer(bytes))
  const result = decipher.finish()
  return decipher.output.toString()
}


wss.on('connection', (ws, req) => {
  console.log('Someone connected')
  const onlyWhatWeWant = req.url.replace('/backend/', '')
  setTimeout(() => {
    
    const socketToJSP = new WebSocket('ws://srv0.gamy-tech.com:8080/GamyTechServer2.2B/game/' + onlyWhatWeWant)
    socketToJSP.on('message', msg => {
      const decodedMsg = decrypt(msg)
      const convertedToJS = JSON.parse(decodedMsg)
      // console.log(convertedToJS.Service)
      if (convertedToJS.Service === undefined) {
        // console.log(decodedMsg)
      }

      ws.send(msg)
    })
  
    ws.on('message', msg => {

      console.log(msg)
      socketToJSP.send(msg)
    })
  }, 1000)

})










