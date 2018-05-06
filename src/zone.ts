import { Observable ,  Operator ,  Subscriber } from 'rxjs';

import { getZone } from './utils';

export const zoneOperator = <T>(zone?: Zone) => (source: Observable<T>) => source.lift(new ZoneOperator(zone || getZone()));


class ZoneOperator<T> implements Operator<T, T> {
  constructor(private zone: Zone) {
  }

  call(subscriber: Subscriber<T>, source: any) {
    return source._subscribe(new ZoneSubscriber(subscriber, this.zone));
  }
}

class ZoneSubscriber<T> extends Subscriber<T> {
  constructor(destination: Subscriber<T>,
              private zone: Zone) {
    super(destination);
  }

  protected _next(value: T) {
    this.zone.run(() => {
      this.destination.next(value);
    });
  }

  protected _complete() {
    this.zone.run(() => {
      this.destination.complete();
    });
  }

  protected _error(err?: any) {
    this.zone.run(() => {
      this.destination.error(err);
    });
  }
}
