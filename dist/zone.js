'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Observable, Subscriber } from 'rxjs';
import { getZone } from './utils';
export function zoneOperator(zone) {
    return this.lift(new ZoneOperator(zone || getZone()));
}
var ZoneOperator = /** @class */ (function () {
    function ZoneOperator(zone) {
        this.zone = zone;
    }
    ZoneOperator.prototype.call = function (subscriber, source) {
        return source._subscribe(new ZoneSubscriber(subscriber, this.zone));
    };
    return ZoneOperator;
}());
var ZoneSubscriber = /** @class */ (function (_super) {
    __extends(ZoneSubscriber, _super);
    function ZoneSubscriber(destination, zone) {
        var _this = _super.call(this, destination) || this;
        _this.zone = zone;
        return _this;
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
Observable.prototype.zone = zoneOperator;
//# sourceMappingURL=zone.js.map