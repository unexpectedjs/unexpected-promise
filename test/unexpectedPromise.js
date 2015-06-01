/*global describe, it, setImmediate*/
var unexpected = require('unexpected'),
    unexpectedPromise = require('../lib/unexpectedPromise'),
    Promise = require('avow');

describe('unexpected-promise', function () {
    var expect = unexpected.clone().installPlugin(unexpectedPromise);

    describe('"to be resolved" assertion', function () {
        describe('with no additional argument', function () {
            it('should succeed if the response is resolved with any value', function () {
                return expect(new Promise(function (resolve, reject) {
                    setImmediate(function () {
                        resolve('yay');
                    });
                }), 'to be resolved');
            });

            it('should fail if the promise is rejected', function () {
                return expect(
                    expect(new Promise(function (resolve, reject) {
                        setImmediate(function () {
                            reject('unhappy times');
                        });
                    }), 'to be resolved'),
                    'to be rejected'
                );
            });
        });

        describe('with an additional argument', function () {
            it('should succeed if the response is resolved with a reason satisfying the argument', function () {
                return expect(new Promise(function (resolve, reject) {
                    setImmediate(function () {
                        resolve(123);
                    });
                }), 'to be resolved with', 123);
            });

            it('should fail if the promise is resolved with a value that does not satisfy the argument', function () {
                return expect(
                    expect(new Promise(function (resolve, reject) {
                        setImmediate(function () {
                            resolve({ foo: 'bar', baz: 'quux' });
                        }, 1);
                    }), 'to be resolved with', { baz: 'qux' }),
                    'when rejected',
                    'to have message',
                        "expected Promise to be resolved with { baz: 'qux' }\n" +
                        "  expected { foo: 'bar', baz: 'quux' } to satisfy { baz: 'qux' }\n" +
                        "\n" +
                        "  {\n" +
                        "    foo: 'bar',\n" +
                        "    baz: 'quux' // should equal 'qux'\n" +
                        "                // -quux\n" +
                        "                // +qux\n" +
                        "  }"

                );
            });
        });
    });

    describe('"to be rejected" assertion', function () {
        describe('with no additional argument', function () {
            it('should succeed if the response is rejected for any reason', function () {
                return expect(new Promise(function (resolve, reject) {
                    setImmediate(function () {
                        reject(new Error('OMG!'));
                    });
                }), 'to be rejected');
            });

            it('should fail if the promise is fulfilled', function () {
                return expect(
                    expect(new Promise(function (resolve, reject) {
                        setImmediate(resolve);
                    }), 'to be rejected'),
                    'when rejected',
                    'to have message',
                        'expected Promise to be rejected\n' +
                        '  Promise unexpectedly fulfilled'
                );
            });

            it('should fail if the promise is fulfilled with a value', function () {
                return expect(
                    expect(new Promise(function (resolve, reject) {
                        setImmediate(function () {
                            resolve('happy times');
                        });
                    }), 'to be rejected'),
                    'when rejected',
                    'to have message',
                        "expected Promise to be rejected\n" +
                        "  Promise unexpectedly fulfilled with 'happy times'"
                );
            });
        });

        describe('with an additional argument', function () {
            it('should succeed if the response is rejected with a reason satisfying the argument', function () {
                return expect(new Promise(function (resolve, reject) {
                    setImmediate(function () {
                        reject(new Error('OMG!'));
                    });
                }), 'to be rejected with', new Error('OMG!'));
            });

            it('should fail if the promise is rejected with a reason that does not satisfy the argument', function () {
                return expect(
                    expect(new Promise(function (resolve, reject) {
                        setImmediate(function () {
                            reject(new Error('OMG!'));
                        }, 1);
                    }), 'to be rejected with', new Error('foobar')),
                    'when rejected',
                    'to have message',
                        "expected Promise to be rejected with Error('foobar')\n" +
                        "  expected Error('OMG!') to satisfy Error('foobar')\n" +
                        "\n" +
                        "  Error({\n" +
                        "    message: 'OMG!' // should equal 'foobar'\n" +
                        "                    // -OMG!\n" +
                        "                    // +foobar\n" +
                        "  })"
                );
            });
        });
    });

    describe('"when resolved" adverbial assertion', function () {
        it('should delegate to the next assertion with the resolved value', function () {
            return expect(new Promise(function (resolve, reject) {
                setImmediate(function () {
                    resolve({ foo: 'bar' });
                });
            }), 'when resolved', 'to satisfy', { foo: 'bar' });
        });

        it('should fail when the next assertion fails', function () {
            return expect(
                expect(new Promise(function (resolve, reject) {
                    setImmediate(function () {
                        resolve({ foo: 'bar' });
                    });
                }), 'when resolved', 'to satisfy', { foo: 'baz' }),
                'when rejected',
                'to have message',
                    "expected Promise when resolved to satisfy { foo: 'baz' }\n" +
                    "  expected { foo: 'bar' } to satisfy { foo: 'baz' }\n" +
                    "\n" +
                    "  {\n" +
                    "    foo: 'bar' // should equal 'baz'\n" +
                    "               // -bar\n" +
                    "               // +baz\n" +
                    "  }"
            );
        });
    });

    describe('"when rejected" adverbial assertion', function () {
        it('should delegate to the next assertion with the rejection reason', function () {
            return expect(new Promise(function (resolve, reject) {
                setImmediate(function () {
                    reject({ foo: 'bar' });
                });
            }), 'when rejected', 'to satisfy', { foo: 'bar' });
        });

        it('should fail when the next assertion fails', function () {
            return expect(
                expect(new Promise(function (resolve, reject) {
                    setImmediate(function () {
                        reject({ foo: 'bar' });
                    });
                }), 'when rejected', 'to satisfy', { foo: 'baz' }),
                'when rejected',
                'to have message',
                    "expected Promise when rejected to satisfy { foo: 'baz' }\n" +
                    "  expected { foo: 'bar' } to satisfy { foo: 'baz' }\n" +
                    "\n" +
                    "  {\n" +
                    "    foo: 'bar' // should equal 'baz'\n" +
                    "               // -bar\n" +
                    "               // +baz\n" +
                    "  }"
            );
        });

        it('should fail if the promise is fulfilled', function () {
            return expect(
                expect(new Promise(function (resolve, reject) {
                    setImmediate(resolve);
                }), 'when rejected', 'to equal', new Error('unhappy times')),
                'when rejected',
                'to have message',
                    "expected Promise when rejected 'to equal', Error('unhappy times')\n" +
                    "  Promise unexpectedly fulfilled"
            );
        });

        it('should fail if the promise is fulfilled with a value', function () {
            return expect(
                expect(new Promise(function (resolve, reject) {
                    setImmediate(function () {
                        resolve('happy times');
                    });
                }), 'when rejected', 'to equal', new Error('unhappy times')),
                'when rejected',
                'to have message',
                    "expected Promise when rejected 'to equal', Error('unhappy times')\n" +
                    "  Promise unexpectedly fulfilled with 'happy times'"
            );
        });
    });
});
