"use strict";
exports.__esModule = true;
exports.rnModelList = exports.rwNodeOf = exports.listModelChilrenReverse = exports.listModelChilren = exports.superModelList = exports.ModelLife = exports.VirtualListParam = void 0;
var modelChildren_1 = require("./modelChildren");
var util_1 = require("./util");
var virtualTreeChildren_1 = require("./virtualTreeChildren");
var VirtualListParam = /** @class */ (function () {
    function VirtualListParam(list, up) {
        this.list = list;
        this.up = up;
    }
    VirtualListParam.prototype.remove = function (e) {
        var after = this.up.after(e);
        var before = this.up.before(e);
        if (after) {
            this.up.before(after, before);
        }
        if (before) {
            this.up.after(before, after);
        }
        this.list.remove(this.up.index(e));
        //更新计数
        var tmp = after;
        if (tmp) {
            while (tmp) {
                this.up.index(tmp, this.up.index(tmp) - 1);
                tmp = this.up.after(tmp);
            }
        }
    };
    VirtualListParam.prototype.append = function (e, isMove) {
        if (isMove) {
            //还在树节点上
            this.list.move(this.up.index(e), this.list.size() - 1);
            //begin对应之前e后面一位，end取列表宽度
            var begin = this.up.index(e), end = this.list.size();
            for (var i = begin; i < end; i++) {
                this.up.index(this.list.get(i), i);
            }
        }
        else {
            var size = this.list.size();
            var last = this.list.get(size - 1);
            if (last) {
                this.up.after(last, e);
                this.up.before(e, last);
            }
            this.list.insert(size, e);
            //更新位置
            this.up.index(e, size);
        }
    };
    VirtualListParam.prototype.insertBefore = function (e, old, isMove) {
        if (isMove) {
            //还在节点上
            if (this.up.index(e) < this.up.index(old)) {
                //前移到后
                this.list.move(this.up.index(e), this.up.index(old) - 1);
                //begin取之前e后面一位，end取old的坐标。old不变，old前为e要更新
                var begin = this.up.index(e), end = this.up.index(old);
                for (var i = begin; i < end; i++) {
                    this.up.index(this.list.get(i), i);
                }
            }
            else {
                //后移到前
                this.list.move(this.up.index(e), this.up.index(old));
                //begin取old前一位，即e，要更新。end取e原来后面一位，e原来前面一们变成e.index要更新
                var begin = this.up.index(old) - 1, end = this.up.index(e) + 1;
                for (var i = begin; i < end; i++) {
                    this.up.index(this.list.get(i), i);
                }
            }
        }
        else {
            var before = this.up.before(old);
            if (before) {
                this.up.after(before, e);
                this.up.before(e, before);
            }
            this.up.after(e, old);
            this.up.before(old, e);
            this.list.insert(this.up.index(old), e);
            //更新位置
            this.up.index(e, this.up.index(old));
            while (old) {
                this.up.index(old, this.up.index(old) + 1);
                old = this.up.after(old);
            }
        }
    };
    return VirtualListParam;
}());
exports.VirtualListParam = VirtualListParam;
function childBuilder(out, child, parent) {
    if (util_1.isArray(child)) {
        var i = 0;
        while (i < child.length) {
            childBuilder(out, child[i], parent);
            i++;
        }
    }
    else if (isModelItemFun(child)) {
        out.push(child(parent.newChildAtLast()));
    }
    else if (child instanceof ModelLife) {
        out.push(child.destroy);
    }
    else {
        parent.push(child);
    }
}
var ModelLife = /** @class */ (function () {
    function ModelLife(destroy) {
        this.destroy = destroy;
    }
    return ModelLife;
}());
exports.ModelLife = ModelLife;
function isModelItemFun(v) {
    return typeof (v) == 'function';
}
function baseChildrenBuilder(children, parent) {
    var out = [];
    childBuilder(out, children, parent);
    return function () {
        out.forEach(function (v) { return v(); });
    };
}
/**
 * 自定义类似于重复的子节点。需要将其添加到生命周期。
 * @param root
 */
function superModelList(root, vp) {
    var list = util_1.mve.arrayModelOf([]);
    var destroy = baseChildrenBuilder(root, virtualTreeChildren_1.VirtualChild.newRootChild(new VirtualListParam(list, vp)));
    return {
        model: list,
        destroy: destroy
    };
}
exports.superModelList = superModelList;
var ModelChildView = /** @class */ (function () {
    function ModelChildView(value, index, destroy) {
        this.value = value;
        this.index = index;
        this.destroy = destroy;
    }
    return ModelChildView;
}());
function getView(index, row, parent, fun) {
    var vindex = util_1.mve.valueOf(index);
    var value = fun(row, vindex);
    var vm = parent.newChildAt(index);
    var vx = baseChildrenBuilder(value, vm);
    return new ModelChildView(value, vindex, vx);
}
function superListModelChildren(views, model, fun) {
    return function (parent) {
        var theView = {
            insert: function (index, row) {
                var view = getView(index, row, parent, fun);
                views.insert(index, view);
                modelChildren_1.initUpdateIndex(views, index);
            },
            remove: function (index) {
                var view = views.get(index);
                if (view) {
                    view.destroy();
                    views.remove(index);
                    parent.remove(index);
                    modelChildren_1.removeUpdateIndex(views, index);
                }
            },
            set: function (index, row) {
                var view = getView(index, row, parent, fun);
                var oldView = views.set(index, view);
                oldView.destroy();
                parent.remove(index + 1);
            },
            move: function (oldIndex, newIndex) {
                views.move(oldIndex, newIndex);
                parent.move(oldIndex, newIndex);
                modelChildren_1.moveUpdateIndex(views, oldIndex, newIndex);
            }
        };
        model.addView(theView);
        return function () {
            model.removeView(theView);
        };
    };
}
/**
 * 类似于modelChildren
 * 但是如果单纯的树，叶子节点交换，并不能观察到是交换
 * @param model
 * @param fun
 */
