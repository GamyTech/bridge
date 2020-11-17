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
      case 'Logout':
        ws.send('{"Service":"Logout"}')
        break
      case 'RegisterUser':
        ws.send('{"UserDetails":{"SmsValidation":true,"UserName":"TopGun","CountryISO":"ISR","IsCashOutPending":0,"UserId":"31BA746A-EF7D-E811-80C2-000D3AB168DD","PictureUrl":"https://live.staticflickr.com/5516/14434124163_d87673ef99_b.jpg","Country":"Israel","IsVerified":false,"UserStatus":"VerificationSubmitted"},"MessageEvents":[],"Wallet":{"Cash":"126.32","BonusCash":"103.00","LoyaltyPoints":"879090","TotalLoyaltyPoints":"561985","Multiplier":"0"},"DailyBonus":{"BonusDay":1,"BonusAmount":100},"Response":"LoginAck"}')
        break
      case 'ForgotPassword':
        ws.send('{"Service":"ForgotPassword","Email":"placeyouremail@example.com"}')
        break
      case 'ResetPassword':
        ws.send('{"SetPassword":{},"Response":"ApiUpdateAck"}')
        break
      case 'CashIn':
        ws.send('{"Service":"CashIn","CardNumber":"000000000000","Cvv2":"000","ExpMonth":"02","ExpYear":"20","HolderName":"John Doe","CashToDeposit":"10","CardType":"Mastercard","ShouldSave":true}')
        break
      case 'CashInSkrill':
        ws.send('{"Service":"CashInSkrill","Amount":"10"}')
        break
      case 'CashOutRequest':
        ws.send('{"Service":"CashOutRequest","FirstName":"John","LastName":"Doe","PhoneNumber":"031 111 11 11","Street":"Anonymous street","Number":"1","Country":"America","City":"Los Angeles","PostalCode":"90001","IdImageLink":"https://gamytechstoragever2.blob.core.windows.net/idcards/31BA746A-EF7D-E811-80C2-000D3AB168DD.png","Amount":"10","PayPal":"placeyouremail@example.com","IBAN":"place you iban here"}')
        break
    }
  })
})










