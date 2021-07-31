import { VirtualChild, VirtualChildParam } from "./virtualTreeChildren";
import { BuildResult, mve } from "./util";
/**重复的函数节点/组件封装成mve*/
export interface EOChildFun<EO> {
    (parent: VirtualChild<EO>, me: mve.LifeModel): BuildResult;
}
/**存放空的生命周期 */
export declare class ChildLife {
    readonly result: BuildResult;
    constructor(result: BuildResult);
    static of(result: BuildResult): ChildLife;
}
export declare type EOChildren<EO> = EO | EOChildFun<EO> | EOChildren<EO>[] | ChildLife;
export declare function isEOChildFunType<EO>(child: EOChildren<EO>): child is EOChildFun<EO>;
export declare function baseChildrenBuilder<EO>(me: mve.LifeModel, children: EOChildren<EO>, parent: VirtualChild<EO>): import("./util").EOParseResult<unknown>;
export declare function childrenBuilder<EO>(me: mve.LifeModel, x: VirtualChildParam<EO>, children: EOChildren<EO>): import("./util").EOParseResult<unknown>;
