<a name="MeteorObservable"></a>

## MeteorObservable
This is a class with static methods that wrap Meteor's API and return RxJS
Observables. The methods' signatures are the same as Meteor's, with the ]
exception that the callbacks are handled by Meteor-rxjs. Instead of
providing callbacks, you need to subscribe to the observables that are
returned. The methods that are wrapped in MeteorObservable are
[Meteor.call](https://docs.meteor.com/api/methods.html#Meteor-call),
[Meteor.autorun](https://docs.meteor.com/api/tracker.html#Tracker-autorun)
and [Meteor.subscribe](https://docs.meteor.com/api/pubsub.html#Meteor-subscribe).

**Kind**: global class  

* [MeteorObservable](#MeteorObservable)
    * [.call(name, ...args)](#MeteorObservable.call) ⇒ <code>Observable.&lt;T&gt;</code>
    * [.subscribe(name, ...args)](#MeteorObservable.subscribe) ⇒ <code>Observable</code>
    * [.autorun()](#MeteorObservable.autorun) ⇒ <code>Observable.&lt;T&gt;</code>

<a name="MeteorObservable.call"></a>

### MeteorObservable.call(name, ...args) ⇒ <code>Observable.&lt;T&gt;</code>
Invokes a [Meteor Method](https://docs.meteor.com/api/methods.html)
defined on the server, passing any number of arguments. This method has
the same signature as
[Meteor.call](https://docs.meteor.com/api/methods.html#Meteor-call), only
without the callbacks:
   MeteorObservable.call(name, [...args])

**Kind**: static method of <code>[MeteorObservable](#MeteorObservable)</code>  
**Returns**: <code>Observable.&lt;T&gt;</code> - - RxJS Observable, which completes when the
 server returns a response.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Name of the method in the Meteor server |
| ...args | <code>any</code> | Parameters that will be forwarded to the method.   after the func call to initiate change detection. |

**Example** *(Example using Angular2 Component)*  
```js
 class MyComponent  {
    constructor() {

    }

    doAction(payload) {
       MeteorObservable.call("myData", payload).subscribe((response) => {
          // Handle success and response from server!
       }, (err) => {
         // Handle error
       });
    }
 }
```
<a name="MeteorObservable.subscribe"></a>

### MeteorObservable.subscribe(name, ...args) ⇒ <code>Observable</code>
When you subscribe to a collection, it tells the server to send records to
the client. This method has the same signature as
[Meteor.subscribe](https://docs.meteor.com/api/pubsub.html#Meteor-subscribe),
except without the callbacks again:
   subscribe(name, [...args])

 You can use this method from any Angular2 element - such as Component,
 Pipe or Service.

**Kind**: static method of <code>[MeteorObservable](#MeteorObservable)</code>  
**Returns**: <code>Observable</code> - - RxJS Observable, which completes when the
 subscription is ready.  
**See**: [Publications in Meteor documentation](http://docs.meteor.com/api/pubsub.html)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Name of the publication in the Meteor server |
| ...args | <code>any</code> | Parameters that will be forwarded to the publication.   after the func call to initiate change detection. |

**Example** *(Example using Angular2 Service)*  
```js
 class MyService {
    private meteorSubscription: Observable<any>;

    constructor() {

    }

    subscribeToData() {
       this.meteorSubscription = MeteorObservable.subscribe<any>("myData").subscribe(() => {
          // Subscription is ready!
       });
    }

    unsubscribeToData() {
       this.meteorSubscription.unsubscribe();
    }
 }

 
```
**Example** *(Example using Angular2 Component)*  
```js
 class MyComponent implements OnInit, OnDestroy {
    private meteorSubscription: Observable<any>;

    constructor() {

    }

    ngOnInit() {
       this.meteorSubscription = MeteorObservable.subscribe("myData").subscribe(() => {
          // Subscription is ready!
       });
    }

    ngOnDestroy() {
       this.meteorSubscription.unsubscribe();
    }
 }

 
```
<a name="MeteorObservable.autorun"></a>

### MeteorObservable.autorun() ⇒ <code>Observable.&lt;T&gt;</code>
Allows you to run a function every time there is a change is a reactive
data sources. This method has the same signature as
[Meteor.autorun](https://docs.meteor.com/api/tracker.html#Tracker-autorun),
only without the callback:
   MeteorObservable.autorun()

**Kind**: static method of <code>[MeteorObservable](#MeteorObservable)</code>  
**Returns**: <code>Observable.&lt;T&gt;</code> - - RxJS Observable, which trigger the subscription callback
 each time that Meteor Tracker detects a change.  
**Example** *(Example using Angular2 Component)*  
```js
 class MyComponent  {
    constructor() {

    }

    doAction(payload) {
       MeteorObservable.autorun().subscribe(() => {
          // Handle Tracker autorun change
       });
    }
 }
```
