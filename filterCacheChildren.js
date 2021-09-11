"use strict";
exports.__esModule = true;
exports.filterCacheChildren = void 0;
var childrenBuilder_1 = require("./childrenBuilder");
var util_1 = require("./util");
var CacheViewModel = /** @class */ (function () {
    function CacheViewModel(row, life, result) {
        this.row = row;
        this.life = life;
        this.result = result;
    }
    CacheViewModel.prototype.init = function () {
        util_1.orInit(this.result);
    };
    CacheViewModel.prototype.destroy = function () {
        this.life.destroy();
        util_1.orDestroy(this.result);
    };
    return CacheViewModel;
}());
/**
 * 有缓存mvc
 * @param array
 * @param fun
 * @returns
 */
function filterCacheChildren(array, fun) {
    return function (parent, me) {
        var views = [];
        var life = util_1.onceLife({
            init: function () {
                var size = views.length;
                for (var i = 0; i < size; i++) {
                    views[i].init();
                }
            },
            destroy: function () {
                var size = views.length;
                for (var i = size - 1; i > -1; i--) {
                    views[i].destroy();
                }
                views.length = 0;
                w.disable();
            }
        });
        var w = util_1.mve.WatchAfter(array, function (vs) {
            if (vs.length < views.length) {
                //更新旧数据视图
                for (var i = 0; i < vs.length; i++) {
                    views[i].row(vs[i]);
                }
                var minLength = vs.length - 1;
                for (var i = views.length - 1; i > minLength; i--) {
                    //销毁
                    if (life.isInit) {
                        views[i].destroy();
                    }
                    //删除视图
                    parent.remove(i);
                }
                views.length = vs.length;
            }
            else {
                //更新旧数据
                for (var i = 0; i < views.length; i++) {
                    views[i].row(vs[i]);
                }
                //追加新数据
                for (var i = views.length; i < vs.length; i++) {
                    var row = util_1.mve.valueOf(vs[i]);
                    var lifeModel = util_1.mve.newLifeModel();
                    var cs = fun(lifeModel.me, row, i);
                    //创建视图
                    var vm = parent.newChildAt(i);
                    var vx = childrenBuilder_1.baseChildrenBuilder(lifeModel.me, cs, vm);
                    var cv = new CacheViewModel(row, lifeModel, vx);
                    //模型增加
                    views.push(cv);
                    //初始化
                    if (life.isInit) {
                        cv.init();
                    }
                }
            }
        });
        return life.out;
    };
}
exports.filterCacheChildren = filterCacheChildren;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyQ2FjaGVDaGlsZHJlbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZpbHRlckNhY2hlQ2hpbGRyZW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscURBQWdGO0FBQ2hGLCtCQUFxRTtBQUtyRTtJQUNFLHdCQUNrQixHQUFnQixFQUNqQixJQUF3QixFQUN4QixNQUFrQjtRQUZqQixRQUFHLEdBQUgsR0FBRyxDQUFhO1FBQ2pCLFNBQUksR0FBSixJQUFJLENBQW9CO1FBQ3hCLFdBQU0sR0FBTixNQUFNLENBQVk7SUFDakMsQ0FBQztJQUNILDZCQUFJLEdBQUo7UUFDQSxhQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQ25CLENBQUM7SUFDRCxnQ0FBTyxHQUFQO1FBQ0EsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQTtRQUNuQixnQkFBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUN0QixDQUFDO0lBQ0gscUJBQUM7QUFBRCxDQUFDLEFBYkQsSUFhQztBQUNEOzs7OztHQUtHO0FBQ0gsU0FBZ0IsbUJBQW1CLENBQ2pDLEtBQWEsRUFDYixHQUE2RDtJQUU3RCxPQUFPLFVBQVMsTUFBTSxFQUFDLEVBQUU7UUFDdkIsSUFBTSxLQUFLLEdBQXFCLEVBQUUsQ0FBQTtRQUNsQyxJQUFNLElBQUksR0FBQyxlQUFRLENBQUM7WUFDbEIsSUFBSTtnQkFDTixJQUFNLElBQUksR0FBQyxLQUFLLENBQUMsTUFBTSxDQUFBO2dCQUN2QixLQUFJLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBQyxDQUFDLEdBQUMsSUFBSSxFQUFDLENBQUMsRUFBRSxFQUFDO29CQUNqQixLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUE7aUJBQ2hCO1lBQ0gsQ0FBQztZQUNELE9BQU87Z0JBQ1QsSUFBTSxJQUFJLEdBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQTtnQkFDdkIsS0FBSSxJQUFJLENB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