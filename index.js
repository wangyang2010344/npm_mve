"use strict";
exports.__esModule = true;
exports.buildElement = exports.buildElementOrginal = exports.parseUtil = exports.objectForEach = void 0;
var util_1 = require("./util");
function objectForEach(vs, fun) {
    for (var key in vs) {
        fun(vs[key], key);
    }
}
exports.objectForEach = objectForEach;
exports.parseUtil = {
    bind: function (me, value, fun) {
        if (typeof (value) == 'function') {
            if ('after' in value && value.after) {
                me.WatchAfter(value, function (v) {
                    value.after(v, fun);
                });
            }
            else {
                me.WatchAfter(value, fun);
            }
        }
        else {
            fun(value);
        }
    },
    bindKV: function (me, map, fun) {
        objectForEach(map, function (v, k) {
            exports.parseUtil.bind(me, v, function (value) {
                fun(k, value);
            });
        });
    }
};
/**原始的组装*/
function buildElementOrginal(fun) {
    var out = function (n) {
        return function (parent, me) {
            var out = fun(me, n);
            parent.push(out.element);
            return out;
        };
    };
    out.one = fun;
    out.root = function (cal) {
        var life = util_1.mve.newLifeModel();
        return fun(life.me, cal(life.me), life);
    };
    return out;
}
exports.buildElementOrginal = buildElementOrginal;
/**通用的子元素组装 */
function buildElement(fun) {
    return buildElementOrginal(function (me, n, life) {
        var out = util_1.BuildResultList.init();
        var element = fun(me, n, out);
        if (life) {
            out.push(life);
        }
        return util_1.onceLife(out.getAsOne(element)).out;
    });
}
exports.buildElement = buildElement;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSwrQkFBbUY7QUFFbkYsU0FBZ0IsYUFBYSxDQUFJLEVBQW1CLEVBQUMsR0FBd0I7SUFDNUUsS0FBSSxJQUFNLEdBQUcsSUFBSSxFQUFFLEVBQUM7UUFDbkIsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBQyxHQUFHLENBQUMsQ0FBQTtLQUNoQjtBQUNGLENBQUM7QUFKRCxzQ0FJQztBQUVZLFFBQUEsU0FBUyxHQUFDO0lBQ3JCLElBQUksRUFBSixVQUFRLEVBQWdCLEVBQUMsS0FBb0IsRUFBQyxHQUFlO1FBQzNELElBQUcsT0FBTSxDQUFDLEtBQUssQ0FBQyxJQUFFLFVBQVUsRUFBQztZQUM5QixJQUFHLE9BQU8sSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLEtBQUssRUFBQztnQkFDbEMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxLQUFzQixFQUFDLFVBQVMsQ0FBQztvQkFDOUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUMsR0FBRyxDQUFDLENBQUE7Z0JBQ25CLENBQUMsQ0FBQyxDQUFBO2FBQ0Y7aUJBQUk7Z0JBQ0osRUFBRSxDQUFDLFVBQVUsQ0FBQyxLQUFzQixFQUFDLEdBQUcsQ0FBQyxDQUFBO2FBQ3pDO1NBQ0M7YUFBSTtZQUNILEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQTtTQUNYO0lBQ0gsQ0FBQztJQUNELE1BQU0sRUFBTixVQUFVLEVBQWdCLEVBQUMsR0FBb0MsRUFBQyxHQUF3QjtRQUN4RixhQUFhLENBQUMsR0FBRyxFQUFDLFVBQVMsQ0FBQyxFQUFDLENBQUM7WUFDMUIsaUJBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFDLENBQUMsRUFBQyxVQUFTLEtBQUs7Z0JBQ2hDLEdBQUcsQ0FBQyxDQUFDLEVBQUMsS0FBSyxDQUFDLENBQUE7WUFDZCxDQUFDLENBQUMsQ0FBQTtRQUNOLENBQUMsQ0FBQyxDQUFBO0lBQ0YsQ0FBQztDQUNGLENBQUE7QUFPRCxVQUFVO0FBQ1YsU0FBZ0IsbUJBQW1CLENBQ2xDLEdBQWdFO0lBRWhFLElBQU0sR0FBRyxHQUFzQixVQUFTLENBQUM7UUFDeEMsT0FBTyxVQUFTLE1BQU0sRUFBQyxFQUFFO1lBQ3hCLElBQU0sR0FBRyxHQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUE7WUFDbkIsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUE7WUFDeEIsT0FBTyxHQUFHLENBQUE7UUFDWCxDQUFDLENBQUE7SUFDRixDQUFDLENBQUE7SUFDRCxHQUFHLENBQUMsR0FBRyxHQUFDLEdBQUcsQ0FBQTtJQUNYLEdBQUcsQ0FBQyxJQUFJLEdBQUMsVUFBUyxHQUFHO1FBQ3BCLElBQU0sSUFBSSxHQUFDLFVBQUcsQ0FBQyxZQUFZLEVBQUUsQ0FBQTtRQUM3QixPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUMsSUFBSSxDQUFDLENBQUE7SUFDdEMsQ0FBQyxDQUFBO0lBQ0QsT0FBTyxHQUFHLENBQUE7QUFDWCxDQUFDO0FBaEJELGtEQWdCQztBQUNELGNBQWM7QUFDZCxTQUFnQixZQUFZLENBQzNCLEdBQW1EO0lBRW5ELE9BQU8sbUJBQW1CLENBQVEsVUFBUyxFQUFFLEVBQUMsQ0FBQyxFQUFDLElBQUk7UUFDbkQsSUFBTSxHQUFHLEdBQUMsc0JBQWUsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtRQUNoQyxJQUFNLE9BQU8sR0FBQyxHQUFHLENBQUMsRUFBRSxFQUFDLENBQUMsRUFBQyxHQUFHLENBQUMsQ0FBQTtRQUMzQixJQUFHLElBQUksRUFBQztZQUNQLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7U0FDZDtRQUNELE9BQU8sZUFBUSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUE7SUFDM0MsQ0FBQyxDQUFDLENBQUE7QUFDSCxDQUFDO0FBWEQsb0NBV0MifQ==