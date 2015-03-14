'use strict'
var tr = require('../'),
    iter = require('../'),
    test = require('tape'),
    symbol = tr.symbol

test('range', function(t){
  var fn, iterator, start, iterable

  start = 0
  iterable = iter.range(4)
  t.deepEquals(iter.toArray(iterable), [0,1,2,3])

  iterator = tr.iterable(iterable)[symbol]()
  t.deepEquals({value: start++, done: false}, iterator.next())
  t.deepEquals({value: start++, done: false}, iterator.next())
  t.deepEquals({value: start++, done: false}, iterator.next())
  t.deepEquals({value: start++, done: false}, iterator.next())
  t.deepEquals({done: true}, iterator.next())
  t.deepEquals({done: true}, iterator.next())


  start = 10
  iterable = iter.range(start, 15)
  t.deepEquals(iter.toArray(iterable), [10,11,12,13,14])

  iterator = tr.iterable(iterable)[symbol]()
  t.deepEquals({value: start++, done: false}, iterator.next())
  t.deepEquals({value: start++, done: false}, iterator.next())
  t.deepEquals({value: start++, done: false}, iterator.next())
  t.deepEquals({value: start++, done: false}, iterator.next())
  t.deepEquals({value: start++, done: false}, iterator.next())
  t.deepEquals({done: true}, iterator.next())
  t.deepEquals({done: true}, iterator.next())

  start = 10
  iterable = iter.range(start, 6, -1)
  t.deepEquals(iter.toArray(iterable), [10,9,8,7])

  iterator = tr.iterable(iterable)[symbol]()
  t.deepEquals({value: start--, done: false}, iterator.next())
  t.deepEquals({value: start--, done: false}, iterator.next())
  t.deepEquals({value: start--, done: false}, iterator.next())
  t.deepEquals({value: start--, done: false}, iterator.next())
  t.deepEquals({done: true}, iterator.next())
  t.deepEquals({done: true}, iterator.next())

  t.deepEquals(iter.toArray(iter.range(1,20,3)), [1,4,7,10,13,16,19])
  t.deepEquals(iter.toArray(iter.range(10,6,-2)), [10,8])

  t.end()
})

test('count', function(t){
  var fn, iterator, start

  start = 0
  iterator = tr.iterable(iter.count())[symbol]()
  t.deepEquals({value: start++, done: false}, iterator.next())
  t.deepEquals({value: start++, done: false}, iterator.next())
  t.deepEquals({value: start++, done: false}, iterator.next())
  t.deepEquals({value: start++, done: false}, iterator.next())

  start = 10
  iterator = tr.iterable(iter.count(start))[symbol]()
  t.deepEquals({value: start++, done: false}, iterator.next())
  t.deepEquals({value: start++, done: false}, iterator.next())
  t.deepEquals({value: start++, done: false}, iterator.next())
  t.deepEquals({value: start++, done: false}, iterator.next())

  start = 10
  iterator = tr.iterable(iter.count(start, -1))[symbol]()
  t.deepEquals({value: start--, done: false}, iterator.next())
  t.deepEquals({value: start--, done: false}, iterator.next())
  t.deepEquals({value: start--, done: false}, iterator.next())
  t.deepEquals({value: start--, done: false}, iterator.next())

  t.end()
})

test('cycle', function(t){
  var arr, iterator, idx = 0

  arr = [1,2,3]
  iterator = tr.iterable(iter.cycle(arr))[symbol]()
  t.deepEquals({value: arr[idx++ % 3], done: false}, iterator.next())
  t.deepEquals({value: arr[idx++ % 3], done: false}, iterator.next())
  t.deepEquals({value: arr[idx++ % 3], done: false}, iterator.next())
  t.deepEquals({value: arr[idx++ % 3], done: false}, iterator.next())
  t.deepEquals({value: arr[idx++ % 3], done: false}, iterator.next())
  t.deepEquals({value: arr[idx++ % 3], done: false}, iterator.next())
  t.deepEquals({value: arr[idx++ % 3], done: false}, iterator.next())

  t.end()
})

test('repeat', function(t){
  var arr, iterator, idx = 0

  iterator = tr.iterable(iter.repeat(1))[symbol]()
  t.deepEquals({value: 1, done: false}, iterator.next())
  t.deepEquals({value: 1, done: false}, iterator.next())
  t.deepEquals({value: 1, done: false}, iterator.next())
  t.deepEquals({value: 1, done: false}, iterator.next())
  t.deepEquals({value: 1, done: false}, iterator.next())
  t.deepEquals({value: 1, done: false}, iterator.next())
  t.deepEquals({value: 1, done: false}, iterator.next())

  iterator = tr.iterable(iter.repeat(1, 3))[symbol]()
  t.deepEquals({value: 1, done: false}, iterator.next())
  t.deepEquals({value: 1, done: false}, iterator.next())
  t.deepEquals({value: 1, done: false}, iterator.next())
  t.deepEquals({done: true}, iterator.next())
  t.deepEquals({done: true}, iterator.next())
  t.deepEquals({done: true}, iterator.next())
  t.deepEquals({done: true}, iterator.next())

  t.end()
})

test('chain', function(t){
  t.deepEqual(iter.toArray(iter.chain(iter.range(1,4), iter.range(4,7))), [1,2,3,4,5,6])
  t.deepEqual(iter.toArray(iter.chain()), [])
  t.end()
})
