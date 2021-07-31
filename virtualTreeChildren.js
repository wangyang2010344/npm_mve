"use strict";
exports.__esModule = true;
exports.VirtualChild = void 0;
/**虚拟的子层树*/
var VirtualChild = /** @class */ (function () {
    function VirtualChild(param, parent) {
        this.param = param;
        this.parent = parent;
        this.children = [];
    }
    VirtualChild.deepRun = function (view, fun) {
        if (view instanceof VirtualChild) {
            for (var i = 0; i < view.children.length; i++) {
                VirtualChild.deepRun(view.children[i], fun);
            }
        }
        else {
            fun(view);
        }
    };
    VirtualChild.prototype.pureRemove = function (index) {
        var view = this.children.splice(index, 1)[0];
        var before = this.children[index - 1];
        var after = this.children[index];
        if (before && before instanceof VirtualChild) {
            before.after = after;
        }
        return view;
    };
    VirtualChild.prototype.remove = function (index) {
        if (index > -1 && index < this.children.length) {
            var view = this.pureRemove(index);
            var param_1 = this.param;
            VirtualChild.deepRun(view, function (e) {
                param_1.remove(e);
            });
        }
        else {
            console.warn("\u5220\u9664" + index + "\u5931\u8D25,\u603B\u5BBD\u5EA6\u4EC5\u4E3A" + this.children.length);
        }
    };
    VirtualChild.prototype.move = function (oldIndex, newIndex) {
        if (oldIndex > -1 && oldIndex < this.children.length
            && newIndex > -1 && newIndex < this.children.length) {
            var view = this.pureRemove(oldIndex);
            var after = this.pureInsert(newIndex, view);
            var realNextEL = this.nextEL(after);
            VirtualChild.preformaceAdd(view, this.param, realNextEL, true);
        }
        else {
            console.warn("\u79FB\u52A8\u5931\u8D25" + oldIndex + "->" + newIndex + ",\u603B\u5BBD\u5EA6\u4EC5\u4E3A" + this.children.length);
        }
    };
    VirtualChild.prototype.pureInsert = function (index, view) {
        this.children.splice(index, 0, view);
        var before = this.children[index - 1];
        var after = this.children[index + 1];
        if (view instanceof VirtualChild) {
            view.parent = this;
            view.param = this.param;
            view.after = after;
        }
        if (before && before instanceof VirtualChild) {
            before.after = view;
        }
        return after;
    };
    VirtualChild.prototype.nextEL = function (after) {
        if (after) {
            return VirtualChild.realNextEO(after);
        }
        else {
            return VirtualChild.realParentNext(this);
        }
    };
    VirtualChild.prototype.insert = function (index, view) {
        if (index > -1 && index < (this.children.length + 1)) {
            var after = this.pureInsert(index, view);
            var realNextEL = this.nextEL(after);
            VirtualChild.preformaceAdd(view, this.param, realNextEL);
        }
        else {
            console.warn("\u63D2\u5165" + index + "\u5931\u8D25,\u603B\u5BBD\u5EA6\u4EC5\u4E3A" + this.children.length);
        }
    };
    VirtualChild.preformaceAdd = function (view, param, realNextEL, move) {
        if (realNextEL) {
            VirtualChild.deepRun(view, function (e) {
                param.insertBefore(e, realNextEL, move);
            });
        }
        else {
            VirtualChild.deepRun(view, function (e) {
                param.append(e, move);
            });
        }
    };
    VirtualChild.realNextEO = function (view) {
        if (view instanceof VirtualChild) {
            var childrenFirst = view.children[0];
            if (childrenFirst) {
                //寻找自己的子级节点
                return VirtualChild.realNextEO(childrenFirst);
            }
            else {
                //自己的后继
                var after = view.after;
                if (after) {
                    return VirtualChild.realNextEO(after);
                }
                else {
                    return VirtualChild.realParentNext(view.parent);
                }
            }
        }
        else {
            return view;
        }
    };
    VirtualChild.realParentNext = function (parent) {
        if (parent) {
            var after = parent.after;
            if (after) {
                return VirtualChild.realNextEO(after);
            }
            else {
                return VirtualChild.realParentNext(parent.parent);
            }
        }
        else {
            return null;
        }
    };
    VirtualChild.newRootChild = function (param) {
        return new VirtualChild(param);
    };
    VirtualChild.prototype.push = function (view) {
        return this.insert(this.children.length, view);
    };
    VirtualChild.prototype.newChildAt = function (index) {
        var child = new VirtualChild(this.param, this);
        this.insert(index, child);
        return child;
    };
    VirtualChild.prototype.newChildAtLast = function () {
        return this.newChildAt(this.children.length);
    };
    return VirtualChild;
}());
exports.VirtualChild = VirtualChild;
