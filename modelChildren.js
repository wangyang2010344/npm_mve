"use strict";
exports.__esModule = true;
exports.modelCacheChildrenReverse = exports.modelCacheChildren = exports.modelChildrenReverse = exports.modelChildren = exports.modelCacheReverse = exports.modelCache = exports.moveUpdateIndexReverse = exports.removeUpdateIndexReverse = exports.initUpdateIndexReverse = exports.moveUpdateIndex = exports.removeUpdateIndex = exports.initUpdateIndex = void 0;
var childrenBuilder_1 = require("./childrenBuilder");
var util_1 = require("./util");
/**
 * 初始化更新计数
 * @param views
 * @param index
 */
function initUpdateIndex(views, index) {
    for (var i = index + 1; i < views.size(); i++) {
        views.get(i).index(i);
    }
}
exports.initUpdateIndex = initUpdateIndex;
/**
 * 删除时更新计算
 * @param views
 * @param index
 */
function removeUpdateIndex(views, index) {
    for (var i = index; i < views.size(); i++) {
        views.get(i).index(i);
    }
}
exports.removeUpdateIndex = removeUpdateIndex;
/**
 * 移动时更新计数
 * @param views
 * @param oldIndex
 * @param newIndex
 */
function moveUpdateIndex(views, oldIndex, newIndex) {
    var sort = oldIndex < newIndex ? [oldIndex, newIndex] : [newIndex, oldIndex];
    for (var i = sort[0]; i <= sort[1]; i++) {
        views.get(i).index(i);
    }
}
exports.moveUpdateIndex = moveUpdateIndex;
/**
 * 初始化更新计数
 * @param views
 * @param index
 */
function initUpdateIndexReverse(views, index) {
    var s = views.size() - 1;
    for (var i = index; i > -1; i--) {
        views.get(i).index(s - i);
    }
}
exports.initUpdateIndexReverse = initUpdateIndexReverse;
/**
 * 删除时更新计算
 * @param views
 * @param index
 */
function removeUpdateIndexReverse(views, index) {
    var s = views.size() - 1;
    for (var i = index - 1; i > -1; i--) {
        views.get(i).index(s - i);
    }
}
exports.removeUpdateIndexReverse = removeUpdateIndexReverse;
/**
 * 移动时更新计数
 * @param views
 * @param oldIndex
 * @param newIndex
 */
function moveUpdateIndexReverse(views, oldIndex, newIndex) {
    var sort = oldIndex < newIndex ? [oldIndex, newIndex] : [newIndex, oldIndex];
    var s = views.size() - 1;
    for (var i = sort[0]; i <= sort[1]; i++) {
        views.get(i).index(s - i);
    }
}
exports.moveUpdateIndexReverse = moveUpdateIndexReverse;
/**
 * 最终的卸载
 * @param views
 * @param model
 * @param theView
 */
function destroyViews(views, model, theView) {
    var size = views.size();
    for (var i = size - 1; i > -1; i--) {
        views.get(i).destroy();
    }
    model.removeView(theView);
    views.clear();
}
/**
 * 最终的卸载
 * @param views
 * @param model
 * @param theView
 */
function destroyViewsReverse(views, model, theView) {
    var size = views.size();
    for (var i = 0; i < size; i++) {
        views.get(i).destroy();
    }
    model.removeView(theView);
    views.clear();
}
function getCacheModel(pDestroy) {
    var CacheModel = /** @class */ (function () {
        function CacheModel(index, value) {
            this.index = index;
            this.value = value;
        }
        CacheModel.prototype.destroy = function () { };
        return CacheModel;
    }());
    if (pDestroy) {
        CacheModel.prototype.destroy = function () {
            pDestroy(this.value);
        };
    }
    return function (index, value) {
        return new CacheModel(index, value);
    };
}
function buildModelCacheView(insert, destroy) {
    var cacheModel = getCacheModel(destroy);
    return function (index, row) {
        var vindex = util_1.mve.valueOf(index);
        var vrow = insert(row, vindex);
        return cacheModel(vindex, vrow);
    };
}
function superModelCache(views, model, getView) {
    var theView = {
        insert: function (index, row) {
            var view = getView(index, row);
            views.insert(index, view);
            //更新计数
            initUpdateIndex(views, index);
        },
        remove: function (index) {
            //模型减少
            var view = views.get(index);
            views.remove(index);
            if (view) {
                //更新计数
                removeUpdateIndex(views, index);
                view.destroy();
            }
        },
        set: function (index, row) {
            var view = getView(index, row);
            var oldView = views.set(index, view);
            oldView.destroy();
        },
        move: function (oldIndex, newIndex) {
            //模型变更
            views.move(oldIndex, newIndex);
            //更新计数
            moveUpdateIndex(views, oldIndex, newIndex);
        }
    };
    model.addView(theView);
    return function () {
        destroyViews(views, model, theView);
    };
}
function superModelCacheReverse(views, model, getView) {
    var theView = {
        insert: function (index, row) {
            index = views.size() - index;
            var view = getView(index, row);
            views.insert(index, view);
            //更新计数
            initUpdateIndexReverse(views, index);
        },
        remove: function (index) {
            index = views.size() - 1 - index;
            //模型减少
            var view = views.get(index);
            views.remove(index);
            if (view) {
                //更新计数
                removeUpdateIndexReverse(views, index);
                view.destroy();
            }
        },
        set: function (index, row) {
            var s = views.size() - 1;
            index = s - index;
            var view = getView(index, row);
            var oldView = views.set(index, view);
            oldView.destroy();
            view.index(s - index);
        },
        move: function (oldIndex, newIndex) {
            var s = views.size() - 1;
            oldIndex = s - oldIndex;
            newIndex = s - newIndex;
            //模型变更
            views.move(oldIndex, newIndex);
            //更新计数
            moveUpdateIndexReverse(views, oldIndex, newIndex);
        }
    };
    model.addView(theView);
    return function () {
        destroyViewsReverse(views, model, theView);
    };
}
/**
 * 从一个model到另一个model，可能有销毁事件
 * 应该是很少用的，尽量不用
 * 可以直接用CacheArrayModel<T>作为组件基础参数，在组件需要的字段不存在时，入参定义T到该字段的映射
 * @param model
 * @param insert
 */
