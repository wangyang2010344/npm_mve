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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlpbHRlckNoaWxkcmVuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmlpbHRlckNoaWxkcmVuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLDJDQUEwQztBQUMxQywrQkFBc0M7QUFJdEM7Ozs7R0FJRztBQUNILFNBQWdCLGNBQWMsQ0FDN0IsS0FBYSxFQUNiLEdBQXlEO0lBRXpELE9BQU8sdUJBQVUsQ0FBQyxVQUFTLEVBQUU7UUFDNUIsSUFBTSxFQUFFLEdBQWtCLEVBQUUsQ0FBQTtRQUM1QixLQUFLLEVBQUUsQ0FBQyxPQUFPLENBQUMsVUFBUyxHQUFHLEVBQUMsS0FBSztZQUNqQyxJQUFNLENBQUMsR0FBQyxHQUFHLENBQUMsRUFBRSxFQUFDLEdBQUcsRUFBQyxLQUFLLENBQUMsQ0FBQTtZQUN6QixJQUFHLGNBQU8sQ0FBQyxDQUFDLENBQUMsRUFBQztnQkFDYixDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUEsRUFBRSxJQUFFLE9BQUEsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBWCxDQUFXLENBQUMsQ0FBQTthQUMxQjtpQkFBSTtnQkFDSixFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO2FBQ1Y7UUFDRixDQUFDLENBQUMsQ0FBQTtRQUNGLE9BQU8sRUFBRSxDQUFBO0lBQ1YsQ0FBQyxDQUFDLENBQUE7QUFDSCxDQUFDO0FBaEJELHdDQWdCQyJ9