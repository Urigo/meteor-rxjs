# Meteor + RxJS

[![npm version](https://badge.fury.io/js/meteor-rxjs.svg)](https://badge.fury.io/js/meteor-rxjs) [![Build Status](https://travis-ci.org/Urigo/meteor-rxjs.svg?branch=master)](https://travis-ci.org/Urigo/meteor-rxjs) [![bitHound Overall Score](https://www.bithound.io/github/Urigo/meteor-rxjs/badges/score.svg)](https://www.bithound.io/github/Urigo/meteor-rxjs) [![bitHound Code](https://www.bithound.io/github/Urigo/meteor-rxjs/badges/code.svg)](https://www.bithound.io/github/Urigo/meteor-rxjs) [![bitHound Dev Dependencies](https://www.bithound.io/github/Urigo/meteor-rxjs/badges/devDependencies.svg)](https://www.bithound.io/github/Urigo/meteor-rxjs/master/dependencies/npm) 

Harness Meteor reactivity with RxJS.

RxJS is built to simplify complexity dealing with reactive data flows. At the same time, Meteor's Minimongo cursors are a good target for RxJS API due to their reactivity. Thus, combining RxJS and Meteor, we bring together best parts of two worlds.

# API Documentation

API documentation is available inside this repository, [here](https://github.com/Urigo/meteor-rxjs/tree/master/docs).

## Mongo Cursor Observable
As soon as you install this package (`npm install meteor-rxjs`), you have ability to use a special Mongo collection class that works
with cursor observables instead of the ordinary Mongo cursors. In other words, one can subscribe on the Mongo cursor's data updates now as follows:

```ts

import {MongoObservable} from 'meteor-rxjs';

const Tasks = new MongoObservable.Collection<Task>('tasks');

Tasks.find({checked: false})
  .map(tasks => tasks.length)
  .subscribe(todoCount => console.log(todoCount));

```

Since this cursor observable is of RxJS’s type, every other methods and operators available to the observables as part of the RxJS API are also now available to the users, e.g., one can debounce data updates using RxJS’s debouncing operator:

```ts

import {Observable} from 'rxjs';

import 'rxjs/add/operator/debounce';

Tasks.find({checked: false})
  .debounce(() => Observable.interval(50))
  .map(tasks => tasks.length)
  .subscribe(todoCount => console.log(todoCount));

```

## Usage with Meteor packages

Meteor has a lot of packages that extend `Mongo.Collection` with new methods. Since `MongoObservable.Collection` is a wrapper over `Mongo.Collection`, you can't use new methods on observable instances directly. The solution here is to pass `Mongo.Collection`'s instance to the observable constructor, and use them whenever you need after separately:
```ts
let collection = new Mongo.Collection('foo');
let observable = new MongoObservable.Collection(collection);
collection.attachSchema(...); // with SimpleSchema package
```

## Usage in Angular 2

Angular 2 has tight integration with RxJS since Angular 2 is desinged to support reactive UI updates.
One of the realizations of this integration is `AsyncPipe`, which is supposed to be used with RxJS observables.

In order to subscribe on the Mongo cursor observable's updates and iterate through the returned list of docs in Angular 2, one can use `AsyncPipe` in an Angular 2 component as follows:

```ts

const Tasks = new MongoObservable.Collection<Task>('tasks');

@Component({
  selector: 'task-list',
  template: `<ul><li *ngFor="let task of tasks | async"></li></ul>`
})
class Tasks {
  tasks = Tasks.find().zone();
}

````

### Zone operator

As you can see above we called `zone` method of the cursor observable. This is a special
Zone operator that is implemeted by `meteor-rxjs` for the Angular 2 users' convenience.
This operator runs ngZone each time when new data arrives to the Mongo cursor observable,
thus we force UI updates at the right time using it.

It makes sense to improve performance of the above `Tasks` component by debouncing UI updates.
In this case we are using Zone operator as well:

```ts

class List {
  tasks = Tasks.find()
  .debounce(() => Observable.interval(50))
  .zone();
}

```

##License
MIT
