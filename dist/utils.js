'use strict';
export var subscribeEvents = ['onReady', 'onError', 'onStop'];
export function isMeteorCallbacks(callbacks) {
    return _.isFunction(callbacks) || isCallbacksObject(callbacks);
}
// Checks if callbacks of {@link CallbacksObject} type.
export function isCallbacksObject(callbacks) {
    return callbacks && subscribeEvents.some(function (event) {
        return _.isFunction(callbacks[event]);
    });
}
;
export var g = typeof global === 'object' ? global :
    typeof window === 'object' ? window :
        typeof self === 'object' ? self : undefined;
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
export function forkZone() {
    if (g.Zone) {
        var zone = g.Zone.current;
        if (zone.name === METEOR_RXJS_ZONE) {
            zone = zone.parent || fakeZone;
        }
        return zone.fork({ name: METEOR_RXJS_ZONE });
    }
    return fakeZone;
}
export function getZone() {
    if (g.Zone) {
        var zone = g.Zone.current;
        if (zone.name === METEOR_RXJS_ZONE) {
            return zone.parent;
        }
        return zone;
    }
}
export function removeObserver(observers, observer, onEmpty) {
    var index = observers.indexOf(observer);
    observers.splice(index, 1);
    if (observers.length === 0 && onEmpty) {
        onEmpty();
    }
}
export var gZone = g.Zone ? g.Zone.current : fakeZone;
//# sourceMappingURL=utils.js.map