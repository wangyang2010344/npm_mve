import { EOChildFun, EOChildren } from "./childrenBuilder";
import { mve } from "./util";
/**
 * 无缓存mvc
 * @param array
 * @param fun
 */
export declare function filterChildren<T, EO>(array: () => T[], fun: (me: mve.LifeModel, row: T, index: number) => EOChildren<EO>): EOChildFun<EO>;
