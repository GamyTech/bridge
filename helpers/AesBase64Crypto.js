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

module.exports = decrypt