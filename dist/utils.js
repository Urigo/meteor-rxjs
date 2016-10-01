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
var METEOR_RXJS_ZONE = 'meteor-rxjs-zone';
var fakeZone = {
    name: METEOR_RXJS_ZONE,
    run: function (func) {
        return func();
    },
    fork: function (spec) {
        return fakeZone;
    }
};
function forkZone() {
    if (exports.g.Zone) {
        var zone = exports.g.Zone.current;
        if (zone.name === METEOR_RXJS_ZONE) {
            zone = zone.parent || fakeZone;
        }
        return zone.fork({ name: METEOR_RXJS_ZONE });
    }
    return fakeZone;
}
exports.forkZone = forkZone;
function getZone() {
    if (exports.g.Zone) {
        var zone = exports.g.Zone.current;
        if (zone.name === METEOR_RXJS_ZONE) {
            return zone.parent;
        }
        return zone;
    }
}
exports.getZone = getZone;
function removeObserver(observers, observer, onEmpty) {
    var index = observers.indexOf(observer);
    observers.splice(index, 1);
    if (observers.length === 0 && onEmpty) {
        onEmpty();
    }
}
exports.removeObserver = removeObserver;
exports.gZone = exports.g.Zone ? exports.g.Zone.current : fakeZone;
