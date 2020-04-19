require("./polyfill");
var typeTrait = require("./type-trait");
var collection = require("./collection");
var numberUtils = require("./number-utils");
var arrayUtils = require("./array-utils");
var stringUtils = require("./string-utils");
var objectUtils = require("./object-utils");
var memoize = require("./memoize").memoize;
var EventNotifier = require("./event-notifier").EventNotifier;
var DecoratableLogger = require("./decoratable-logger").DecoratableLogger;
var TimerScheduler = require("./timer-scheduler").TimerScheduler;
var pseudoGenerator = require("./pseudo-generator");

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
        DecoratableLogger : DecoratableLogger,
        TimerScheduler : TimerScheduler
    },
    pseudoGenerator
);
