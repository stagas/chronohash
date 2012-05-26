var hash = require('./chronohash')
var assert = require('assert')

hash.configure({
  secret: 'you cannot find this oh yeah its toooooo looooong'
, duration: 300
})
console.log(hash)
var label, hashed, match

label = 'time for hash to generate Sync'
console.time(label)
hashed = hash.sync('foobar')
console.timeEnd(label)
console.log('password:', hashed)

label = 'time for hash to compare Sync'
console.time(label)
match = hash.compareSync('foobar', hashed)
console.timeEnd(label)
console.log('passwords match:', match)

assert.ok(match)

label = 'time for hash to generate'
console.time(label)
hash('foobar', function (hashed) {
  console.timeEnd(label)
  console.log('password:', hashed)

  label = 'time for hash to compare'
  console.time(label)
  hash.compare('foobar', hashed, function (match) {
    console.timeEnd(label)
    console.log('passwords match:', match)

    assert.ok(match)

    label = 'time for hash to generate blocking'
    console.time(label)

    hash('foobar', function (hashed) {
      console.log('password:', hashed)
      assert.ok(hashed.split('-')[0] > 10000)

      label = 'time for hash to compare blocked'
      console.time(label)
      hash.compare('foobar', hashed, function (match) {
        console.timeEnd(label)
        console.log('passwords match:', match)
    
        assert.ok(match)
      })
    })

    var x = 50000, a = []
    while (x--) a = a.concat([x])
  })
})
