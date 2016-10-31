<a name="ObservableCursor"></a>

## ObservableCursor ⇐ <code>Observable</code>
**Kind**: global class  
**Extends:** <code>Observable</code>  

* [ObservableCursor](#ObservableCursor) ⇐ <code>Observable</code>
    * [new ObservableCursor(cursor)](#new_ObservableCursor_new)
    * _instance_
        * [.cursor](#ObservableCursor+cursor) ⇒ <code>Mongo.Cursor.&lt;T&gt;</code>
        * [.collectionCount()](#ObservableCursor+collectionCount) ⇒ <code>Observable</code>
        * [.stop()](#ObservableCursor+stop)
        * [.dispose()](#ObservableCursor+dispose)
        * [.fetch()](#ObservableCursor+fetch) ⇒ <code>Array.&lt;T&gt;</code>
        * [.observe(callbacks)](#ObservableCursor+observe) ⇒ <code>Meteor.LiveQueryHandle</code>
        * [.observeChanges(callbacks)](#ObservableCursor+observeChanges) ⇒ <code>Meteor.LiveQueryHandle</code>
    * _static_
        * [.create(cursor)](#ObservableCursor.create) ⇒ <code>[ObservableCursor](#ObservableCursor)</code>

<a name="new_ObservableCursor_new"></a>

### new ObservableCursor(cursor)

| Param | Type | Description |
| --- | --- | --- |
| cursor | <code>Mongo.Cursor.&lt;T&gt;</code> | The Mongo.Cursor to wrap. |

<a name="ObservableCursor+cursor"></a>

### observableCursor.cursor ⇒ <code>Mongo.Cursor.&lt;T&gt;</code>
Returns the actual Mongo.Cursor that wrapped by current ObservableCursor instance.

**Kind**: instance property of <code>[ObservableCursor](#ObservableCursor)</code>  
**Returns**: <code>Mongo.Cursor.&lt;T&gt;</code> - The actual MongoDB Cursor.  
<a name="ObservableCursor+collectionCount"></a>

### observableCursor.collectionCount() ⇒ <code>Observable</code>
A wrapper for Mongo.Cursor.count() method - returns an Observable of number, which
triggers each time there is a change in the collection, and exposes the number of
objects in the collection.

**Kind**: instance method of <code>[ObservableCursor](#ObservableCursor)</code>  
**Returns**: <code>Observable</code> - Observable which trigger the callback when the
count of the object changes.  
<a name="ObservableCursor+stop"></a>

### observableCursor.stop()
Stops the observation on the cursor.

**Kind**: instance method of <code>[ObservableCursor](#ObservableCursor)</code>  
<a name="ObservableCursor+dispose"></a>

### observableCursor.dispose()
Clears the Observable definition.
Use this method only when the Observable is still cold, and there are no active subscriptions yet.

**Kind**: instance method of <code>[ObservableCursor](#ObservableCursor)</code>  
<a name="ObservableCursor+fetch"></a>

### observableCursor.fetch() ⇒ <code>Array.&lt;T&gt;</code>
Return all matching documents as an Array.

**Kind**: instance method of <code>[ObservableCursor](#ObservableCursor)</code>  
**Returns**: <code>Array.&lt;T&gt;</code> - The array with the matching documents.  
<a name="ObservableCursor+observe"></a>

### observableCursor.observe(callbacks) ⇒ <code>Meteor.LiveQueryHandle</code>
Watch a query. Receive callbacks as the result set changes.

**Kind**: instance method of <code>[ObservableCursor](#ObservableCursor)</code>  
**Returns**: <code>Meteor.LiveQueryHandle</code> - The array with the matching documents.  

| Param | Type | Description |
| --- | --- | --- |
| callbacks | <code>Mongo.ObserveCallbacks</code> | The callbacks object. |

<a name="ObservableCursor+observeChanges"></a>

### observableCursor.observeChanges(callbacks) ⇒ <code>Meteor.LiveQueryHandle</code>
Watch a query. Receive callbacks as the result set changes.
Only the differences between the old and new documents are passed to the callbacks.

**Kind**: instance method of <code>[ObservableCursor](#ObservableCursor)</code>  
**Returns**: <code>Meteor.LiveQueryHandle</code> - The array with the matching documents.  

| Param | Type | Description |
| --- | --- | --- |
| callbacks | <code>Mongo.ObserveChangesCallbacks</code> | The callbacks object. |

<a name="ObservableCursor.create"></a>

### ObservableCursor.create(cursor) ⇒ <code>[ObservableCursor](#ObservableCursor)</code>
Static method which creates an ObservableCursor from Mongo.Cursor.
 Use this to create an ObservableCursor object from an existing Mongo.Cursor.
 Prefer to create an Cursors from the ObservableCollection instance instead.

**Kind**: static method of <code>[ObservableCursor](#ObservableCursor)</code>  
**Returns**: <code>[ObservableCursor](#ObservableCursor)</code> - Wrapped Cursor.  

| Param | Type | Description |
| --- | --- | --- |
| cursor | <code>Mongo.Cursor.&lt;T&gt;</code> | The Mongo.Cursor to wrap. |

