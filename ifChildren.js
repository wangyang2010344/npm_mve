"use strict";
exports.__esModule = true;
exports.ifChildren = void 0;
var childrenBuilder_1 = require("./childrenBuilder");
var util_1 = require("./util");
/**
 * 子元素集片段是动态生成的，watchAfter后直接新入
 * @param fun
 */
function ifChildren(fun) {
    return function (parent, me) {
        var currentObject;
        var virtualChild;
        var currentLifeModel;
        var life = util_1.onceLife({
            init: function () {
                if (currentObject) {
                    util_1.orInit(currentObject);
                }
            },
            destroy: function () {
                w.disable();
                if (currentObject) {
                    util_1.orDestroy(currentObject);
                }
                currentLifeModel.destroy();
            }
        });
        var w = util_1.mve.WatchExp(function () {
            if (currentLifeModel) {
                currentLifeModel.destroy();
            }
            currentLifeModel = util_1.mve.newLifeModel();
        }, function () {
            return fun(currentLifeModel.me);
        }, function (children) {
            if (currentObject) {
                if (life.isInit) {
                    util_1.orDestroy(currentObject);
                }
                currentObject = null;
            }
            if (virtualChild) {
                parent.remove(0);
                virtualChild = null;
            }
            if (children) {
                //初始化
                virtualChild = parent.newChildAtLast();
                currentObject = childrenBuilder_1.baseChildrenBuilder(currentLifeModel.me, children, virtualChild);
                if (life.isInit) {
                    util_1.orInit(currentObject);
                }
            }
        });
        return life.out;
    };
}
exports.ifChildren = ifChildren;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWZDaGlsZHJlbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImlmQ2hpbGRyZW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EscURBQWdGO0FBQ2hGLCtCQUFzRTtBQUN0RTs7O0dBR0c7QUFDSCxTQUFnQixVQUFVLENBQ3hCLEdBQTJDO0lBRTNDLE9BQU8sVUFBUyxNQUFNLEVBQUMsRUFBRTtRQUN2QixJQUFJLGFBQThCLENBQUE7UUFDbEMsSUFBSSxZQUFrQyxDQUFBO1FBQ3RDLElBQUksZ0JBQW9DLENBQUE7UUFFeEMsSUFBTSxJQUFJLEdBQUMsZUFBUSxDQUFDO1lBQ2xCLElBQUk7Z0JBQ0YsSUFBRyxhQUFhLEVBQUM7b0JBQ2YsYUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFBO2lCQUN0QjtZQUNILENBQUM7WUFDRCxPQUFPO2dCQUNMLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtnQkFDWCxJQUFHLGFBQWEsRUFBQztvQkFDZixnQkFBUyxDQUFDLGFBQWEsQ0FBQyxDQUFBO2lCQUN6QjtnQkFDRCxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtZQUM1QixDQUFDO1NBQ0YsQ0FBQyxDQUFBO1FBQ0YsSUFBTSxDQUFDLEdBQUMsVUFBRyxDQUFDLFFBQVEsQ0FBQztZQUNqQixJQUFHLGdCQUFnQixFQUFDO2dCQUNsQixnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQTthQUMzQjtZQUNELGdCQUFnQixHQUFDLFVBQUcsQ0FBQyxZQUFZLEVBQUUsQ0FBQTtRQUNyQyxDQUFDLEVBQ0Q7WUFDRSxPQUFPLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUNqQyxDQUFDLEVBQ0QsVUFBUyxRQUFRO1lBQ2YsSUFBRyxhQUFhLEVBQUM7Z0JBQ2YsSUFBRyxJQUFJLENBQUMsTUFBTSxFQUFDO29CQUNiLGdCQUFTLENBQUMsYUFBYSxDQUFDLENBQUE7aUJBQ3pCO2dCQUNELGFBQWEsR0FBQyxJQUFJLENBQUE7YUFDbkI7WUFDRCxJQUFHLFlBQVksRUFBQztnQkFDZCxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFBO2dCQUNoQixZQUFZLEdBQUMsSUFBSSxDQUFBO2FBQ2xCO1lBQ0QsSUFBRyxRQUFRLEVBQUM7Z0JBQ1YsS0FBSztnQkFDTCxZQUFZLEdBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFBO2dCQUNwQyxhQUFhLEdBQUMscUNBQW1CLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxFQUFDLFFBQVEsRUFBQyxZQUFZLENBQUMsQ0FBQTtnQkFDNUUsSUFBRyxJQUFJLENBQUMsTUFBTSxFQUFDO29CQUNiLGFBQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQTtpQkFDdEI7YUFDRjtRQUNILENBQUMsQ0FDRixDQUFBO1FBQ0QsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFBO0lBQ2pCLENBQUMsQ0FBQTtBQUNILENBQUM7QUF0REQsZ0NBc0RDIn0=