"use strict";
exports.__esModule = true;
exports.childrenBuilder = exports.baseChildrenBuilder = exports.isEOChildFunType = exports.ChildLife = void 0;
var virtualTreeChildren_1 = require("./virtualTreeChildren");
var util_1 = require("./util");
/**存放空的生命周期 */
var ChildLife = /** @class */ (function () {
    function ChildLife(result) {
        this.result = result;
    }
    ChildLife.of = function (result) {
        return new ChildLife(result);
    };
    return ChildLife;
}());
exports.ChildLife = ChildLife;
function isEOChildFunType(child) {
    return typeof (child) == 'function';
}
exports.isEOChildFunType = isEOChildFunType;
function childBuilder(out, child, parent, me) {
    if (util_1.isArray(child)) {
        var i = 0;
        while (i < child.length) {
            childBuilder(out, child[i], parent, me);
            i++;
        }
    }
    else if (isEOChildFunType(child)) {
        out.push(child(parent.newChildAtLast(), me));
    }
    else if (child instanceof ChildLife) {
        out.push(child.result);
    }
    else {
        parent.push(child);
    }
}
function baseChildrenBuilder(me, children, parent) {
    var out = util_1.BuildResultList.init();
    childBuilder(out, children, parent, me);
    return util_1.onceLife(out.getAsOne()).out;
}
exports.baseChildrenBuilder = baseChildrenBuilder;
function childrenBuilder(me, x, children) {
    return baseChildrenBuilder(me, children, virtualTreeChildren_1.VirtualChild.newRootChild(x));
}
exports.childrenBuilder = childrenBuilder;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpbGRyZW5CdWlsZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2hpbGRyZW5CdWlsZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZEQUF1RTtBQUN2RSwrQkFBNkU7QUFPN0UsY0FBYztBQUNkO0lBQ0MsbUJBQTRCLE1BQWtCO1FBQWxCLFdBQU0sR0FBTixNQUFNLENBQVk7SUFBRSxDQUFDO0lBQzFDLFlBQUUsR0FBVCxVQUFVLE1BQWtCO1FBQzNCLE9BQU8sSUFBSSxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDN0IsQ0FBQztJQUNGLGdCQUFDO0FBQUQsQ0FBQyxBQUxELElBS0M7QUFMWSw4QkFBUztBQVN0QixTQUFnQixnQkFBZ0IsQ0FBSyxLQUFvQjtJQUN4RCxPQUFPLE9BQU0sQ0FBQyxLQUFLLENBQUMsSUFBRSxVQUFVLENBQUE7QUFDakMsQ0FBQztBQUZELDRDQUVDO0FBRUQsU0FBUyxZQUFZLENBQ3BCLEdBQW1CLEVBQ25CLEtBQW9CLEVBQ3BCLE1BQXVCLEVBQ3ZCLEVBQWdCO0lBRWhCLElBQUcsY0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFDO1FBQ2pCLElBQUksQ0FBQyxHQUFDLENBQUMsQ0FBQTtRQUNQLE9BQU0sQ0FBQyxHQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUM7WUFDcEIsWUFBWSxDQUFDLEdBQUcsRUFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUMsTUFBTSxFQUFDLEVBQUUsQ0FBQyxDQUFBO1lBQ3BDLENBQUMsRUFBRSxDQUFBO1NBQ0g7S0FDRDtTQUNELElBQUcsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLEVBQUM7UUFDMUIsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxFQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7S0FDM0M7U0FDRCxJQUFHLEtBQUssWUFBWSxTQUFTLEVBQUM7UUFDN0IsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUE7S0FDdEI7U0FBSTtRQUNKLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7S0FDbEI7QUFDRixDQUFDO0FBQ0QsU0FBZ0IsbUJBQW1CLENBQUssRUFBZ0IsRUFBQyxRQUF1QixFQUFDLE1BQXVCO0lBQ3ZHLElBQU0sR0FBRyxHQUFDLHNCQUFlLENBQUMsSUFBSSxFQUFFLENBQUE7SUFDaEMsWUFBWSxDQUFDLEdBQUcsRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLEVBQUUsQ0FBQyxDQUFBO0lBQ3BDLE9BQU8sZUFBUSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQTtBQUNwQyxDQUFDO0FBSkQsa0RBSUM7QUFDRCxTQUFnQixlQUFlLENBQUssRUFBZ0IsRUFBQyxDQUF1QixFQUFDLFFBQXVCO0lBQ25HLE9BQU8sbUJBQW1CLENBQUMsRUFBRSxFQUFDLFFBQVEsRUFBQyxrQ0FBWSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3JFLENBQUM7QUFGRCwwQ0FFQyJ9