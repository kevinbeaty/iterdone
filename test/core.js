'use strict'
var tr = require('../'),
    test = require('tape'),
    symbol = tr.symbol,
    toArray = tr.toArray

function count(){
  var cnt = 0
  return function(){
    return cnt++
  }
}

test('iterate array', function(t){
  var arr, iterator, idx

  idx = 0
  arr = [1,2,3]
  iterator = tr.iterable(arr)[symbol]()
  t.deepEquals({value: arr[idx++], done: false}, iterator.next())
  t.deepEquals({value: arr[idx++], done: false}, iterator.next())
  t.deepEquals({value: arr[idx++], done: false}, iterator.next())
  t.ok(iterator.next().done)
  t.ok(iterator.next().done)

  idx = 0
  arr = [2]
  iterator = tr.iterable(arr)[symbol]()
  t.deepEquals({value: arr[idx++], done: false}, iterator.next())
  t.ok(iterator.next().done)
  t.ok(iterator.next().done)

  idx = 0
  arr = []
  iterator = tr.iterable(arr)[symbol]()
  t.ok(iterator.next().done)
  t.ok(iterator.next().done)

  t.end()
})

test('iterate string', function(t){
  var arr, iterator, idx

  idx = 0
  arr = ['1','2','3']
  iterator = tr.iterable('123')[symbol]()
  t.deepEquals({value: arr[idx++], done: false}, iterator.next())
  t.deepEquals({value: arr[idx++], done: false}, iterator.next())
  t.deepEquals({value: arr[idx++], done: false}, iterator.next())
  t.ok(iterator.next().done)
  t.ok(iterator.next().done)

  idx = 0
  arr = ['2']
  iterator = tr.iterable('2')[symbol]()
  t.deepEquals({value: arr[idx++], done: false}, iterator.next())
  t.ok(iterator.next().done)
  t.ok(iterator.next().done)

  idx = 0
  iterator = tr.iterable('')[symbol]()
  t.ok(iterator.next().done)
  t.ok(iterator.next().done)

  t.end()
})

test('iterate object', function(t){
  var obj, arr

  obj = {a:1, b:2, c:3}
  arr = [['a', 1],['b', 2],['c', 3]]

  t.deepEqual(toArray(obj).sort(), arr)
  t.deepEqual(toArray({}), [])

  t.end()
})

test('iterate fn', function(t){
  var fn, iterator, start

  function count(init){
    var cnt = init
    return function(){
      return cnt++
    }
  }

  start = 0
  iterator = tr.iterable(count(start))[symbol]()
  t.deepEquals({value: start++, done: false}, iterator.next())
  t.deepEquals({value: start++, done: false}, iterator.next())
  t.deepEquals({value: start++, done: false}, iterator.next())
  t.deepEquals({value: start++, done: false}, iterator.next())

  start = 10
  iterator = tr.iterable(count(start))[symbol]()
  t.deepEquals({value: start++, done: false}, iterator.next())
  t.deepEquals({value: start++, done: false}, iterator.next())
  t.deepEquals({value: start++, done: false}, iterator.next())
  t.deepEquals({value: start++, done: false}, iterator.next())

  t.end()
})
