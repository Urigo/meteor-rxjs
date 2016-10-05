(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('rxjs')) :
    typeof define === 'function' && define.amd ? define(['exports', 'rxjs'], factory) :
    (factory((global.meteor = global.meteor || {}, global.meteor.rxjs = global.meteor.rxjs || {}),global.rxjs));
}(this, (function (exports,rxjs) { 'use strict';

var subscribeEvents = ['onReady', 'onError', 'onStop'];
function isMeteorCallbacks(callbacks) {
    return _.isFunction(callbacks) || isCallbacksObject(callbacks);
}
// Checks if callbacks of {@link CallbacksObject} type.
function isCallbacksObject(callbacks) {
    return callbacks && subscribeEvents.some(function (event) {
        return _.isFunction(callbacks[event]);
    });
}

var g = typeof global === 'object' ? global :
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
function forkZone() {
    if (g.Zone) {
        var zone = g.Zone.current;
        if (zone.name === METEOR_RXJS_ZONE) {
            zone = zone.parent || fakeZone;
        }
        return zone.fork({ name: METEOR_RXJS_ZONE });
    }
    return fakeZone;
}
function getZone() {
    if (g.Zone) {
        var zone = g.Zone.current;
        if (zone.name === METEOR_RXJS_ZONE) {
            return zone.parent;
        }
        return zone;
    }
}
function removeObserver(observers, observer, onEmpty) {
    var index = observers.indexOf(observer);
    observers.splice(index, 1);
    if (observers.length === 0 && onEmpty) {
        onEmpty();
    }
}
var gZone = g.Zone ? g.Zone.current : fakeZone;

var ObservableCursor = (function (_super) {
    __extends(ObservableCursor, _super);
    function ObservableCursor(cursor) {
        var _this = this;
        _super.call(this, function (observer) {
            _this._observers.push(observer);
            if (!_this._hCursor) {
                _this._hCursor = _this._observeCursor(cursor);
            }
            return function () {
                removeObserver(_this._observers, observer, function () { return _this.stop(); });
            };
        });
        this._data = [];
        this._observers = [];
        _.extend(this, _.omit(cursor, 'count', 'map'));
        this._cursor = cursor;
        this._zone = forkZone();
    }
    ObservableCursor.create = function (cursor) {
        return new ObservableCursor(cursor);
    };
    Object.defineProperty(ObservableCursor.prototype, "cursor", {
        get: function () {
            return this._cursor;
        },
        enumerable: true,
        configurable: true
    });
    ObservableCursor.prototype.stop = function () {
        var _this = this;
        this._zone.run(function () {
            _this._runComplete();
        });
        if (this._hCursor) {
            this._hCursor.stop();
        }
        this._hCursor = null;
    };
    ObservableCursor.prototype.dispose = function () {
        this._observers = null;
        this._cursor = null;
    };
    ObservableCursor.prototype.fetch = function () {
        return this._cursor.fetch();
    };
    ObservableCursor.prototype.observe = function (callbacks) {
        return this._cursor.observe(callbacks);
    };
    ObservableCursor.prototype.observeChanges = function (callbacks) {
        return this._cursor.observeChanges(callbacks);
    };
    ObservableCursor.prototype._runComplete = function () {
        this._observers.forEach(function (observer) {
            observer.complete();
        });
    };
    ObservableCursor.prototype._runNext = function (data) {
        this._observers.forEach(function (observer) {
            observer.next(data);
        });
    };
    ObservableCursor.prototype._addedAt = function (doc, at, before) {
        this._data.splice(at, 0, doc);
        this._handleChange();
    };
    ObservableCursor.prototype._changedAt = function (doc, old, at) {
        this._data[at] = doc;
        this._handleChange();
    };
    
    ObservableCursor.prototype._removedAt = function (doc, at) {
        this._data.splice(at, 1);
        this._handleChange();
    };
    
    ObservableCursor.prototype._handleChange = function () {
        var _this = this;
        this._zone.run(function () {
            _this._runNext(_this._data);
        });
    };
    
    ObservableCursor.prototype._observeCursor = function (cursor) {
        var _this = this;
        return gZone.run(function () { return cursor.observe({
            addedAt: _this._addedAt.bind(_this),
            changedAt: _this._changedAt.bind(_this),
            removedAt: _this._removedAt.bind(_this)
        }); });
    };
    return ObservableCursor;
}(rxjs.Observable));

(function (MongoObservable) {
    'use strict';
    function fromExisting(collection) {
        return new MongoObservable.Collection(collection);
    }
    MongoObservable.fromExisting = fromExisting;
    var Collection = (function () {
        function Collection(nameOrExisting, options) {
            if (nameOrExisting instanceof Mongo.Collection) {
                this._collection = nameOrExisting;
            }
            else {
                this._collection = new Mongo.Collection(nameOrExisting, options);
            }
        }
        Object.defineProperty(Collection.prototype, "collection", {
            get: function () {
                return this._collection;
            },
            enumerable: true,
            configurable: true
        });
        Collection.prototype.allow = function (options) {
            return this._collection.allow(options);
        };
        Collection.prototype.deny = function (options) {
            return this._collection.deny(options);
        };
        Collection.prototype.rawCollection = function () {
            return this._collection.rawCollection();
        };
        Collection.prototype.rawDatabase = function () {
            return this._collection.rawDatabase();
        };
        Collection.prototype.insert = function (doc) {
            var observers = [];
            var obs = this._createObservable(observers);
            this._collection.insert(doc, function (error, docId) {
                observers.forEach(function (observer) {
                    error ? observer.error(error) :
                        observer.next(docId);
                    observer.complete();
                });
            });
            return obs;
        };
        Collection.prototype.remove = function (selector) {
            var observers = [];
            var obs = this._createObservable(observers);
            this._collection.remove(selector, function (error, removed) {
                observers.forEach(function (observer) {
                    error ? observer.error(error) :
                        observer.next(removed);
                    observer.complete();
                });
            });
            return obs;
        };
        Collection.prototype.update = function (selector, modifier, options) {
            var observers = [];
            var obs = this._createObservable(observers);
            this._collection.update(selector, modifier, options, function (error, updated) {
                observers.forEach(function (observer) {
                    error ? observer.error(error) :
                        observer.next(updated);
                    observer.complete();
                });
            });
            return obs;
        };
        Collection.prototype.upsert = function (selector, modifier, options) {
            var observers = [];
            var obs = this._createObservable(observers);
            this._collection.upsert(selector, modifier, options, function (error, affected) {
                observers.forEach(function (observer) {
                    error ? observer.error(error) :
                        observer.next(affected);
                    observer.complete();
                });
            });
            return obs;
        };
        Collection.prototype.find = function (selector, options) {
            var cursor = this._collection.find.apply(this._collection, arguments);
            return ObservableCursor.create(cursor);
        };
        Collection.prototype.findOne = function (selector, options) {
            return this._collection.findOne.apply(this._collection, arguments);
        };
        Collection.prototype._createObservable = function (observers) {
            return rxjs.Observable.create(function (observer) {
                observers.push(observer);
                return function () {
                    removeObserver(observers, observer);
                };
            });
        };
        return Collection;
    }());
    MongoObservable.Collection = Collection;
})(exports.MongoObservable || (exports.MongoObservable = {}));

function throwInvalidCallback(method) {
    throw new Error("Invalid " + method + " arguments:\n     your last param can't be a callback function, \n     please remove it and use \".subscribe\" of the Observable!");
}
var MeteorObservable = (function () {
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
        return rxjs.Observable.create(function (observer) {
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
        return rxjs.Observable.create(function (observer) {
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
        return rxjs.Observable.create(function (observer) {
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

function zone(zone) {
    return this.lift(new ZoneOperator(zone || getZone()));
}
var ZoneOperator = (function () {
    function ZoneOperator(zone) {
        this.zone = zone;
    }
    ZoneOperator.prototype.call = function (subscriber, source) {
        return source._subscribe(new ZoneSubscriber(subscriber, this.zone));
    };
    return ZoneOperator;
}());
var ZoneSubscriber = (function (_super) {
    __extends(ZoneSubscriber, _super);
    function ZoneSubscriber(destination, zone) {
        _super.call(this, destination);
        this.zone = zone;
    }
    ZoneSubscriber.prototype._next = function (value) {
        var _this = this;
        this.zone.run(function () {
            _this.destination.next(value);
        });
    };
    ZoneSubscriber.prototype._complete = function () {
        var _this = this;
        this.zone.run(function () {
            _this.destination.complete();
        });
    };
    ZoneSubscriber.prototype._error = function (err) {
        var _this = this;
        this.zone.run(function () {
            _this.destination.error(err);
        });
    };
    return ZoneSubscriber;
}(rxjs.Subscriber));
rxjs.Observable.prototype.zone = zone;

exports.MeteorObservable = MeteorObservable;
exports.ObservableCursor = ObservableCursor;
exports.zone = zone;

Object.defineProperty(exports, '__esModule', { value: true });

})));
