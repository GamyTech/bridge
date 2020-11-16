# GamyTech Bridge

## Launch the server

To launch the server you only need to type the following command. It will install all the dependencies and start the websocket server.
```bash
$ npm start
```

## Redirections

Currently, the redirections that are made are the following:
```
case 'CashIn':
case 'CashInApco':
case 'CashOutRequest':
case 'Login':
case 'Logout':
case 'PurchaseItem':
case 'RegisterUser':
```

It will redirect the following websocket endpoints requests to a specific server given by the cliend id provider.