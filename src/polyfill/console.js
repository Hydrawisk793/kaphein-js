/* eslint-disable no-global-assign */

/**
 *  @see https://stackoverflow.com/questions/3326650/console-is-undefined-error-for-internet-explorer
 */
var functionNames = [
    "assert", "cd", "clear", "count", "countReset",
    "debug", "dir", "dirxml", "error", "exception",
    "group", "groupCollapsed", "groupEnd", "info", "log", "markTimeline",
    "profile", "profileEnd",
    "select", "table",
    "time", "timeEnd", "timeStamp", "timeline", "timelineEnd",
    "trace", "warn"
];

if(!console) {
    console = {};

    var _doNothing = function () {};
    for(var i = 0; i < functionNames.length; ++i) {
        console[functionNames[i]] = _doNothing;
    }
}
