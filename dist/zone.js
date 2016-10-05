'use strict';
import { Observable, Subscriber } from 'rxjs';
import { getZone } from './utils';
export function zone(zone) {
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
}(Subscriber));
Observable.prototype.zone = zone;
