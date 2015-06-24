unexpected-promise
==================

Plugin for the Unexpected assertion lib adding Promise support. Requires Unexpected 7 or above.

NOTE: THIS MODULE SHOULD BE CONSIDERED DEPRECATED AS UNEXPECTED 8.5.0+ HAS THE FEATURES BUILT-IN!

[![NPM version](https://badge.fury.io/js/unexpected-promise.svg)](http://badge.fury.io/js/unexpected-promise)
[![Build Status](https://travis-ci.org/unexpectedjs/unexpected-promise.svg?branch=master)](https://travis-ci.org/unexpectedjs/unexpected-promise)
[![Coverage Status](https://coveralls.io/repos/unexpectedjs/unexpected-promise/badge.svg)](https://coveralls.io/r/unexpectedjs/unexpected-promise)
[![Dependency Status](https://david-dm.org/unexpectedjs/unexpected-promise.svg)](https://david-dm.org/unexpectedjs/unexpected-promise)

![An unexpected promise](logoImage.jpg)

```js
var expect = require('unexpected').installPlugin(require('unexpected-promise'));

it('should DTRT', function () {
    return expect(myPromise, 'to be resolved with', 'foobar');
});

it('should fail', function () {
    return expect(myPromise, 'to be rejected with', new Error('argh'));
});
```

Alternatively you can use the `when resolved` and `when rejected`
assertions to replace the subject with the resolved value or rejection reason,
then apply another assertion to it:


```js
it('should DTRT', function () {
    return expect(myPromise, 'when resolved', 'to equal', 'foobar');
});

it('should fail', function () {
    return expect(myPromise, 'when rejected', 'to have property', 'message', 'argh');
});
```

License
-------

Unexpected-promise is licensed under a standard 3-clause BSD license -- see the `LICENSE` file for details.
