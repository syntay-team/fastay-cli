var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
// src/utils/logger.ts
import chalk from 'chalk';
var Logger = /** @class */ (function () {
    function Logger() {
    }
    Logger.info = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        console.log.apply(console, __spreadArray([chalk.blue('ℹ ') + chalk.white(message)], args, false));
    };
    Logger.success = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        console.log.apply(console, __spreadArray([chalk.green('✓ ') + chalk.white(message)], args, false));
    };
    Logger.warning = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        console.log.apply(console, __spreadArray([chalk.yellow('⚠ ') + chalk.white(message)], args, false));
    };
    Logger.error = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        console.log.apply(console, __spreadArray([chalk.red('✗ ') + chalk.white(message)], args, false));
    };
    Logger.debug = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (process.env.DEBUG) {
            console.log.apply(console, __spreadArray([chalk.magenta('🔧 ') + chalk.white(message)], args, false));
        }
    };
    Logger.start = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        console.log.apply(console, __spreadArray([chalk.cyan('⥨ ') + chalk.white(message)], args, false));
    };
    Logger.route = function (method, path) {
        var methodColor = {
            GET: chalk.green,
            POST: chalk.blue,
            PUT: chalk.yellow,
            PATCH: chalk.magenta,
            DELETE: chalk.red,
            OPTIONS: chalk.cyan,
            HEAD: chalk.gray,
        }[method] || chalk.white;
        console.log('  ' +
            chalk.green('✓ ') +
            ' Route: ' +
            methodColor("[".concat(method, "]")) +
            ' ' +
            chalk.cyan(path));
    };
    Logger.buildStep = function (step, message) {
        console.log(chalk.blue('○ ') + chalk.white(step) + ' ' + chalk.gray(message));
    };
    return Logger;
}());
export { Logger };
