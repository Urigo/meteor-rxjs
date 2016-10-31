<a name="MeteorComponent"></a>

## MeteorComponent
A class to extend in Angular 2 components.
Contains wrappers over main Meteor methods,
that does some maintenance work behind the scene.
For example, it destroys subscription handles
when the component is being destroyed itself.

**Kind**: global class  

* [MeteorComponent](#MeteorComponent)
    * _instance_
        * [.autorun(func, autoBind)](#MeteorComponent+autorun) ⇒ <code>Tracker.Computation</code>
        * [.subscribe(name, ...args, autoBind)](#MeteorComponent+subscribe) ⇒ <code>Meteor.SubscriptionHandle</code>
        * [.call(name, ...args, autoBind)](#MeteorComponent+call) ⇒ <code>void</code>
    * _inner_
        * [~autorunCallback](#MeteorComponent..autorunCallback) : <code>function</code>

<a name="MeteorComponent+autorun"></a>

### meteorComponent.autorun(func, autoBind) ⇒ <code>Tracker.Computation</code>
Method has the same notation as Meteor.autorun
except the last parameter.

**Kind**: instance method of <code>[MeteorComponent](#MeteorComponent)</code>  
**Returns**: <code>Tracker.Computation</code> - - Object representing the Meteor computation  
**See**

- [Tracker.Computation in Meteor documentation](https://docs.meteor.com/api/tracker.html#tracker_computation)
- [autorun in Meteor documentation](https://docs.meteor.com/api/tracker.html#Tracker-autorun)


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| func | <code>[autorunCallback](#MeteorComponent..autorunCallback)</code> |  | Callback to be executed when current computation is invalidated. The Tracker.Computation object will be passed as argument to this callback. |
| autoBind | <code>Boolean</code> | <code>true</code> | Determine whether Angular2 Zone will run   after the func call to initiate change detection. |

**Example**  
```js
class MyComponent extends MeteorComponent {
   private myData: Mongo.Cursor;
   private dataId: any;

   constructor() {
     super();

     this.autorun(() => {
       this.myData = MyCollection.find({ _id: dataId});
     }, true);
   }
}
```
<a name="MeteorComponent+subscribe"></a>

### meteorComponent.subscribe(name, ...args, autoBind) ⇒ <code>Meteor.SubscriptionHandle</code>
Method has the same notation as Meteor.subscribe:
   subscribe(name, [args1, args2], [callbacks], [autoBind])
 except the last autoBind param (see autorun above).

**Kind**: instance method of <code>[MeteorComponent](#MeteorComponent)</code>  
**Returns**: <code>Meteor.SubscriptionHandle</code> - - The handle of the subscription created by Meteor.  
**See**: [Publication/Subscription in Meteor documentation](http://docs.meteor.com/api/pubsub.html)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | Name of the publication in the Meteor server |
| ...args | <code>any</code> | Parameters that will be forwarded to the publication. |
| autoBind | <code>Boolean</code> | Determine whether Angular 2 zone will run   after the func call to initiate change detection. |

**Example**  
```js
class MyComponent extends MeteorComponent {
    constructor() {
      super();

      this.subscribe("myData", 10);
    }
 }

 
```
<a name="MeteorComponent+call"></a>

### meteorComponent.call(name, ...args, autoBind) ⇒ <code>void</code>
Method has the same notation as Meteor.call:
   call(name, [args1, args2], [callbacks], [autoBind])
 except the last autoBind param (see autorun above).

**Kind**: instance method of <code>[MeteorComponent](#MeteorComponent)</code>  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | Name of the publication in the Meteor server |
| ...args | <code>any</code> | Parameters that will be forwarded to the method. |
| autoBind | <code>Boolean</code> | autoBind Determine whether Angular 2 zone will run   after the func call to initiate change detection. |

**Example**  
```js
class MyComponent extends MeteorComponent {
    constructor() {
      super();

      this.call("serverMethod", (err, result) => {
         // Handle response...
      });
    }
 }

 
```
<a name="MeteorComponent..autorunCallback"></a>

### MeteorComponent~autorunCallback : <code>function</code>
This callback called when autorun triggered by Meteor.

**Kind**: inner typedef of <code>[MeteorComponent](#MeteorComponent)</code>  

| Param | Type |
| --- | --- |
| computation | <code>Tracker.Computation</code> | 

