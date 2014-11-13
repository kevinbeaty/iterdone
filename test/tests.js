"use strict";
var iter = require('../'),
    proto = require('iterator-protocol'),
    test = require('tape');

test('range', function(t){
  var fn, iterator, start, iterable;

  start = 0;
  iterable = iter.range(4);
  t.deepEquals(proto.toArray(iterable), [0,1,2,3]);

  iterator = proto.iterator(iterable);
  t.deepEquals({value: start++, done: false}, iterator.next());
  t.deepEquals({value: start++, done: false}, iterator.next());
  t.deepEquals({value: start++, done: false}, iterator.next());
  t.deepEquals({value: start++, done: false}, iterator.next());
  t.deepEquals({done: true}, iterator.next());
  t.deepEquals({done: true}, iterator.next());


  start = 10;
  iterable = iter.range(start, 15);
  t.deepEquals(proto.toArray(iterable), [10,11,12,13,14]);

  iterator = proto.iterator(iterable);
  t.deepEquals({value: start++, done: false}, iterator.next());
  t.deepEquals({value: start++, done: false}, iterator.next());
  t.deepEquals({value: start++, done: false}, iterator.next());
  t.deepEquals({value: start++, done: false}, iterator.next());
  t.deepEquals({value: start++, done: false}, iterator.next());
  t.deepEquals({done: true}, iterator.next());
  t.deepEquals({done: true}, iterator.next());

  start = 10;
  iterable = iter.range(start, 6, -1);
  t.deepEquals(proto.toArray(iterable), [10,9,8,7]);

  iterator = proto.iterator(iterable);
  t.deepEquals({value: start--, done: false}, iterator.next());
  t.deepEquals({value: start--, done: false}, iterator.next());
  t.deepEquals({value: start--, done: false}, iterator.next());
  t.deepEquals({value: start--, done: false}, iterator.next());
  t.deepEquals({done: true}, iterator.next());
  t.deepEquals({done: true}, iterator.next());

  t.deepEquals(proto.toArray(iter.range(1,20,3)), [1,4,7,10,13,16,19]);
  t.deepEquals(proto.toArray(iter.range(10,6,-2)), [10,8]);

  t.end();
});

test('count', function(t){
  var fn, iterator, start;

  start = 0;
  iterator = proto.iterator(iter.count());
  t.deepEquals({value: start++, done: false}, iterator.next());
  t.deepEquals({value: start++, done: false}, iterator.next());
  t.deepEquals({value: start++, done: false}, iterator.next());
  t.deepEquals({value: start++, done: false}, iterator.next());

  start = 10;
  iterator = proto.iterator(iter.count(start));
  t.deepEquals({value: start++, done: false}, iterator.next());
  t.deepEquals({value: start++, done: false}, iterator.next());
  t.deepEquals({value: start++, done: false}, iterator.next());
  t.deepEquals({value: start++, done: false}, iterator.next());

  start = 10;
  iterator = proto.iterator(iter.count(start, -1));
  t.deepEquals({value: start--, done: false}, iterator.next());
  t.deepEquals({value: start--, done: false}, iterator.next());
  t.deepEquals({value: start--, done: false}, iterator.next());
  t.deepEquals({value: start--, done: false}, iterator.next());

  t.end();
});

test('cycle', function(t){
  var arr, iterator, idx = 0;

  arr = [1,2,3];
  iterator = proto.iterator(iter.cycle(arr));
  t.deepEquals({value: arr[idx++ % 3], done: false}, iterator.next());
  t.deepEquals({value: arr[idx++ % 3], done: false}, iterator.next());
  t.deepEquals({value: arr[idx++ % 3], done: false}, iterator.next());
  t.deepEquals({value: arr[idx++ % 3], done: false}, iterator.next());
  t.deepEquals({value: arr[idx++ % 3], done: false}, iterator.next());
  t.deepEquals({value: arr[idx++ % 3], done: false}, iterator.next());
  t.deepEquals({value: arr[idx++ % 3], done: false}, iterator.next());


  t.end();
});

test('repeat', function(t){
  var arr, iterator, idx = 0;

  iterator = proto.iterator(iter.repeat(1));
  t.deepEquals({value: 1, done: false}, iterator.next());
  t.deepEquals({value: 1, done: false}, iterator.next());
  t.deepEquals({value: 1, done: false}, iterator.next());
  t.deepEquals({value: 1, done: false}, iterator.next());
  t.deepEquals({value: 1, done: false}, iterator.next());
  t.deepEquals({value: 1, done: false}, iterator.next());
  t.deepEquals({value: 1, done: false}, iterator.next());

  iterator = proto.iterator(iter.repeat(1, 3));
  t.deepEquals({value: 1, done: false}, iterator.next());
  t.deepEquals({value: 1, done: false}, iterator.next());
  t.deepEquals({value: 1, done: false}, iterator.next());
  t.deepEquals({done: true}, iterator.next());
  t.deepEquals({done: true}, iterator.next());
  t.deepEquals({done: true}, iterator.next());
  t.deepEquals({done: true}, iterator.next());

  t.end();
});

test('chain', function(t){
  t.deepEqual(proto.toArray(iter.chain(iter.range(1,4), iter.range(4,7))), [1,2,3,4,5,6]);
  t.deepEqual(proto.toArray(iter.chain()), []);
  t.end();
});
