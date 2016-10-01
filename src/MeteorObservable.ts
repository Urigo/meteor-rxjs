'use strict';

import {Observable, Subscriber} from 'rxjs';
import {isMeteorCallbacks, forkZone, removeObserver} from './utils';

function throwInvalidCallback(method: string) {
  throw new Error(
    `Invalid ${method} arguments:
     your last param can't be a callback function, 
     please remove it and use ".subscribe" of the Observable!`);
}

export class MeteorObservable {
  public static call<T>(name: string, ...args: any[]): Observable<T> {
    const lastParam = args[args.length - 1];

    if (isMeteorCallbacks(lastParam)) {
      throwInvalidCallback('MeteorObservable.call');
    }

    let zone = forkZone();
    return Observable.create((observer: Subscriber<Meteor.Error | T>) => {
      Meteor.call(name, ...args.concat([
        (error: Meteor.Error, result: T) => {
          zone.run(() => {
            error ? observer.error(error) :
              observer.next(result);
            observer.complete();
          });
        }
      ]));
    });
  }

  public static subscribe<T>(name: string, ...args: any[]): Observable<T> {
    let lastParam = args[args.length - 1];

    if (isMeteorCallbacks(lastParam)) {
      throwInvalidCallback('MeteorObservable.subscribe');
    }

    let zone = forkZone();
    let observers = [];
    let subscribe = () => {
      return Meteor.subscribe(name, ...args.concat([{
          onError: (error: Meteor.Error) => {
            zone.run(() => {
              observers.forEach(observer => observer.error(error));
            });
          },
          onReady: () => {
            zone.run(() => {
              observers.forEach(observer => observer.next());
            });
          }
        }
      ]));
    };

    let subHandler = null;
    return Observable.create((observer: Subscriber<Meteor.Error | T>) => {
      observers.push(observer);
      // Execute subscribe lazily.
      if (subHandler === null) {
        subHandler = subscribe();
      }
      return () => {
        removeObserver(observers,
          observer, () => subHandler.stop());
      };
    });
  }

  public static autorun(): Observable<Tracker.Computation> {
    let zone = forkZone();
    let observers = [];
    let autorun = () => {
      return Tracker.autorun((computation: Tracker.Computation) => {
        zone.run(() => {
          observers.forEach(observer => observer.next(computation));
        });
      });
    };

    let handler = null;
    return Observable.create((observer: Subscriber<Meteor.Error | Tracker.Computation>) => {
      observers.push(observer);
      // Execute autorun lazily.
      if (handler === null) {
        handler = autorun();
      }
      return () => {
        removeObserver(observers,
          observer, () => handler.stop());
      };
    });
  }
}
