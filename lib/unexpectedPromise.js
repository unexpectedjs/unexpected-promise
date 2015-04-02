module.exports = {
    name: 'unexpected-promise',
    installInto: function (expect) {
        expect.addType({
            name: 'Promise',
            base: 'object',
            inspect: function (promise, depth, output, inspect) {
                return output.text('Promise', 'yellow');
            },
            identify: function (obj) {
                return this.baseType.identify(obj) && typeof obj.then === 'function';
            }
        }).addAssertion('Promise', 'to be rejected [with]', function (expect, subject, value) {
            var flags = this.flags;
            return subject.then(function () {
                throw new Error('Promise unexpectedly fulfilled');
            }).caught(function (reason) {
                if (flags['with'] || typeof value !== 'undefined') {
                    return expect(reason, 'to satisfy', value);
                }
            });
        }).addAssertion('Promise', 'to be resolved [with]', function (expect, subject, value) {
            var flags = this.flags;
            return subject.then(function (obj) {
                if (flags['with'] || typeof value !== 'undefined') {
                    return expect(obj, 'to satisfy', value);
                }
            });
        }).addAssertion('Promise', 'when rejected', function (expect, subject) {
            var that = this;
            return subject.then(function () {
                throw new Error('Promise unexpectedly fulfilled');
            }, function (reason) {
                return that.shift(reason, 0);
            });
        }).addAssertion('Promise', 'when resolved', function (expect, subject) {
            var that = this;
            return subject.then(function (value) {
                return that.shift(value, 0);
            });
        });
    }
};
