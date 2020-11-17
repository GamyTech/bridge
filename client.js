const WebSocket = require('ws')
const server = require('http').createServer()
const wss = new WebSocket.Server({ server, port: 3001 })

wss.on('connection', async (ws, req) => {
  console.log('Connected to dummy server')
  ws.on('message', msg => {
    const usableJs = JSON.parse(msg)
    switch (usableJs.Service) {
      case 'Login':
        ws.send('{"UserDetails":{"SmsValidation":true,"UserName":"TopGun","CountryISO":"ISR","IsCashOutPending":0,"UserId":"31BA746A-EF7D-E811-80C2-000D3AB168DD","PictureUrl":"https://live.staticflickr.com/5516/14434124163_d87673ef99_b.jpg","Country":"Israel","IsVerified":false,"UserStatus":"VerificationSubmitted"},"MessageEvents":[],"Wallet":{"Cash":"126.32","BonusCash":"103.00","LoyaltyPoints":"879090","TotalLoyaltyPoints":"561985","Multiplier":"0"},"DailyBonus":{"BonusDay":1,"BonusAmount":100},"Response":"LoginAck"}')
        break
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
        break;
    }
  })
})










