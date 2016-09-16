# Meteor + RxJS
Use Meteor API in the RxJS style.

One of Meteor’s killer features is a reactive data integration of the server and client built with the help of MongoDB oplog, which is, in other words, continues and almost immediate data interchange between these two tiers. At the same time, to simplify complexity that dealing with reactive data sources sometimes has is what RxJS is designed and built for. So combing RxJS and Meteor API, we are bringing together best parts of two worlds.

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
  tasks = Tasks.find();
}

````

### Zone operator

`meteor-rxjs` implements and exposes a special Zone operator for the Angular 2 users' convenience. It might be helpful if one wants to control when UI updates are made. For example, we can improve performance of the above `Tasks` component by debouncing UI updates as follows:

```ts

class List {
  tasks = Tasks.find()
  .debounce(() => Observable.interval(50))
  .zone();
}

```


