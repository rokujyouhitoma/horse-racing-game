"use strict";

/**
 * @constructor
 */
var LaneRenderer = function(){};

/**
 * @param {Lane} lane The lane.
 * @return {string} lane string.
 */
LaneRenderer.prototype.Render = function(lane){
    /** @type {Lane} */
    var color = lane.runner.model["color"];
    return [
        this.ToArray(lane).reverse().join(""),
        ["<span style='background-color:#", color, ";'>", lane.number, "</span>"].join(""),
        lane.position,
    ].join("|");
};

/**
 * @param {Lane} lane The lane.
 * @return {Array<string>} lane strings.
 */
LaneRenderer.prototype.ToArray = function(lane){
    var array = [];
    var length = lane.len;
    for(var i=0; i < length + 1; i++){
        array.push((lane.position === i) ? LaneRenderer.CurrentPosition : LaneRenderer.EmptyPosition);
    }
    return array;
};

LaneRenderer.CurrentPosition = "\uD83C\uDFC7"; //Unicode Character 'HORSE RACING' (U+1F3C7)
LaneRenderer.EmptyPosition = "_";
