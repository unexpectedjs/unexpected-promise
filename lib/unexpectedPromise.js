module.exports = {
    name: 'unexpected-promise',
    installInto: function (expect) {
        expect.addType({
            name: 'Promise',
            base: 'object',
            inspect: function (promise, depth, output, inspect) {
                output.jsFunctionName('Promise');
                if (promise.isPending && promise.isPending()) {
                    output.sp().yellow('(pending)');
                } else if (promise.isFulfilled && promise.isFulfilled()) {
                    output.sp().green('(fulfilled)');
                    if (promise.value) {
                        var value = promise.value();
                        if (typeof value !== 'undefined') {
                            output.sp().text('=>').sp().append(inspect(value));
                        }
                    }
                } else if (promise.isRejected && promise.isRejected()) {
                    output.sp().red('(rejected)');
                    var reason = promise.reason();
                    if (typeof reason !== 'undefined') {
                        output.sp().text('=>').sp().append(inspect(promise.reason()));
                    }
                }
            },
            identify: function (obj) {
                return this.baseType.identify(obj) && typeof obj.then === 'function';
            }
        }).addAssertion('Promise', 'to be rejected [with]', function (expect, subject, value) {
            this.errorMode = 'nested';
            var flags = this.flags;
            return subject.then(function (obj) {
                expect.fail(function (output) {
                    output.append(expect.inspect(subject)).sp().text('unexpectedly fulfilled');
                    if (typeof obj !== 'undefined') {
                        output.sp().text('with').sp().append(expect.inspect(obj));
                    }
                });
            }, function (reason) {
                if (flags['with'] || typeof value !== 'undefined') {
                    return expect(reason, 'to satisfy', value);
                }
            });
        }).addAssertion('Promise', 'to be resolved [with]', function (expect, subject, value) {
            this.errorMode = 'nested';
            var flags = this.flags;
            return subject.then(function (obj) {
                if (flags['with'] || typeof value !== 'undefined') {
                    return expect(obj, 'to satisfy', value);
                }
            });
        }).addAssertion('Promise', 'when rejected', function (expect, subject) {
            this.errorMode = 'nested';
            var that = this;
            return subject.then(function (obj) {
                expect.fail(function (output) {
                    output.append(expect.inspect(subject)).sp().text('unexpectedly fulfilled');
                    if (typeof obj !== 'undefined') {
                        output.sp().text('with').sp().append(expect.inspect(obj));
                    }
                });
            }, function (reason) {
                return that.shift(reason, 0);
            });
        }).addAssertion('Promise', 'when resolved', function (expect, subject) {
            this.errorMode = 'nested';
            var that = this;
            return subject.then(function (value) {
                return that.shift(value, 0);
            });
        });
    }
};
