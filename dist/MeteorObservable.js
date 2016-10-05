'use strict';
import { Observable } from 'rxjs';
import { isMeteorCallbacks, forkZone, removeObserver } from './utils';
function throwInvalidCallback(method) {
    throw new Error("Invalid " + method + " arguments:\n     your last param can't be a callback function, \n     please remove it and use \".subscribe\" of the Observable!");
}
export var MeteorObservable = (function () {
    function MeteorObservable() {
    }
    MeteorObservable.call = function (name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var lastParam = args[args.length - 1];
        if (isMeteorCallbacks(lastParam)) {
            throwInvalidCallback('MeteorObservable.call');
        }
        var zone = forkZone();
        return Observable.create(function (observer) {
            Meteor.call.apply(Meteor, [name].concat(args.concat([
                function (error, result) {
                    zone.run(function () {
                        error ? observer.error(error) :
                            observer.next(result);
                        observer.complete();
                    });
                }
            ])));
        });
    };
    MeteorObservable.subscribe = function (name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var lastParam = args[args.length - 1];
        if (isMeteorCallbacks(lastParam)) {
            throwInvalidCallback('MeteorObservable.subscribe');
        }
        var zone = forkZone();
        var observers = [];
        var subscribe = function () {
            return Meteor.subscribe.apply(Meteor, [name].concat(args.concat([{
                    onError: function (error) {
                        zone.run(function () {
                            observers.forEach(function (observer) { return observer.error(error); });
                        });
                    },
                    onReady: function () {
                        zone.run(function () {
                            observers.forEach(function (observer) { return observer.next(); });
                        });
                    }
                }
            ])));
        };
        var subHandler = null;
        return Observable.create(function (observer) {
            observers.push(observer);
            // Execute subscribe lazily.
            if (subHandler === null) {
                subHandler = subscribe();
            }
            return function () {
                removeObserver(observers, observer, function () { return subHandler.stop(); });
            };
        });
    };
    MeteorObservable.autorun = function () {
        var zone = forkZone();
        var observers = [];
        var autorun = function () {
            return Tracker.autorun(function (computation) {
                zone.run(function () {
                    observers.forEach(function (observer) { return observer.next(computation); });
                });
            });
        };
        var handler = null;
        return Observable.create(function (observer) {
            observers.push(observer);
            // Execute autorun lazily.
            if (handler === null) {
                handler = autorun();
            }
            return function () {
                removeObserver(observers, observer, function () { return handler.stop(); });
            };
        });
    };
    return MeteorObservable;
}());