function listModelChilren(model, fun) {
    return superListModelChildren(new util_1.SimpleArray(), model, fun);
}
exports.listModelChilren = listModelChilren;
function superListModelChildrenReverse(views, model, fun) {
    return function (parent) {
        var theView = {
            insert: function (index, row) {
                index = views.size() - index;
                var view = getView(index, row, parent, fun);
                views.insert(index, view);
                modelChildren_1.initUpdateIndexReverse(views, index);
            },
            remove: function (index) {
                index = views.size() - 1 - index;
                var view = views.get(index);
                if (view) {
                    view.destroy();
                    views.remove(index);
                    parent.remove(index);
                    modelChildren_1.removeUpdateIndexReverse(views, index);
                }
            },
            set: function (index, row) {
                var s = views.size() - 1;
                index = s - index;
                var view = getView(index, row, parent, fun);
                var oldView = views.set(index, view);
                oldView.destroy();
                parent.remove(index + 1);
                view.index(s - index);
            },
            move: function (oldIndex, newIndex) {
                var s = views.size() - 1;
                oldIndex = s - oldIndex;
                newIndex = s - newIndex;
                views.move(oldIndex, newIndex);
                parent.move(oldIndex, newIndex);
                modelChildren_1.moveUpdateIndexReverse(views, oldIndex, newIndex);
            }
        };
        model.addView(theView);
        return function () {
            model.removeView(theView);
        };
    };
}
/**
 * 类似于modelChildren
 * 但是如果单纯的树，叶子节点交换，并不能观察到是交换
 * @param model
 * @param fun
 */
function listModelChilrenReverse(model, fun) {
    return superListModelChildrenReverse(new util_1.SimpleArray(), model, fun);
}
exports.listModelChilrenReverse = listModelChilrenReverse;
function rwNodeOf(v) {
    return new RWNode(v);
}
exports.rwNodeOf = rwNodeOf;
var RWNode = /** @class */ (function () {
    function RWNode(data) {
        this.data = data;
        this.index = util_1.mve.valueOf(null);
        this.before = util_1.mve.valueOf(null);
        this.after = util_1.mve.valueOf(null);
    }
    return RWNode;
}());
var RMList = {
    index: function (v, i) {
        if (arguments.length == 1) {
            return v.index();
        }
        else {
            v.index(i);
        }
    },
    before: function (v, b) {
        if (arguments.length == 1) {
            return v.before();
        }
        else {
            v.before(b);
        }
    },
    after: function (v, b) {
        if (arguments.length == 1) {
            return v.after();
        }
        else {
            v.after(b);
        }
    }
};
function rnModelList(root) {
    return superModelList(root, RMList);
}
exports.rnModelList = rnModelList;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZU1vZGVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidHJlZU1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGlEQUFpTDtBQUNqTCwrQkFBOEQ7QUFDOUQsNkRBQXdFO0FBVXhFO0lBQ0MsMEJBQ2tCLElBQWlCLEVBQzFCLEVBQWlCO1FBRFIsU0FBSSxHQUFKLElBQUksQ0FBYTtRQUMxQixPQUFFLEdBQUYsRUFBRSxDQUFlO0lBQ3hCLENBQUM7SUFFSCxpQ0FBTSxHQUFOLFVBQU8sQ0FBSTtRQUNWLElBQU0sS0FBSyxHQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQzVCLElBQU0sTUFBTSxHQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQzlCLElBQUcsS0FBSyxFQUFDO1lBQ1IsSUFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFDLE1BQU0sQ0FBQyxDQUFBO1NBQzVCO1FBQ0QsSUFBRyxNQUFNLEVBQUM7WUFDVCxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUMsS0FBSyxDQUFDLENBQUE7U0FDM0I7UUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ2xDLE1BQU07UUFDTixJQUFJLEdBQUcsR0FBQyxLQUFLLENBQUE7UUFDYixJQUFHLEdBQUcsRUFBQztZQUNOLE9BQU0sR0FBRyxFQUFDO2dCQUNULElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQTtnQkFDdkMsR0FBRyxHQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxD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