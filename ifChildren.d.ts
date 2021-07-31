import { EOChildFun, EOChildren } from "./childrenBuilder";
import { mve } from "./util";
/**
 * 子元素集片段是动态生成的，watchAfter后直接新入
 * @param fun
 */
export declare function ifChildren<EO>(fun: (me: mve.LifeModel) => EOChildren<EO> | null): EOChildFun<EO>;
