"use strict";

/**
 * @constructor
 * @param {Object<string|Function, Object>} container The container.
 */
var Locator = function(container){
    this.container = container;
};

/**
 * @param {Function} obj The object class.
 * @return {Object} The instantiated object.
 */
Locator.prototype.locate = function(obj){
    if(!(obj in this.container)){
        // TODO: key using Function object...
        this.container[obj] = new obj();
    }
    return this.container[obj];
};
