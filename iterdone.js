"use strict";
var undef,
    proto = require('iterator-protocol'),
    iterable = proto.iterable,
    iterator = proto.iterator,
    symbol = proto.symbol,
    slice = Array.prototype.slice;

module.exports = {
  range: range,
  count: count,
  cycle: cycle,
  repeat: repeat,
  chain: chain
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
