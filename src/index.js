require("./polyfill");
var typeTrait = require("./type-trait");
var collection = require("./collection");
var numberUtils = require("./number-utils");
var arrayUtils = require("./array-utils");
var stringUtils = require("./string-utils");
var objectUtils = require("./object-utils");
var memoize = require("./memoize").memoize;
var EventNotifier = require("./event-notifier").EventNotifier;
var Logger = require("./decoratable-logger").DecoratableLogger;
var TimerScheduler = require("./timer-scheduler").TimerScheduler;

module.exports = Object.assign(
    {},
    typeTrait,
    collection,
    numberUtils,
    arrayUtils,
    stringUtils,
    objectUtils,
    {
        memoize : memoize,
        EventNotifier : EventNotifier,
        Logger : Logger,
        TimerScheduler : TimerScheduler
    }
);
