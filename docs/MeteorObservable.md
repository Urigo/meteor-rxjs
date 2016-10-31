<a name="MeteorObservable"></a>

## MeteorObservable
A class with static methods, which wraps Meteor's API and returns
RxJS Observable as return value for all Meteor's API.
The method's signature is the same as Metoer's, except you don't
need to provide callbacks, and you need to "subscribe" instead.
The functionality that wrapped in this implementation is Meteor.call,
Meteor.autorun and Meteor.subscribe.

**Kind**: global class  

* [MeteorObservable](#MeteorObservable)
    * [.call(name, ...args)](#MeteorObservable.call) ⇒ <code>Observable.&lt;T&gt;</code>
    * [.subscribe(name, ...args)](#MeteorObservable.subscribe) ⇒ <code>Observable</code>
    * [.autorun()](#MeteorObservable.autorun) ⇒ <code>Observable.&lt;T&gt;</code>

<a name="MeteorObservable.call"></a>

### MeteorObservable.call(name, ...args) ⇒ <code>Observable.&lt;T&gt;</code>
Method has the same notation as Meteor.call, only without the callbacks:
   MeteorObservable.call(name, [...args])

**Kind**: static method of <code>[MeteorObservable](#MeteorObservable)</code>  
**Returns**: <code>Observable.&lt;T&gt;</code> - - RxJS Observable, which completes when the server return a response.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | Name of the method in the Meteor server |
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
Method has the same notation as Meteor.subscribe, only without the callbacks:
   subscribe(name, [...args])

 You can use this method from any Angular2 element - such as Component, Pipe or
 Service.

**Kind**: static method of <code>[MeteorObservable](#MeteorObservable)</code>  
**Returns**: <code>Observable</code> - - RxJS Observable, which completes when the subscription is ready.  
**See**: [Publications in Meteor documentation](http://docs.meteor.com/api/pubsub.html)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | Name of the publication in the Meteor server |
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
Method has the same notation as Meteor.autorun, only without the callback:
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
