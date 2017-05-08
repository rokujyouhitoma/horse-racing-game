"use strict";

/**
 * Note: Want to use Variable Event. but...Closure Compiler said...
 * > ERROR - Variable Event first declared in externs.zip//w3c_event.js
 * Therefor, Use Ex prefix.
 * @constructor
 * @param {string} type The event type.
 * @param {ExEventTarget} target The event target object.
 * @param {Object=} opt_payload The payload data (optional).
 */
var ExEvent = function(type, target, opt_payload){
    /** @public */
    this.type = type;
    /** @public */
    this.target = target;
    /** @public */
    this.payload = opt_payload;
};

/**
 * Note: Want to use Variable Event. but...Closure Compiler said...
 * > ERROR - Variable EventTarget first declared in externs.zip//w3c_event.js
 * Therefor, Use Ex prefix.
 * @constructor
 */
var ExEventTarget = function(){
    /** @private {Object<string, Object>} */
    this.eventListeners_ = {};
};

/**
 * @param {string} type The event type.
 * @param {function(ExEvent)} listener The event listener function.
 * @param {Object} publisher The publisher object.
*/
ExEventTarget.prototype.addEventListener = function(type, listener, publisher){
    if(!(type in this.eventListeners_)){
        this.eventListeners_[type] = [];
    }
    var wrapper = function(e) {
        if (typeof listener.handleEvent != 'undefined') {
            listener.handleEvent(e);
        } else {
            listener.call(this, e);
        }
    }.bind(this);
    this.eventListeners_[type].push({
        object: this,
        type: type,
        listener: listener,
        publisher: publisher,
        wrapper: wrapper
    });
};

/**
 * @param {string} type The event type.
 * @param {function(ExEvent)} listener The event listener function.
 * @param {Object} publisher The publisher object.
*/
ExEventTarget.prototype.removeEventListener = function(type, listener, publisher){
    if(!(type in this.eventListeners_)){
        return;
    }
    var eventListeners = this.eventListeners_[type];
    this.eventListeners_[type] = eventListeners.filter(function(eventListener){
        if (eventListener.object == this &&
            eventListener.type == type &&
            eventListener.listener == listener &&
            (!publisher ||
             eventListener.publisher == publisher)){
            return false;
        } else {
            return true;
        }
    }, this);
};

/**
 * @param {string} type The Event type.
 * @param {Object=} opt_publisher The publisher object (optional).
 * @param {Object=} opt_payload The payload object (optional).
 */
ExEventTarget.prototype.dispatchEvent = function(type, opt_publisher, opt_payload){
    if(!(type in this.eventListeners_)){
        return;
    }
    var eventListeners = this.eventListeners_[type];
    eventListeners.forEach(function(eventListener){
        if (eventListener.object == this &&
            eventListener.type == type &&
            (!(eventListener.publisher) ||
             eventListener.publisher == opt_publisher)){
            // TODO: Should be support for type = ExEvent?
//            if(type instanceof ExEvent){
//                type.target = this;
//                type.payload = payload;
//                eventListener.wrapper(type);
//            } else {
                eventListener.wrapper(new ExEvent(type, this, opt_payload));
//            }
        }
    }, this);
};

/**
 * Note: Want to use Variable Event. but...Closure Compiler said...
 * > ERROR - Variable EventListener first declared in externs.zip//w3c_event.js
 * Therefor, Use Ex prefix.
 * @constructor
 * @param {function(ExEvent)} callback The event listener function.
 */
var ExEventListener = function(callback){
    /** @private */
    this.callback_ = callback;
};

/**
 * @param {ExEvent} event The event.
 */
ExEventListener.prototype.handleEvent = function(event){
    this.callback_(event);
};