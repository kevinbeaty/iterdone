## Iterdone
[![Build Status](https://secure.travis-ci.org/kevinbeaty/iterdone.svg)](http://travis-ci.org/kevinbeaty/iterdone)

[Itertools][1] as [ES6 Iterables][2].  Useful with (and depends on) [iterator-protocol][3].

Currently supports a the following functions:

```javascript
toArray: function(value)
symbol: Symbol.iterator || '@@iterator'
range: function(start?, stop, step?)
count: function(start?, step?)
cycle: function(iter)
repeat: function(elem, n?)
chain: function(/*args*/)
```

### toArray(value)
Converts the value to an iterator and iterates into an array.

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

[1]: https://docs.python.org/2/library/itertools.html
[2]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/iterable
[3]: https://github.com/transduce/iterator-protocol
