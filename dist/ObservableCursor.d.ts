/// <reference types="@types/meteor" />
import { Observable } from 'rxjs';
export declare class ObservableCursor<T> extends Observable<T[]> {
    private _zone;
    private _data;
    private _cursor;
    private _hCursor;
    private _observers;
    private _countObserver;
    private _isDataInitinialized;
    /**
     *  Static method which creates an ObservableCursor from Mongo.Cursor.
     *  Use this to create an ObservableCursor object from an existing Mongo.Cursor.
     *  Prefer to create an Cursors from the ObservableCollection instance instead.
     *
     *  @param {Mongo.Cursor<T>} cursor - The Mongo.Cursor to wrap.
     *  @static
     *  @returns {ObservableCursor} Wrapped Cursor.
     */
    static create<T>(cursor: Mongo.Cursor<T>): ObservableCursor<T>;
    /**
     * @constructor
     * @extends Observable
     * @param {Mongo.Cursor<T>} cursor - The Mongo.Cursor to wrap.
     */
    constructor(cursor: Mongo.Cursor<T>);
    /**
     * Returns the actual Mongo.Cursor that wrapped by current ObservableCursor instance.
     * @return {Mongo.Cursor<T>} The actual MongoDB Cursor.
     */
    readonly cursor: Mongo.Cursor<T>;
    /**
     * A wrapper for Mongo.Cursor.count() method - returns an Observable of number, which
     * triggers each time there is a change in the collection, and exposes the number of
     * objects in the collection.
     * @returns {Observable} Observable which trigger the callback when the
     * count of the object changes.
     */
    collectionCount(): Observable<number>;
    /**
     * Stops the observation on the cursor.
     */
    stop(): void;
    /**
     * Clears the Observable definition.
     * Use this method only when the Observable is still cold, and there are no active subscriptions yet.
     */
    dispose(): void;
    /**
     * Return all matching documents as an Array.
     *
     * @return {Array<T>} The array with the matching documents.
     */
    fetch(): Array<T>;
    /**
     * Watch a query. Receive callbacks as the result set changes.
     * @param {Mongo.ObserveCallbacks} callbacks - The callbacks object.
     * @return {Meteor.LiveQueryHandle} The array with the matching documents.
     */
    observe(callbacks: Object): Meteor.LiveQueryHandle;
    /**
     * Watch a query. Receive callbacks as the result set changes.
     * Only the differences between the old and new documents are passed to the callbacks.
     * @param {Mongo.ObserveChangesCallbacks} callbacks - The callbacks object.
     * @return {Meteor.LiveQueryHandle} The array with the matching documents.
     */
    observeChanges(callbacks: Object): Meteor.LiveQueryHandle;
    _runComplete(): void;
    _runNext(data: Array<T>): void;
    _addedAt(doc: any, at: any, before: any): void;
    _changedAt(doc: any, old: any, at: any): void;
    _removedAt(doc: any, at: any): void;
    _movedTo(doc: any, fromIndex: any, toIndex: any): void;
    _handleChange(): void;
    _observeCursor(cursor: Mongo.Cursor<T>): any;
}
