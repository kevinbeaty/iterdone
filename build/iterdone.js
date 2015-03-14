(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'
module.exports = {
  iterable: require('./lib/iterable'),
  symbol: require('./lib/symbol'),
  toArray: require('./lib/toArray'),
  range: require('./lib/range'),
  count: require('./lib/count'),
  cycle: require('./lib/cycle'),
  repeat: require('./lib/repeat'),
  chain: require('./lib/chain')
}

},{"./lib/chain":2,"./lib/count":3,"./lib/cycle":4,"./lib/iterable":5,"./lib/range":6,"./lib/repeat":7,"./lib/symbol":8,"./lib/toArray":9}],2:[function(require,module,exports){
'use strict'
var iterable = require('./iterable'),
    symbol = require('./symbol'),
    slice = [].slice,
    EMPTY = { next: function(){ return {done:true} } }

module.exports =
function chain(){
  return new Chain(slice.call(arguments))
}

function Chain(iters){
  this.iters = iters
}
Chain.prototype[symbol] = function(){
  var iters = slice.call(this.iters),
      it = shift()

  if(it === void 0) return EMPTY

  return {
    next: function(){
      var next = it.next()
      if(!next.done){
        return next
      }

      it = shift()
      if(it === void 0){
        return {done: true}
      }
      return it.next()
    }
  }

  function shift(){
    var itb = iters.shift()
    return itb && iterable(itb)[symbol]()
  }
}

},{"./iterable":5,"./symbol":8}],3:[function(require,module,exports){
"use strict"
var symbol = require('./symbol')

module.exports =
function count(start, step){
  return new Count(start, step)
}
function Count(start, step){
  if(start === void 0){
    start = 0
  }
  if(step === void 0){
    step = 1
  }
  this.start = start
  this.step = step
}
Count.prototype[symbol] = function(){
  var val = this.start, step = this.step
  return {
    next: function(){
      var prev = val
      val = val + step
      return {done: false, value: prev}
    }
  }
}

},{"./symbol":8}],4:[function(require,module,exports){
'use strict'
var iterable = require('./iterable'),
    symbol = require('./symbol')

module.exports =
function cycle(iter){
  return new Cycle(iter)
}

function Cycle(iter){
  this.iter = iter
}
Cycle.prototype[symbol] = function(){
  var iter = this.iter, it = iterable(iter)[symbol]()
  return {
    next: function(){
      var next = it.next()
      if(next.done){
        it = iterable(iter)[symbol]()
        next = it.next()
      }
      return next
    }
  }
}

},{"./iterable":5,"./symbol":8}],5:[function(require,module,exports){
'use strict'
var symbol = require('./symbol'),
    has = {}.hasOwnProperty,
    keys = Object.keys || _keys,
    toString = Object.prototype.toString,
    isArray = (Array.isArray || predicateToString('Array')),
    has = {}.hasOwnProperty,
    isString = predicateToString('String')

module.exports =
function iterable(value){
  var it
  if(value[symbol] !== void 0){
    it = value
  } else if(isArray(value) || isString(value)){
    it = new ArrayIterable(value)
  } else if(isFunction(value)){
    it = new FunctionIterable(value)
  } else if(isFunction(value.next)){
    it = new FunctionIterable(callNext(value))
  } else {
    it = new ObjectIterable(value)
  }
  return it
}

function callNext(value){
  return function(){
    return value.next()
  }
}

function isFunction(value){
  return typeof value === 'function'
}

function predicateToString(type){
  var str = '[object '+type+']'
  return function(value){
    return toString.call(value) === str
  }
}

// Wrap an Array into an iterable
function ArrayIterable(arr){
  this.arr = arr
}
ArrayIterable.prototype[symbol] = function(){
  var arr = this.arr,
      idx = 0
  return {
    next: function(){
      if(idx >= arr.length){
        return {done: true}
      }

      return {done: false, value: arr[idx++]}
    }
  }
}

// Wrap an function into an iterable that calls function on every next
function FunctionIterable(fn){
  this.fn = fn
}
FunctionIterable.prototype[symbol] = function(){
  var fn = this.fn
  return {
    next: function(){
      return {done: false, value: fn()}
    }
  }
}

// Wrap an Object into an iterable. iterates [key, val]
function ObjectIterable(obj){
  this.obj = obj
  this.keys = keys(obj)
}
ObjectIterable.prototype[symbol] = function(){
  var obj = this.obj,
      keys = this.keys,
      idx = 0
  return {
    next: function(){
      if(idx >= keys.length){
        return {done: true}
      }
      var key = keys[idx++]
      return {done: false, value: [key, obj[key]]}
    }
  }
}

function _keys(obj){
  var prop, keys = []
  for(prop in obj){
    if(has.call(obj, prop)){
      keys.push(prop)
    }
  }
  return keys
}

},{"./symbol":8}],6:[function(require,module,exports){
'use strict'
var symbol = require('./symbol')

module.exports =
function range(start, stop, step){
  return new Range(start, stop, step)
}
function Range(start, stop, step){
  if(step === void 0){
    step = 1
  }
  if(stop === void 0){
    stop = start
    start = 0
  }
  this.start = start
  this.stop = stop
  this.step = step
}
Range.prototype[symbol] = function(){
  var start = this.start,
      stop = this.stop,
      step = this.step,
      val = start
  return {
    next: function(){
      var prev = val
      val = val + step
      if(step > 0 && prev >= stop || step < 0 && prev <= stop){
        return {done: true}
      } else {
        return {done: false, value: prev}
      }
    }
  }
}

},{"./symbol":8}],7:[function(require,module,exports){
'use strict'
var iterable = require('./iterable'),
    symbol = require('./symbol')

module.exports =
function repeat(elem, n){
  if(n === void 0){
    return iterable(function(){
      return elem
    })
  }
  return new Repeat(elem, n)
}

function Repeat(elem, n){
  this.elem = elem
  this.n = n
}
Repeat.prototype[symbol] = function(){
  var elem = this.elem, n = this.n,  idx = 1
  return {
    next: function(){
      if(idx++ > n){
        return {done: true}
      } else {
        return {done: false, value: elem}
      }
    }
  }
}

},{"./iterable":5,"./symbol":8}],8:[function(require,module,exports){
var /* global Symbol */
    /* jshint newcap:false */
    symbolExists = typeof Symbol !== 'undefined'

module.exports = symbolExists ? Symbol.iterator : '@@iterator'

},{}],9:[function(require,module,exports){
'use strict'
var iterable = require('./iterable'),
    symbol = require('./symbol')

module.exports =
function toArray(iter){
  iter = iterable(iter)[symbol]()
  var next = iter.next(),
      arr = []
  while(!next.done){
    arr.push(next.value)
    next = iter.next()
  }
  return arr
}

},{"./iterable":5,"./symbol":8}]},{},[1]);
