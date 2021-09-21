"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
exports.__esModule = true;
exports.onceLife = exports.BuildResultList = exports.arrayMove = exports.arrayForEach = exports.isArray = exports.orDestroy = exports.orInit = exports.orRun = exports.mve = exports.SimpleArray = void 0;
var Dep = /** @class */ (function () {
    function Dep() {
        this.id = Dep.uid++;
        this.subs = {};
    }
    Dep.prototype.depend = function () {
        if (Dep.target) {
            this.subs[Dep.target.id] = Dep.target;
        }
    };
    Dep.prototype.notify = function () {
        var oldSubs = this.subs;
        this.subs = {};
        for (var key in oldSubs) {
            oldSubs[key].update();
        }
    };
    Dep.watcherCount = 0;
    Dep.uid = 0;
    return Dep;
}());
var SimpleArray = /** @class */ (function () {
    function SimpleArray() {
        var ts = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            ts[_i] = arguments[_i];
        }
        this.array = ts;
    }
    SimpleArray.prototype.get = function (i) {
        return this.array[i];
    };
    SimpleArray.prototype.insert = function (i, v) {
        this.array.splice(i, 0, v);
    };
    SimpleArray.prototype.push = function (v) {
        this.array.push(v);
    };
    SimpleArray.prototype.forEach = function (fun) {
        this.array.forEach(fun);
    };
    SimpleArray.prototype.indexOf = function (v) {
        return this.array.indexOf(v);
    };
    SimpleArray.prototype.splice = function (i, d) {
        var _a;
        var vs = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            vs[_i - 2] = arguments[_i];
        }
        return (_a = this.array).splice.apply(_a, __spreadArray([i, d], vs));
    };
    SimpleArray.prototype.remove = function (i) {
        return this.array.splice(i, 1)[0];
    };
    SimpleArray.prototype.set = function (i, v) {
        var oldV = this.array[i];
        this.array[i] = v;
        return oldV;
    };
    SimpleArray.prototype.move = function (oldI, newI) {
        arrayMove(this, oldI, newI);
    };
    SimpleArray.prototype.clear = function () {
        this.array.length = 0;
    };
    SimpleArray.prototype.size = function () {
        return this.array.length;
    };
    return SimpleArray;
}());
exports.SimpleArray = SimpleArray;
var mve;
(function (mve) {
    function delaySetAfter(fun, after) {
        var newFun = fun;
        newFun.after = after;
        return newFun;
    }
    mve.delaySetAfter = delaySetAfter;
    /**新存储器*/
    function valueOf(v) {
        var dep = new Dep();
        return function () {
            if (arguments.length == 0) {
                dep.depend();
                return v;
            }
            else {
                if (Dep.target) {
                    throw "计算期间不允许修改";
                }
                else {
                    v = arguments[0];
                    dep.notify();
                }
            }
        };
    }
    mve.valueOf = valueOf;
    /**
     * 转化成统一的函数
     * @param a
     */
    function valueOrCall(a) {
        if (typeof (a) == 'function') {
            return a;
        }
        else {
            return function () { return a; };
        }
    }
    mve.valueOrCall = valueOrCall;
    /**
     * 重写属性值为可观察
     * @param a
     * @param fun
     */
    function reWriteMTValue(a, fun) {
        var after = a['after'];
        var vm = function () { return fun(a()); };
        vm.after = after;
        return vm;
    }
    mve.reWriteMTValue = reWriteMTValue;
    /**构造只读的模型*/
    var CacheArrayModel = /** @class */ (function () {
        function CacheArrayModel(size, array, views) {
            this.size = size;
            this.array = array;
            this.views = views;
        }
        CacheArrayModel.prototype.addView = function (view) {
            this.views.push(view);
            //自动初始化
            for (var i = 0; i < this.array.size(); i++) {
                view.insert(i, this.array.get(i));
            }
        };
        CacheArrayModel.prototype.removeView = function (view) {
            var index = this.views.indexOf(view);
            if (index != -1) {
                this.views.remove(index);
            }
        };
        CacheArrayModel.prototype.get = function (i) {
            //不支持响应式
            return this.array.get(i);
        };
        CacheArrayModel.prototype.getLast = function () {
            var size = this.size();
            return this.array.get(size - 1);
        };
        CacheArrayModel.prototype.findIndex = function (fun) {
            var size = this.size();
            for (var i = 0; i < size; i++) {
                var row = this.get(i);
                if (fun(row, i)) {
                    return i;
                }
            }
            return -1;
        };
        CacheArrayModel.prototype.forEach = function (fun) {
            var size = this.size();
            for (var i = 0; i < size; i++) {
                fun(this.get(i), i);
            }
        };
        CacheArrayModel.prototype.map = function (fun) {
            var vs = [];
            var size = this.size();
            for (var i = 0; i < size; i++) {
                vs.push(fun(this.get(i), i));
            }
            return vs;
        };
        CacheArrayModel.prototype.filter = function (fun) {
            var vs = [];
            var size = this.size();
            for (var i = 0; i < size; i++) {
                var row = this.get(i);
                if (fun(row, i)) {
                    vs.push(row);
                }
            }
            return vs;
        };
        CacheArrayModel.prototype.findRow = function (fun) {
            var size = this.size();
            for (var i = 0; i < size; i++) {
                var row = this.get(i);
                if (fun(row, i)) {
                    return row;
                }
            }
        };
        CacheArrayModel.prototype.indexOf = function (row) {
            return this.findIndex(function (theRow) { return theRow == row; });
        };
        CacheArrayModel.prototype.count = function (fun) {
            var size = this.size();
            var count = 0;
            for (var i = 0; i < size; i++) {
                var row = this.get(i);
                if (fun(row, i)) {
                    count++;
                }
            }
            return count;
        };
        CacheArrayModel.prototype.exist = function (fun) {
            var size = this.size();
            for (var i = 0; i < size; i++) {
                var row = this.get(i);
                if (fun(row, i)) {
                    return true;
                }
            }
            return false;
        };
        CacheArrayModel.prototype.all = function (fun) {
            var size = this.size();
            for (var i = 0; i < size; i++) {
                var row = this.get(i);
                if (!fun(row, i)) {
                    return false;
                }
            }
            return true;
        };
        CacheArrayModel.prototype.join = function (split) {
            return this.map(function (v) { return v; }).join(split);
        };
        return CacheArrayModel;
    }());
    mve.CacheArrayModel = CacheArrayModel;
    var ArrayModel = /** @class */ (function (_super) {
        __extends(ArrayModel, _super);
        function ArrayModel(array) {
            if (array === void 0) { array = []; }
            var _this = this;
            var array_value = new SimpleArray();
            for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
                var row = array_1[_i];
                array_value.push(row);
            }
            var size_value = mve.valueOf(0);
            var views_value = new SimpleArray();
            _this = _super.call(this, size_value, array_value, views_value) || this;
            _this.size_value = size_value;
            _this.array_value = array_value;
            _this.views_value = views_value;
            //长度是可观察的
            _this.reload_size();
            return _this;
        }
        ArrayModel.prototype.reload_size = function () {
            this.size_value(this.array_value.size());
        };
        ArrayModel.prototype.insert = function (index, row) {
            this.array_value.insert(index, row);
            this.views_value.forEach(function (view) {
                view.insert(index, row);
            });
            this.reload_size();
        };
        ArrayModel.prototype.remove = function (index) {
            /*更常识的使用方法*/
            var row = this.get(index);
            this.array_value.remove(index);
            this.views_value.forEach(function (view) {
                view.remove(index);
            });
            this.reload_size();
            return row;
        };
        ArrayModel.prototype.set = function (index, row) {
            var oldRow = this.array_value.splice(index, 1, row)[0];
            this.views_value.forEach(function (view) {
                view.set(index, row);
            });
            this.reload_size();
            return oldRow;
        };
        /**清理匹配项 */
        ArrayModel.prototype.removeWhere = function (fun) {
            var i = this.size() - 1;
            while (i > -1) {
                var theRow = this.get(i);
                if (fun(theRow, i)) {
                    this.remove(i);
                }
                i--;
            }
        };
        /**清理单纯相等的项 */
        ArrayModel.prototype.removeEqual = function (row) {
            this.removeWhere(function (theRow) { return theRow == row; });
        };
        ArrayModel.prototype.move = function (oldIndex, newIndex) {
            /**有效的方法*/
            arrayMove(this.array_value, oldIndex, newIndex);
            this.views_value.forEach(function (view) {
                view.move(oldIndex, newIndex);
            });
            this.reload_size();
        };
        /*多控件用array和model，单控件用包装*/
        ArrayModel.prototype.moveToFirst = function (index) {
            this.move(index, 0);
        };
        ArrayModel.prototype.moveToLast = function (index) {
            this.move(index, this.size_value() - 1);
        };
        ArrayModel.prototype.shift = function () {
            return this.remove(0);
        };
        ArrayModel.prototype.unshift = function (row) {
            return this.insert(0, row);
        };
        ArrayModel.prototype.pop = function () {
            return this.remove(this.size_value() - 1);
        };
        ArrayModel.prototype.push = function (row) {
            return this.insert(this.size_value(), row);
        };
        ArrayModel.prototype.clear = function () {
            while (this.size_value() > 0) {
                this.pop();
            }
        };
        ArrayModel.prototype.reset = function (array) {
            if (array === void 0) { array = []; }
            this.clear();
            for (var _i = 0, array_2 = array; _i < array_2.length; _i++) {
                var row = array_2[_i];
                this.push(row);
            }
        };
        return ArrayModel;
    }(CacheArrayModel));
    mve.ArrayModel = ArrayModel;
    function arrayModelOf(array) {
        return new ArrayModel(array);
    }
    mve.arrayModelOf = arrayModelOf;
    var Watcher = /** @class */ (function () {
        function Watcher() {
            this.id = Watcher.uid++;
            this.enable = true;
            Dep.watcherCount++;
        }
        Watcher.prototype.update = function () {
            if (this.enable) {
                this.realUpdate();
            }
        };
        Watcher.prototype.disable = function () {
            this.enable = false;
            Dep.watcherCount--;
        };
        Watcher.uid = 0;
        return Watcher;
    }());
    mve.Watcher = Watcher;
    function Watch(exp) {
        return new WatcherImpl(exp);
    }
    mve.Watch = Watch;
    function WatchExp(before, exp, after) {
        return new WatcherImplExp(before, exp, after);
    }
    mve.WatchExp = WatchExp;
    function WatchBefore(before, exp) {
        return new WatcherImplBefore(before, exp);
    }
    mve.WatchBefore = WatchBefore;
    function WatchAfter(exp, after) {
        return new WatcherImplAfter(exp, after);
    }
    mve.WatchAfter = WatchAfter;
    var LifeModelImpl = /** @class */ (function () {
        function LifeModelImpl() {
            this.destroyList = [];
            this.pool = [];
        }
        LifeModelImpl.prototype.Watch = function (exp) {
            this.pool.push(mve.Watch(exp));
        };
        LifeModelImpl.prototype.WatchExp = function (before, exp, after) {
            this.pool.push(mve.WatchExp(before, exp, after));
        };
        LifeModelImpl.prototype.WatchBefore = function (before, exp) {
            this.pool.push(mve.WatchBefore(before, exp));
        };
        LifeModelImpl.prototype.WatchAfter = function (exp, after) {
            this.pool.push(mve.WatchAfter(exp, after));
        };
        LifeModelImpl.prototype.Cache = function (fun) {
            var dep = new Dep();
            var cache;
            this.Watch(function () {
                cache = fun();
                dep.notify();
            });
            return function () {
                dep.depend();
                return cache;
            };
        };
        LifeModelImpl.prototype.destroy = function () {
            while (this.pool.length > 0) {
                this.pool.pop().disable();
            }
            for (var _i = 0, _a = this.destroyList; _i < _a.length; _i++) {
                var destroy = _a[_i];
                destroy();
            }
        };
        return LifeModelImpl;
    }());
    function newLifeModel() {
        var lm = new LifeModelImpl();
        return {
            me: lm,
            destroy: function () {
                lm.destroy();
            }
        };
    }
    mve.newLifeModel = newLifeModel;
})(mve = exports.mve || (exports.mve = {}));
var WatcherImpl = /** @class */ (function (_super) {
    __extends(WatcherImpl, _super);
    function WatcherImpl(exp) {
        var _this = _super.call(this) || this;
        _this.exp = exp;
        _this.update();
        return _this;
    }
    WatcherImpl.prototype.realUpdate = function () {
        Dep.target = this;
        this.exp();
        Dep.target = null;
    };
    return WatcherImpl;
}(mve.Watcher));
var WatcherImplExp = /** @class */ (function (_super) {
    __extends(WatcherImplExp, _super);
    function WatcherImplExp(before, exp, after) {
        var _this = _super.call(this) || this;
        _this.before = before;
        _this.exp = exp;
        _this.after = after;
        _this.update();
        return _this;
    }
    WatcherImplExp.prototype.realUpdate = function () {
        var a = this.before();
        Dep.target = this;
        var b = this.exp(a);
        Dep.target = null;
        this.after(b);
    };
    return WatcherImplExp;
}(mve.Watcher));
var WatcherImplBefore = /** @class */ (function (_super) {
    __extends(WatcherImplBefore, _super);
    function WatcherImplBefore(before, exp) {
        var _this = _super.call(this) || this;
        _this.before = before;
        _this.exp = exp;
        _this.update();
        return _this;
    }
    WatcherImplBefore.prototype.realUpdate = function () {
        var a = this.before();
        Dep.target = this;
        this.exp(a);
        Dep.target = null;
    };
    return WatcherImplBefore;
}(mve.Watcher));
var WatcherImplAfter = /** @class */ (function (_super) {
    __extends(WatcherImplAfter, _super);
    function WatcherImplAfter(exp, after) {
        var _this = _super.call(this) || this;
        _this.exp = exp;
        _this.after = after;
        _this.update();
        return _this;
    }
    WatcherImplAfter.prototype.realUpdate = function () {
        Dep.target = this;
        var b = this.exp();
        Dep.target = null;
        this.after(b);
    };
    return WatcherImplAfter;
}(mve.Watcher));
function orRun(v) {
    if (v) {
        v();
    }
}
exports.orRun = orRun;
function orInit(v) {
    if (v.init) {
        v.init();
    }
}
exports.orInit = orInit;
function orDestroy(v) {
    if (v.destroy) {
        v.destroy();
    }
}
exports.orDestroy = orDestroy;
/**
 * 判断是否是数组
 */
