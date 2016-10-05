'use strict';
import { Observable } from 'rxjs';
import { gZone, forkZone, removeObserver } from './utils';
export var ObservableCursor = (function (_super) {
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
    ;
    ObservableCursor.prototype._removedAt = function (doc, at) {
        this._data.splice(at, 1);
        this._handleChange();
    };
    ;
    ObservableCursor.prototype._handleChange = function () {
        var _this = this;
        this._zone.run(function () {
            _this._runNext(_this._data);
        });
    };
    ;
    ObservableCursor.prototype._observeCursor = function (cursor) {
        var _this = this;
        return gZone.run(function () { return cursor.observe({
            addedAt: _this._addedAt.bind(_this),
            changedAt: _this._changedAt.bind(_this),
            removedAt: _this._removedAt.bind(_this)
        }); });
    };
    return ObservableCursor;
}(Observable));