function modelCache(model, insert, destroy) {
    var views = util_1.mve.arrayModelOf([]);
    var getView = buildModelCacheView(insert, destroy);
    return {
        views: views,
        destroy: superModelCache(views, model, getView)
    };
}
exports.modelCache = modelCache;
/**
 * 从一个model到另一个model，可能有销毁事件
 * 应该是很少用的，尽量不用
 * 可以直接用CacheArrayModel<T>作为组件基础参数，在组件需要的字段不存在时，入参定义T到该字段的映射
 * @param model
 * @param insert
 */
function modelCacheReverse(model, insert, destroy) {
    var views = util_1.mve.arrayModelOf([]);
    var getView = buildModelCacheView(insert, destroy);
    return {
        views: views,
        destroy: superModelCacheReverse(views, model, getView)
    };
}
exports.modelCacheReverse = modelCacheReverse;
var ViewModel = /** @class */ (function () {
    function ViewModel(index, value, life, result) {
        this.index = index;
        this.value = value;
        this.life = life;
        this.result = result;
    }
    ViewModel.prototype.init = function () {
        util_1.orInit(this.result);
    };
    ViewModel.prototype.destroy = function () {
        this.life.destroy();
        util_1.orDestroy(this.result);
    };
    return ViewModel;
}());
function buildGetView(getElement, getData) {
    return function (index, row, parent, fun) {
        var vindex = util_1.mve.valueOf(index);
        var lifeModel = util_1.mve.newLifeModel();
        var cs = fun(lifeModel.me, row, vindex);
        //创建视图
        var vm = parent.newChildAt(index);
        var vx = childrenBuilder_1.baseChildrenBuilder(lifeModel.me, getElement(cs), vm);
        return new ViewModel(vindex, getData(cs), lifeModel, vx);
    };
}
function superModelChildren(views, model, fun, getView) {
    return function (parent, me) {
        var life = util_1.onceLife({
            init: function () {
                var size = views.size();
                for (var i = 0; i < size; i++) {
                    views.get(i).init();
                }
            },
            destroy: function () {
                destroyViews(views, model, theView);
            }
        });
        var theView = {
            insert: function (index, row) {
                var view = getView(index, row, parent, fun);
                //模型增加
                views.insert(index, view);
                //更新计数
                initUpdateIndex(views, index);
                //初始化
                if (life.isInit) {
                    view.init();
                }
            },
            remove: function (index) {
                //模型减少
                var view = views.get(index);
                views.remove(index);
                if (view) {
                    //销毁
                    if (life.isInit) {
                        view.destroy();
                    }
                    //更新计数
                    removeUpdateIndex(views, index);
                    //视图减少
                    parent.remove(index);
                }
            },
            set: function (index, row) {
                var view = getView(index, row, parent, fun);
                var oldView = views.set(index, view);
                if (life.isInit) {
                    view.init();
                    oldView.destroy();
                }
                parent.remove(index + 1);
            },
            move: function (oldIndex, newIndex) {
                //模型变更
                views.move(oldIndex, newIndex);
                //视图变更
                parent.move(oldIndex, newIndex);
                //更新计数
                moveUpdateIndex(views, oldIndex, newIndex);
            }
        };
        model.addView(theView);
        return life.out;
    };
}
function superModelChildrenReverse(views, model, fun, getView) {
    return function (parent, me) {
        var life = util_1.onceLife({
            init: function () {
                var size = views.size();
                for (var i = size - 1; i > -1; i--) {
                    views.get(i).init();
                }
            },
            destroy: function () {
                destroyViewsReverse(views, model, theView);
            }
        });
        var theView = {
            insert: function (index, row) {
                index = views.size() - index;
                var view = getView(index, row, parent, fun);
                //模型增加
                views.insert(index, view);
                //更新计数
                initUpdateIndexReverse(views, index);
                //初始化
                if (life.isInit) {
                    view.init();
                }
            },
            remove: function (index) {
                index = views.size() - 1 - index;
                //模型减少
                var view = views.get(index);
                views.remove(index);
                if (view) {
                    //销毁
                    if (life.isInit) {
                        view.destroy();
                    }
                    //更新计数
                    removeUpdateIndexReverse(views, index);
                    //视图减少
                    parent.remove(index);
                }
            },
            set: function (index, row) {
                var s = views.size() - 1;
                index = s - index;
                var view = getView(index, row, parent, fun);
                var oldView = views.set(index, view);
                if (life.isInit) {
                    view.init();
                    oldView.destroy();
                }
                view.index(s - index);
                parent.remove(index + 1);
            },
            move: function (oldIndex, newIndex) {
                var s = views.size() - 1;
                oldIndex = s - oldIndex;
                newIndex = s - newIndex;
                //模型变更
                views.move(oldIndex, newIndex);
                //视图变更
                parent.move(oldIndex, newIndex);
                //更新计数
                moveUpdateIndexReverse(views, oldIndex, newIndex);
            }
        };
        model.addView(theView);
        return life.out;
    };
}
////////////////////////////////////////////通用方式////////////////////////////////////////////////
var modelChildrenGetView = buildGetView(function (v) { return v; }, function () { return null; });
/**
 * 从model到视图
 * @param model
 * @param fun
 */
