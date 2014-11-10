## Iterdone
[![Build Status](https://secure.travis-ci.org/kevinbeaty/iterdone.svg)](http://travis-ci.org/kevinbeaty/iterdone)

[Itertools][1] for building [ES6 Iterables and Iterators][2].

Currently supports a the following functions:

```javascript
isIterable: function(value);
isIterator: function(value);
iterable: function(value);
iterator: function(value);
toArray: function(iter);
range: function(start?, stop, step?);
count: function(start?, step?);
cycle: function(iter);
repeat: function(elem, n?);
chain: function(/*args*/);
symbol: symbol;
isFunction: function(value);
isArray: function(value);
```

### isIterable
Does the parameter conform to the iterable protocol?

### iterable
Returns the iterable for the parameter.  Returns value if conforms to iterable protocol. Returns `undefined` if cannot return en iterable.

The return value will either conform to iterator protocol that can be invoked for iteration or will be undefined.

Supports anything that returns true for `isIterable` and converts arrays to iterables over each indexed item. Converts to functions to infinite iterables that always call function on next

### isIterator
Does the parameter have an iterator protocol or have a next method?

### iterator
Returns the iterator for the parameter, invoking if has an iterator protocol or returning if has a next method. Returns `undefined` if cannot create an iterator.

The return value will either have a `next` function that can be invoked for iteration or will be undefined.

Supports anything that returns true for `isIterator` and converts arrays to iterators over each indexed item. Converts to functions to infinite iterators that always call function on next.

### toArray
Calls `iterator` on the value and iterates into an array.  Be careful, as some iterators can be infinite.

### range
Create a range of integers.  From start (default 0, inclusive) to stop (exclusive) incremented by step (default 1).

### count
Creates an infinite counting iterator from start (default 0) and incremented by step (default 1)

### cycle
Creates an infinite iterator that accepts an iterable and repeatedly steps through every item of iterator. Once iterator completes, a new iterator is created from the iterable and steps through again.

### repeat
Repeats an elem up to n times.  If n is undefined, creates an infinite iterator that steps the element.

### chain
Combine multiple iterables into a chained iterable.  Once the first argument is exhausted, moves onto the next, until all argument iterables are exhausted.

### symbol
Reference to `Symbol.iterator` or `@@iterator` if `Symbol` is not defined.  Useful for creating your own iterators.

```javascript
var iter = require('iterdone');
MyIter.prototype[iter.symbol] = function(){
   return {
     next: function(){return {done: true}}
   }
}
```

### isFunction, isArray
Predicates to check value, exported for convenience as they are used internally.


[1]: https://docs.python.org/2/library/itertools.html
[2]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/iterable
