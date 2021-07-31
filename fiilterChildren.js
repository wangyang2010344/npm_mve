"use strict";
exports.__esModule = true;
exports.filterChildren = void 0;
var ifChildren_1 = require("./ifChildren");
var util_1 = require("./util");
/**
 * 无缓存mvc
 * @param array
 * @param fun
 */
function filterChildren(array, fun) {
    return ifChildren_1.ifChildren(function (me) {
        var vs = [];
        array().forEach(function (row, index) {
            var v = fun(me, row, index);
            if (util_1.isArray(v)) {
                v.forEach(function (vi) { return vs.push(vi); });
            }
            else {
                vs.push(v);
            }
        });
        return vs;
    });
}
exports.filterChildren = filterChildren;
