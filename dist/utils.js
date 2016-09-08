'use strict';
exports.subscribeEvents = ['onReady', 'onError', 'onStop'];
function isMeteorCallbacks(callbacks) {
    return _.isFunction(callbacks) || isCallbacksObject(callbacks);
}
exports.isMeteorCallbacks = isMeteorCallbacks;
// Checks if callbacks of {@link CallbacksObject} type.
function isCallbacksObject(callbacks) {
    return callbacks && exports.subscribeEvents.some(function (event) {
        return _.isFunction(callbacks[event]);
    });
}
exports.isCallbacksObject = isCallbacksObject;
;
exports.g = typeof global === 'object' ? global :
    typeof window === 'object' ? window :
        typeof self === 'object' ? self : this;
var fakeZone = {
    run: function (func) {
        return func();
    }
};
exports.gZone = exports.g.Zone ? exports.g.Zone.current : fakeZone;