function isArray(v) {
    return v instanceof Array || Object.prototype.toString.call(v) === '[object Array]';
}
exports.isArray = isArray;
function arrayForEach(vs, fun) {
    for (var i = 0; i < vs.size(); i++) {
        fun(vs.get(i), i);
    }
}
exports.arrayForEach = arrayForEach;
/**
 * 数组移动
 * @param vs
 * @param oldIndex
 * @param newIndex
 */
function arrayMove(vs, oldIndex, newIndex) {
    var row = vs.remove(oldIndex);
    vs.insert(newIndex, row);
}
exports.arrayMove = arrayMove;
var BuildResultList = /** @class */ (function () {
    function BuildResultList() {
        this.inits = [];
        this.destroys = [];
    }
    BuildResultList.init = function () {
        var xs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            xs[_i] = arguments[_i];
        }
        var it = new BuildResultList();
        for (var i = 0; i < xs.length; i++) {
            it.push(xs[i]);
        }
        return it;
    };
    BuildResultList.prototype.orPush = function (v) {
        if (v) {
            this.push(v);
        }
    };
    BuildResultList.prototype.push = function (v) {
        if (v.init) {
            this.inits.push(v.init);
        }
        if (v.destroy) {
            this.destroys.push(v.destroy);
        }
    };
    BuildResultList.prototype.getInit = function () {
        var inits = this.inits;
        var size = inits.length;
        if (size > 1) {
            return function () {
                for (var i = 0; i < size; i++) {
                    inits[i]();
                }
            };
        }
        else if (size == 1) {
            return inits[0];
        }
    };
    BuildResultList.prototype.getDestroy = function () {
        var destroys = this.destroys;
        var size = destroys.length;
        if (size > 1) {
            return function () {
                for (var i = size - 1; i > -1; i--) {
                    destroys[i]();
                }
            };
        }
        else if (size == 1) {
            return destroys[0];
        }
    };
    BuildResultList.prototype.getAsOne = function (e) {
        return {
            element: e,
            init: this.getInit(),
            destroy: this.getDestroy()
        };
    };
    return BuildResultList;
}());
exports.BuildResultList = BuildResultList;
function onceLife(p, nowarn) {
    var warn = !nowarn;
    var self = {
        isInit: false,
        isDestroy: false,
        out: p
    };
    var init = p.init;
    var destroy = p.destroy;
    if (init) {
        p.init = function () {
            if (self.isInit) {
                if (warn) {
                    console.warn("禁止重复init");
                }
            }
            else {
                self.isInit = true;
                init();
            }
        };
        if (!destroy) {
            p.destroy = function () {
                if (self.isDestroy) {
                    if (warn) {
                        console.warn("禁止重复destroy");
                    }
                }
                else {
                    self.isDestroy = true;
                    if (!self.isInit) {
                        console.warn("未初始化故不销毁");
                    }
                }
            };
        }
    }
    if (destroy) {
        if (!init) {
            p.init = function () {
                if (self.isInit) {
                    if (warn) {
                        console.warn("禁止重复init");
                    }
                }
                else {
                    self.isInit = true;
                }
            };
        }
        p.destroy = function () {
            if (self.isDestroy) {
                if (warn) {
                    console.warn("禁止重复destroy");
                }
            }
            else {
                self.isDestroy = true;
                if (self.isInit) {
                    destroy();
                }
                else {
                    console.warn("未初始化故不销毁");
                }
            }
        };
    }
    return self;
}
exports.onceLife = onceLife;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtJQUFBO1FBSUMsT0FBRSxHQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQTtRQUNaLFNBQUksR0FBNEIsRUFBRSxDQUFBO0lBYW5DLENBQUM7SUFaQSxvQkFBTSxHQUFOO1FBQ0MsSUFBRyxHQUFHLENBQUMsTUFBTSxFQUFDO1lBQ2IsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxHQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUE7U0FDbkM7SUFDRixDQUFDO0lBQ0Qsb0JBQU0sR0FBTjtRQUNDLElBQU0sT0FBTyxHQUFDLElBQUksQ0FBQyxJQUFJLENBQUE7UUFDdkIsSUFBSSxDQUFDLElBQUksR0FBQyxFQUFFLENBQUE7UUFDWixLQUFJLElBQU0sR0FBRyxJQUFJLE9BQU8sRUFBQztZQUN4QixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUE7U0FDckI7SUFDRixDQUFDO0lBZk0sZ0JBQVksR0FBQyxDQUFDLENBQUE7SUFDZCxPQUFHLEdBQUMsQ0FBQyxDQUFBO0lBZWIsVUFBQztDQUFBLEFBbEJELElBa0JDO0FBY0Q7SUFDQztRQUFZLFlBQVM7YUFBVCxVQUFTLEVBQVQscUJBQVMsRUFBVCxJQUFTO1lBQVQsdUJBQVM7O1FBQ3BCLElBQUksQ0FBQyxLQUFLLEdBQUMsRUFBRSxDQUFBO0lBQ2QsQ0FBQztJQUVELHlCQUFHLEdBQUgsVUFBSSxDQUFTO1FBQ1osT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ3JCLENBQUM7SUFDRCw0QkFBTSxHQUFOLFVBQU8sQ0FBUyxFQUFFLENBQUk7UUFDckIsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENB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