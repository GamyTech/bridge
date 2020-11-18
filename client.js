const WebSocket = require('ws')
const server = require('http').createServer()
const wss = new WebSocket.Server({ server, port: 3001 })

wss.on('connection', async (ws, req) => {
  console.log('Connected to dummy server')
  ws.on('message', msg => {
    const usableJs = JSON.parse(msg)
    switch (usableJs.Service) {
      case 'Login':
        ws.send('{"Response": "LoginAck", "UserDetails": {"SmsValidation": true, "UserName": "TopGun", "CountryISO": "ISR", "IsCashOutPending": 0, "UserId": "user-id", "PictureUrl": "https://live.staticflickr.com/5516/14434124163_d87673ef99_b.jpg", "Country": "Israel", "IsVerified": false,"UserStatus": "VerificationSubmitted"}, "MessageEvents": [], "Wallet": {"Cash": "126.32", "BonusCash": "103.00", "LoyaltyPoints": "879090","TotalLoyaltyPoints": "561985","Multiplier":"0"}, "DailyBonus": {"BonusDay": 1, "BonusAmount": 100}}')
        break
      case 'Logout':
        ws.send('{"Response": "LogoutAck" }')
        break
      case 'RegisterUser':
        ws.send('{"Response": "RegisterAck", "UserDetails":{"SmsValidation":true,"UserName":"TopGun","CountryISO":"ISR","IsCashOutPending":0,"UserId":"31BA746A-EF7D-E811-80C2-000D3AB168DD","PictureUrl":"https://live.staticflickr.com/5516/14434124163_d87673ef99_b.jpg","Country":"Israel","IsVerified":false,"UserStatus":"VerificationSubmitted"}, "Wallet":{"Cash":"126.32","BonusCash":"103.00","LoyaltyPoints":"879090","TotalLoyaltyPoints":"561985","Multiplier":"0", "Virtual": "123"},"DailyBonus":{"BonusDay":1,"BonusAmount":100}, "Verification": {"VerificationRank": "23", "DepositAmount": "10.23", "MaxAccumulatedSum": "23.23", "MustVerified": true}}')
        break
      case 'ForgotPassword':
        ws.send('{"Response": "ForgotPasswordAck"}')
        break
      case 'ResetPassword':
        ws.send('{"Response": "ApiUpdateAck", "SetPassword": {}}')
        break
      case 'CashIn':
      case 'CashInSkrill':
        ws.send('{"Service":"NotifyCashInSuccess","Cash":10,"BonusCash":1.0,"GetCashInCount":29,"Wallet":{"Cash":"115.56","BonusCash":"102.00","LoyaltyPoints":"882380","TotalLoyaltyPoints":"565275","Multiplier":"0"}}')
        ws.send('{"Response": "CashInAck"}')
        break
      case 'CashOutRequest':
        ws.send('{"Response": "CashOut"}')
        break
    }
  })
})