function modelChildren(model, fun) {
    return superModelChildren(new util_1.SimpleArray(), model, fun, modelChildrenGetView);
}
exports.modelChildren = modelChildren;
/**
 * 从model到视图
 * @param model
 * @param fun
 */
function modelChildrenReverse(model, fun) {
    return superModelChildrenReverse(new util_1.SimpleArray(), model, fun, modelChildrenGetView);
}
exports.modelChildrenReverse = modelChildrenReverse;
function renderGetElement(v) {
    return v.element;
}
function renderGetData(v) {
    return v.data;
}
var modelCacheChildrenGetView = buildGetView(renderGetElement, renderGetData);
/**
 * 从model到带模型视图
 * 应该是很少用的，尽量不用
 * @param model
 * @param fun
 */
function modelCacheChildren(model, fun) {
    var views = util_1.mve.arrayModelOf([]);
    return {
        views: views,
        children: superModelChildren(views, model, fun, modelCacheChildrenGetView)
    };
}
exports.modelCacheChildren = modelCacheChildren;
/**
 * 从model到带模型视图
 * 应该是很少用的，尽量不用
 * @param model
 * @param fun
 */
function modelCacheChildrenReverse(model, fun) {
    var views = util_1.mve.arrayModelOf([]);
    return {
        views: views,
        children: superModelChildrenReverse(views, model, fun, modelCacheChildrenGetView)
    };
}
exports.modelCacheChildrenReverse = modelCacheChildrenReverse;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWxDaGlsZHJlbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1vZGVsQ2hpbGRyZW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscURBQWdGO0FBQ2hGLCtCQUFxSDtBQWNySDs7OztHQUlHO0FBQ0gsU0FBZ0IsZUFBZSxDQUFJLEtBQXVDLEVBQUMsS0FBWTtJQUN0RixLQUFJLElBQUksQ0FBQyxHQUFDLEtBQUssR0FBQyxDQUFDLEVBQUMsQ0FBQyxHQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsRUFBQyxDQUFDLEVBQUUsRUFBQztRQUNwQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtLQUNyQjtBQUNGLENBQUM7QUFKRCwwQ0FJQztBQUNEOzs7O0dBSUc7QUFDSCxTQUFnQixpQkFBaUIsQ0FBSSxLQUF1QyxFQUFDLEtBQVk7SUFDeEYsS0FBSSxJQUFJLENBQUMsR0FBQyxLQUFLLEVBQUMsQ0FBQyxHQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsRUFBQyxDQUFDLEVBQUUsRUFBQztRQUNsQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtLQUNyQjtBQUNGLENBQUM7QUFKRCw4Q0FJQztBQUNEOzs7OztHQUtHO0FBQ0gsU0FBZ0IsZUFBZSxDQUFJLEtBQXVDLEVBQUMsUUFBZSxFQUFDLFFBQWU7SUFDekcsSUFBTSxJQUFJLEdBQUMsUUFBUSxHQUFDLFFBQVEsQ0FBQSxDQUFDLENBQUEsQ0FBQyxRQUFRLEVBQUMsUUFBUSxDQUFDLENBQUEsQ0FBQyxDQUFBLENBQUMsUUFBUSxFQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3JFLEtBQUksSUFBSSxDQUFDLEdBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsSUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLEVBQUM7UUFDaEMsS0FB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