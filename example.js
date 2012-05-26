var hash = require('./chronohash')

// configure chronohash
// usually you only need to override the secret
// defaults are presented:
hash.configure({
  algorithm: 'sha1' // hash algorithm
, secret: 'some secret string' // key to be used for the algorithm hmac
, saltLength: 256 // salt size
, min: 10000 // minimum number iterations
, duration: 300 // each hash will take at least this ms to generate
                // This is an approximate value. The real duration should usually
                // be higher because we only measure our own blocking calls
                // and there may be other things happening
})

var password = 'foobar'
hash(password, function (hashed) { // should be called after at least 300ms
  console.log(hashed)
  
  // (save hashed password)

  // ...later
  // compare input with hashed password
  hash.compare('foobar', hashed, function (match) {
    if (match) {
      console.log('correct!')
    }
    else {
      console.log('wrong password')
    }
  })
})
