import {chai} from 'meteor/practicalmeteor:chai';
import {sinon} from 'meteor/practicalmeteor:sinon';
import {Observable} from 'rxjs';
import {MeteorObservable, MongoObservable} from 'meteor-rxjs';

import 'zone.js/dist/zone.js';

const expect = chai.expect;

describe('ZoneOperator', () => {
  let observable = new MongoObservable.Collection(null);
  observable.allow({
    insert: function () {
      return true;
    }
  });

  it('Should exist on Observable', () => {
    let obs = Observable.create();
    expect(obs.zone).to.be.function;
  });

  it('Should run in the expected zone on the next', done => {
    let gZone = Zone.current;
    let zone = Zone.current.fork({ name: 'ng'});

    let obs = Observable.create(observer => {
      gZone.run(() => observer.next());
    });
    zone.run(() => {
      obs.zone().subscribe(() => {
        expect(Zone.current).to.equal(zone);
        done();
      });
    });
  });

  it('Zone operator should use propagated zone from the autorun observable',
    done => {
      let zone = Zone.current.fork({ name: 'ng'});
      zone.run(() => {
        let subHandler = MeteorObservable.autorun().subscribe(() => {
          observable.find({}).zone().subscribe(() => {
            expect(Zone.current).to.equal(zone);
            subHandler.unsubscribe();
            done();
          });
        });
      });
      observable.insert({});
    });
});
