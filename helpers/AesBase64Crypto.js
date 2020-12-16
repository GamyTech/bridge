const forge = require('node-forge')

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

const encrypt = msg => {
  const cipher = forge.cipher.createCipher('AES-CBC', key)
  cipher.start({ iv: IV })
  cipher.update(forge.util.createBuffer(msg))
  cipher.finish()
  const encrypted = cipher.output.data
  console.log(encrypted)
  const encryptedAndEncoded = forge.util.encode64(encrypted)
  return encryptedAndEncoded
}

module.exports.decrypt = decrypt
module.exports.encrypt = encrypt