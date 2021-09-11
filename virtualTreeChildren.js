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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlydHVhbFRyZWVDaGlsZHJlbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInZpcnR1YWxUcmVlQ2hpbGRyZW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBT0EsV0FBVztBQUNYO0lBQ0Usc0JBQ1UsS0FBMkIsRUFDM0IsTUFBd0I7UUFEeEIsVUFBSyxHQUFMLEtBQUssQ0FBc0I7UUFDM0IsV0FBTSxHQUFOLE1BQU0sQ0FBa0I7UUFFMUIsYUFBUSxHQUF3QixFQUFFLENBQUE7SUFEeEMsQ0FBQztJQUdJLG9CQUFPLEdBQWQsVUFBbUIsSUFBeUIsRUFBQyxHQUFtQjtRQUM5RCxJQUFHLElBQUksWUFBWSxZQUFZLEVBQUM7WUFDOUIsS0FBSSxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUMsQ0FBQyxHQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFDLENBQUMsRUFBRSxFQUFDO2dCQUNyQyxZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUMsR0FBRyxDQUFDLENBQUE7YUFDM0M7U0FDRjthQUFJO1lBQ0gsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO1NBQ1Y7SUFDSCxDQUFDO0lBR08saUNBQVUsR0FBbEIsVUFBbUIsS0FBWTtRQUM3QixJQUFNLElBQUksR0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDM0MsSUFBTSxNQUFNLEdBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEdBQUMsQ0FBQyxDQUFDLENBQUE7UUFDbkMsSUFBTSxLQUFLLEdBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUNoQyxJQUFHLE1BQU0sSUFBSSxNQUFNLFlBQVksWUFBWSxFQUFDO1lBQzFDLE1BQU0sQ0FBQyxLQUFLLEdBQUMsS0FBSyxDQUFBO1NBQ25CO1FBQ0QsT0FBTyxJQUFJLENB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