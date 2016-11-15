'use strict';
import { Observable } from 'rxjs';
import { isMeteorCallbacks, forkZone, removeObserver } from './utils';
function throwInvalidCallback(method) {
    throw new Error("Invalid " + method + " arguments:\n     your last param can't be a callback function, \n     please remove it and use \".subscribe\" of the Observable!");
}
/**
 * A class with static methods, which wraps Meteor's API and returns
 * RxJS Observable as return value for all Meteor's API.
 * The method's signature is the same as Metoer's, except you don't
 * need to provide callbacks, and you need to "subscribe" instead.
 * The functionality that wrapped in this implementation is Meteor.call,
 * Meteor.autorun and Meteor.subscribe.
 *
 */
export var MeteorObservable = (function () {
    function MeteorObservable() {
    }
    /**
     *  Method has the same notation as Meteor.call, only without the callbacks:
     *    MeteorObservable.call(name, [...args])
     *
     *  @param {String} name - Name of the method in the Meteor server
     *  @param {any} args - Parameters that will be forwarded to the method.
     *   after the func call to initiate change detection.
     *  @returns {Observable<T>} - RxJS Observable, which completes when the server return a response.
     *  @example <caption>Example using Angular2 Component</caption>
     *  class MyComponent  {
     *     constructor() {
     *
     *     }
     *
     *     doAction(payload) {
     *        MeteorObservable.call("myData", payload).subscribe((response) => {
     *           // Handle success and response from server!
     *        }, (err) => {
     *          // Handle error
     *        });
     *     }
     *  }
     */
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
    /**
     *  Method has the same notation as Meteor.subscribe, only without the callbacks:
     *    subscribe(name, [...args])
     *
     *  You can use this method from any Angular2 element - such as Component, Pipe or
     *  Service.
     *
     *  @param {String} name - Name of the publication in the Meteor server
     *  @param {any} args - Parameters that will be forwarded to the publication.
     *   after the func call to initiate change detection.
     *  @returns {Observable} - RxJS Observable, which completes when the subscription is ready.
     *  @example <caption>Example using Angular2 Service</caption>
     *  class MyService {
     *     private meteorSubscription: Observable<any>;
     *
     *     constructor() {
     *
     *     }
     *
     *     subscribeToData() {
     *        this.meteorSubscription = MeteorObservable.subscribe<any>("myData").subscribe(() => {
     *           // Subscription is ready!
     *        });
     *     }
     *
     *     unsubscribeToData() {
     *        this.meteorSubscription.unsubscribe();
     *     }
     *  }
     *
     *  @example <caption>Example using Angular2 Component</caption>
     *  class MyComponent implements OnInit, OnDestroy {
     *     private meteorSubscription: Observable<any>;
     *
     *     constructor() {
     *
     *     }
     *
     *     ngOnInit() {
     *        this.meteorSubscription = MeteorObservable.subscribe("myData").subscribe(() => {
     *           // Subscription is ready!
     *        });
     *     }
     *
     *     ngOnDestroy() {
     *        this.meteorSubscription.unsubscribe();
     *     }
     *  }
     *
     *  @see {@link http://docs.meteor.com/api/pubsub.html|Publications in Meteor documentation}
     */
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
    /**
     *  Method has the same notation as Meteor.autorun, only without the callback:
     *    MeteorObservable.autorun()
     *
     *  @returns {Observable<T>} - RxJS Observable, which trigger the subscription callback
     *  each time that Meteor Tracker detects a change.
     *  @example <caption>Example using Angular2 Component</caption>
     *  class MyComponent  {
     *     constructor() {
     *
     *     }
     *
     *     doAction(payload) {
     *        MeteorObservable.autorun().subscribe(() => {
     *           // Handle Tracker autorun change
     *        });
     *     }
     *  }
     */
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
//# sourceMappingURL=MeteorObservable.js.map