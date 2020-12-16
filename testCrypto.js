const AesBase64Crypto = require('./helpers/AesBase64Crypto')

const cryptedAndEncodedMessage = AesBase64Crypto.encrypt(
  JSON.stringify({
    Service: 'Login',
    Email: 'test@sdf',
    Balance: 34,
    ExternalUserId: 1,
    UserName: 'sdafas.dsaf',
    ClientId: 'safdsadfsafd',
    DeviceId: 'adfadfsdf'
  })
)

console.log('Encrypted => ', cryptedAndEncodedMessage)

const uncodedAndDecrepted = AesBase64Crypto.decrypt(cryptedAndEncodedMessage)

console.log('Decrypted => ', uncodedAndDecrepted)
