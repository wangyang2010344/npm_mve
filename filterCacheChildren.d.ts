import { EOChildFun, EOChildren } from "./childrenBuilder";
import { mve } from "./util";
/**
 * 有缓存mvc
 * @param array
 * @param fun
 * @returns
 */
export declare function filterCacheChildren<T, EO>(array: () => T[], fun: (me: mve.LifeModel, row: () => T, index: number) => EOChildren<EO>): EOChildFun<EO>;
