var crypto = require('crypto')
var nextTick = require('nexttick')

var hash = exports = module.exports = function (pass, salt, callback) {
  if ('function' === typeof salt) {
    callback = salt
    salt = exports.randomChars(exports.saltLength)
  }
  
  var hashed = hmac(pass + salt)

  var i = 0
  var total = 0

  nextTick
    .while(function () { return total < exports.duration || i < exports.min }, function () {
      var d = Date.now()
      hashed = hmac(hashed)
      total += Date.now() - d
      i++
    })
    .then(function () { callback([ i, salt, hashed ].join('-')) })
}

exports.hash = hash
exports.algorithm = 'sha1'
exports.secret = 'override this'
exports.saltLength = 256
exports.duration = 300
exports.min = 10000

exports.configure = function (opts) {
  for (var k in opts) this[k] = opts[k]
}

exports.hashSync = 
exports.sync = 
exports.Sync = function (pass, salt) {
  if ('undefined' === typeof salt) {
    salt = exports.randomChars(exports.saltLength)
  }

  var hashed = hmac(pass + salt)

  var i = 0
  var d = Date.now()

  while (Date.now() - d < exports.duration || i < exports.min) {
    hashed = hmac(hashed)
    i++
  }
  return [ i, salt, hashed ].join('-')
}

exports.compare =
exports.match = function (pass, oldHashed, callback) {
  var splitted = oldHashed.split('-')
  if (splitted.length < 3) throw new Error('Invalid hash')

  var iterations = splitted[0]
  var salt = splitted[1]

  var hashed = hmac(pass + salt)

  nextTick
    .loop(function () { hashed = hmac(hashed) }, iterations)
    .then(function () { callback(splitted[2] == hashed) })
}

exports.compareSync = 
exports.matchSync = function (pass, oldHashed) {
  var splitted = oldHashed.split('-')
  if (splitted.length < 3) throw new Error('Invalid hash')

  var iterations = splitted[0]
  var salt = splitted[1]

  var hashed = hmac(pass + salt)

  for (var i = iterations; i--;) {
    hashed = hmac(hashed)
  }
  return splitted[2] == hashed
}

exports.randomChars = (function () {
  var chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  return function (len, s) {
    len = len || 24
    s = s || ''
    while (s.length < len) {
      s += chars[Math.random() * chars.length | 0]
    }
    return s
  }
}());

function hmac (s) {
  return crypto.createHmac(exports.algorithm, exports.secret).update(s).digest('hex')
}
