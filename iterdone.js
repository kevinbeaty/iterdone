"use strict";
/* global Symbol */
var undef,
    symbolExists = typeof Symbol !== 'undefined',
    /* jshint newcap:false */
    symbol = symbolExists ? Symbol.iterator : '@@iterator',
    Arr = Array,
    ArrProto = Arr.prototype,
    slice = ArrProto.slice,
    isArray = (isFunction(Arr.isArray) ? Arr.isArray : _isArray),
    Obj = Object,
    ObjProto = Obj.prototype,
    toString = ObjProto.toString;

module.exports = {
  symbol: symbol,
  isIterable: isIterable,
  isIterator: isIterator,
  iterable: iterable,
  iterator: iterator,
  isFunction: isFunction,
  isArray: isArray,
  toArray: toArray,
  range: range,
  count: count,
  cycle: cycle,
  repeat: repeat,
  chain: chain
};

function isFunction(value){
  return typeof value === 'function';
}

function _isArray(value){
  return toString.call(value) === '[object Array]';
}

function toArray(iter){
  iter = iterator(iter);
  var next = iter.next(),
      arr = [];
  while(!next.done){
    arr.push(next.value);
    next = iter.next();
  }
  return arr;
}

function isIterable(value){
  return (value[symbol] !== undef);
}

function isIterator(value){
  return isIterable(value) ||
    (isFunction(value.next));
}

function iterable(value){
  var it;
  if(isIterable(value)){
    it = value;
  } else if(isArray(value)){
    it = new ArrayIterable(value);
  } else if(isFunction(value)){
    it = new FunctionIterable(value);
  }
  return it;
}

function iterator(value){
  var it = iterable(value);
  if(it !== undef){
    it = it[symbol]();
  } else if(isFunction(value.next)){
    // handle non-well-formed iterators that only have a next method
    it = value;
  }
  return it;
}

// Wrap an Array into an iterable
function ArrayIterable(arr){
  this.arr = arr;
}
ArrayIterable.prototype[symbol] = function(){
  var arr = this.arr,
      idx = 0;
  return {
    next: function(){
      if(idx >= arr.length){
        return {done: true};
      }

      return {done: false, value: arr[idx++]};
    }
  };
};

// Wrap an function into an iterable that calls function on every next
function FunctionIterable(fn){
  this.fn = fn;
}
FunctionIterable.prototype[symbol] = function(){
  var fn = this.fn;
  return {
    next: function(){
      return {done: false, value: fn()};
    }
  };
};

function range(start, stop, step){
  return new Range(start, stop, step);
}
function Range(start, stop, step){
  if(step === undef){
    step = 1;
  }
  if(stop === undef){
    stop = start;
    start = 0;
  }
  this.start = start;
  this.stop = stop;
  this.step = step;
}
Range.prototype[symbol] = function(){
  var start = this.start,
      stop = this.stop,
      step = this.step,
      val = start;
  return {
    next: function(){
      var prev = val;
      val = val + step;
      if(step > 0 && prev >= stop || step < 0 && prev <= stop){
        return {done: true};
      } else {
        return {done: false, value: prev};
      }
    }
  };
};

function count(start, step){
  return new Count(start, step);
}
function Count(start, step){
  if(start === undef){
    start = 0;
  }
  if(step === undef){
    step = 1;
  }
  this.start = start;
  this.step = step;
}
Count.prototype[symbol] = function(){
  var val = this.start, step = this.step;
  return {
    next: function(){
      var prev = val;
      val = val + step;
      return {done: false, value: prev};
    }
  };
};

function cycle(iter){
  return new Cycle(iter);
}

function Cycle(iter){
  this.iter = iter;
}
Cycle.prototype[symbol] = function(){
  var iter = this.iter, it = iterator(iter);
  return {
    next: function(){
      var next = it.next();
      if(next.done){
        it = iterator(iter);
        next = it.next();
      }
      return next;
    }
  };
};

function repeat(elem, n){
  if(n === undef){
    return iterable(function(){
      return elem;
    });
  }
  return new Repeat(elem, n);
}

function Repeat(elem, n){
  this.elem = elem;
  this.n = n;
}
Repeat.prototype[symbol] = function(){
  var elem = this.elem, n = this.n,  idx = 1;
  return {
    next: function(){
      if(idx++ > n){
        return {done: true};
      } else {
        return {done: false, value: elem};
      }
    }
  };
};

function chain(){
  var iters = slice.call(arguments);
  if(!iters.length){
    return iterator(iters);
  }
  return new Chain(iters);
}

function Chain(iters){
  this.iters = iters;
}
Chain.prototype[symbol] = function(){
  var iters = slice.call(this.iters),
      it = shift();
  return {
    next: function(){
      var next = it.next();
      if(!next.done){
        return next;
      }

      it = shift();
      if(it === undef){
        return {done: true};
      }
      return it.next();
    }
  };

  function shift(){
    var itb = iters.shift();
    return itb && iterator(itb);
  }
};
