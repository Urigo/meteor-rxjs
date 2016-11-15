import { Observable } from 'rxjs';
import { ObservableCursor } from './ObservableCursor';
import { removeObserver } from './utils';
export var MongoObservable;
(function (MongoObservable) {
    'use strict';
    /**
     *  Creates a new MongoObservable.Collection from an existing of predefined Mongo.Collection.
     *  Use this feature to wrap existing collections such as Meteor.users.
     *  @param {Mongo.Collection} collection - The collection.
     *  @returns {MongoObservable.Collection} - Wrapped collection.
     *  @static
     */
    function fromExisting(collection) {
        return new MongoObservable.Collection(collection);
    }
    MongoObservable.fromExisting = fromExisting;
    /**
     * A class represents a MongoDB collection in the client side, wrapped with RxJS
     * Observables, so you can use it with your Angular 2 easier.
     * The wrapper has the same API as Mongo.Collection, only the "find" method returns
     * an ObservableCursor instead of regular Mongo.Cursor.
     *
     * T is a generic type - should be used with the type of the objects inside the collection.
     */
    var Collection = (function () {
        /**
         *  Creates a new Mongo.Collection instance wrapped with Observable features.
         *  @param {String | Mongo.Collection} nameOrExisting - The name of the collection. If null, creates an
         *  unmanaged (unsynchronized) local collection. If provided an instance of existing collection, will
         *  create a wrapper for the existing Mongo.Collection.
         *  @param {ConstructorOptions} options - Creation options.
         *  @constructor
         */
        function Collection(nameOrExisting, options) {
            if (nameOrExisting instanceof Mongo.Collection) {
                this._collection = nameOrExisting;
            }
            else {
                this._collection = new Mongo.Collection(nameOrExisting, options);
            }
        }
        Object.defineProperty(Collection.prototype, "collection", {
            /**
             *  Returns the Mongo.Collection object that wrapped with the MongoObservable.Collection.
             *  @returns {Mongo.Collection<T>} The Collection instance
             */
            get: function () {
                return this._collection;
            },
            enumerable: true,
            configurable: true
        });
        /**
         *  Allow users to write directly to this collection from client code, subject to limitations you define.
         *
         *  @returns {Boolean}
         */
        Collection.prototype.allow = function (options) {
            return this._collection.allow(options);
        };
        /**
         *  Override allow rules.
         *
         *  @returns {Boolean}
         */
        Collection.prototype.deny = function (options) {
            return this._collection.deny(options);
        };
        /**
         *  Returns the Collection object corresponding to this collection from the npm
         *  mongodb driver module which is wrapped by Mongo.Collection.
         *
         *  @returns {Mongo.Collection} The Collection instance
         *
         * @see {@link https://docs.meteor.com/api/collections.html#Mongo-Collection-rawCollection|rawCollection on Meteor documentation}
         */
        Collection.prototype.rawCollection = function () {
            return this._collection.rawCollection();
        };
        /**
         *  Returns the Db object corresponding to this collection's database connection from the
         *  npm mongodb driver module which is wrapped by Mongo.Collection.
         *
         *  @returns {Mongo.Db} The Db instance
         *
         * @see {@link https://docs.meteor.com/api/collections.html#Mongo-Collection-rawDatabase|rawDatabase on Meteor documentation}
         */
        Collection.prototype.rawDatabase = function () {
            return this._collection.rawDatabase();
        };
        /**
         *  Insert a document in the collection.
         *
         *  @param {T} doc - The document to insert. May not yet have an _id
         *  attribute, in which case Meteor will generate one for you.
         *  @returns {Observable<string>} Observable which completes with the inserted ObjectId
         *
         * @see {@link https://docs.meteor.com/api/collections.html#Mongo-Collection-insert|insert on Meteor documentation}
         */
        Collection.prototype.insert = function (doc) {
            var observers = [];
            var obs = this._createObservable(observers);
            this._collection.insert(doc, function (error, docId) {
                observers.forEach(function (observer) {
                    error ? observer.error(error) :
                        observer.next(docId);
                    observer.complete();
                });
            });
            return obs;
        };
        /**
         *  Remove documents from the collection.
         *
         *  @param {Collection~MongoQuerySelector} selector - Specifies which documents to modify
         *  @returns {Observable<Number>} Observable which completes with the number of affected rows
         *
         * @see {@link https://docs.meteor.com/api/collections.html#Mongo-Collection-remove|remove on Meteor documentation}
         */
        Collection.prototype.remove = function (selector) {
            var observers = [];
            var obs = this._createObservable(observers);
            this._collection.remove(selector, function (error, removed) {
                observers.forEach(function (observer) {
                    error ? observer.error(error) :
                        observer.next(removed);
                    observer.complete();
                });
            });
            return obs;
        };
        /**
         *  Modify one or more documents in the collection.
         *
         *  @param {Collection~MongoQuerySelector} selector - Specifies which documents to modify
         *  @param {Modifier} modifier - Specifies how to modify the documents
         *  @param {MongoUpdateOptions} options - Update options
         *  first argument and, if no error, the number of affected documents as the second
         *  @returns {Observable<Number>} Observable which completes with the number of affected rows
         *
         * @see {@link https://docs.meteor.com/api/collections.html#Mongo-Collection-update|update on Meteor documentation}
         */
        Collection.prototype.update = function (selector, modifier, options) {
            var observers = [];
            var obs = this._createObservable(observers);
            this._collection.update(selector, modifier, options, function (error, updated) {
                observers.forEach(function (observer) {
                    error ? observer.error(error) :
                        observer.next(updated);
                    observer.complete();
                });
            });
            return obs;
        };
        /**
         *  Finds the first document that matches the selector, as ordered by sort and skip options.
         *
         *  @param {Collection~MongoQuerySelector} selector - Specifies which documents to modify
         *  @param {Modifier} modifier - Specifies how to modify the documents
         *  @param {MongoUpsertOptions} options - Upsert options
         *  first argument and, if no error, the number of affected documents as the second.
         *  @returns {Observable<{numberAffected, insertedId}>} Observable which completes with an
         *  Object that contain the keys numberAffected and insertedId.
         *
         * @see {@link https://docs.meteor.com/api/collections.html#Mongo-Collection-upsert|upsert on Meteor documentation}
         */
        Collection.prototype.upsert = function (selector, modifier, options) {
            var observers = [];
            var obs = this._createObservable(observers);
            this._collection.upsert(selector, modifier, options, function (error, affected) {
                observers.forEach(function (observer) {
                    error ? observer.error(error) :
                        observer.next(affected);
                    observer.complete();
                });
            });
            return obs;
        };
        /**
         *  Method has the same notation as Mongo.Collection.find, only returns Observable.
         *
         *  @param {Collection~MongoQuerySelector} selector - A query describing the documents to find
         *  @param {Collection~MongoQueryOptions} options - Query options, such as sort, limit, etc.
         *  @returns {ObservableCursor<T>} RxJS Observable wrapped with Meteor features.
         *  @example <caption>Using Angular2 Component</caption>
         *  const MyCollection = MongoObservable.Collection("myCollection");
         *
         *  class MyComponent  {
         *     private myData: ObservableCursor<any>;
         *
         *     constructor() {
         *        this.myData = MyCollection.find({}, {limit: 10});
         *     }
         *  }
         *
         * @see {@link https://docs.meteor.com/api/collections.html#Mongo-Collection-find|find on Meteor documentation}
         */
        Collection.prototype.find = function (selector, options) {
            var cursor = this._collection.find.apply(this._collection, arguments);
            return ObservableCursor.create(cursor);
        };
        /**
         *  Finds the first document that matches the selector, as ordered by sort and skip options.
         *
         *  @param {Collection~MongoQuerySelector} selector - A query describing the documents to find
         *  @param {Collection~MongoQueryOptions} options - Query options, such as sort, limit, etc.
         *  @returns {any} The first object, or `undefined` in case of non-existing object.
         *
         * @see {@link https://docs.meteor.com/api/collections.html#Mongo-Collection-findOne|findOne on Meteor documentation}
         */
        Collection.prototype.findOne = function (selector, options) {
            return this._collection.findOne.apply(this._collection, arguments);
        };
        Collection.prototype._createObservable = function (observers) {
            return Observable.create(function (observer) {
                observers.push(observer);
                return function () {
                    removeObserver(observers, observer);
                };
            });
        };
        return Collection;
    }());
    MongoObservable.Collection = Collection;
})(MongoObservable || (MongoObservable = {}));
/**
 * An options object for MongoDB queries.
 * @typedef {Object} Collection~MongoQueryOptions
 * @property {Object} sort - Sort order (default: natural order)
 * @property {Number} skip - Number of results to skip at the beginning
 * @property {Object} fields - Dictionary of fields to return or exclude.
 * @property {Boolean} reactive - (Client only) Default true; pass false to disable reactivity
 * @property {Function} transform - Overrides transform on the Collection for this cursor. Pass null to disable transformation.
 */
/**
 * A MongoDB query selector representation.
 * @typedef {(Mongo.Selector|Mongo.ObjectID|string)} Collection~MongoQuerySelector
 */
/**
 * A MongoDB query options for upsert action
 * @typedef {Object} Collection~MongoUpsertOptions
 * @property {Boolean} multi - True to modify all matching documents;
 * false to only modify one of the matching documents (the default).
 */
/**
 * A MongoDB query options for update action
 * @typedef {Object} Collection~MongoUpdateOptions
 * @property {Boolean} multi - True to modify all matching documents;
 * @property {Boolean} upsert - True to use upsert logic.
 */
//# sourceMappingURL=ObservableCollection.js.map