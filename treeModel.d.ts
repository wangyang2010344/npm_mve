import { BaseArray, mve } from "./util";
import { VirtualChild, VirtualChildParam } from "./virtualTreeChildren";
export interface VirtualList<T> {
    index(v: T, i: number): void;
    index(v: T): number;
    before(v: T, b: T): void;
    before(v: T): T;
    after(v: T, b: T): void;
    after(v: T): T;
}
export declare class VirtualListParam<T> implements VirtualChildParam<T> {
    private readonly list;
    private up;
    constructor(list: BaseArray<T>, up: VirtualList<T>);
    k: any;
    remove(e: T): void;
    append(e: T, isMove?: boolean): void;
    insertBefore(e: T, old: T, isMove?: boolean): void;
}
declare type DestroyFun = () => void;
export declare type ModelItemFun<V> = (parent: VirtualChild<V>) => DestroyFun;
export declare class ModelLife {
    readonly destroy: DestroyFun;
    constructor(destroy: DestroyFun);
}
export declare type ModelItem<V> = V | ModelItemFun<V> | ModelItem<V>[] | ModelLife;
/**
 * 自定义类似于重复的子节点。需要将其添加到生命周期。
 * @param root
 */
export declare function superModelList<T, V>(root: ModelItem<V>, vp: VirtualList<V>): {
    model: mve.CacheArrayModel<V>;
    destroy: () => void;
};
export declare type RenderListModelChildren<K, V> = (row: K, index: mve.GValue<number>) => ModelItem<V>;
/**
 * 类似于modelChildren
 * 但是如果单纯的树，叶子节点交换，并不能观察到是交换
 * @param model
 * @param fun
 */
export declare function listModelChilren<K, V>(model: mve.CacheArrayModel<K>, fun: RenderListModelChildren<K, V>): ModelItemFun<V>;
/**
 * 类似于modelChildren
 * 但是如果单纯的树，叶子节点交换，并不能观察到是交换
 * @param model
 * @param fun
 */
export declare function listModelChilrenReverse<K, V>(model: mve.CacheArrayModel<K>, fun: RenderListModelChildren<K, V>): ModelItemFun<V>;
/**
 * 模仿DOM节点，有前后，和绝对位置
 */
export interface RNode<T> {
    data: T;
    index: mve.GValue<number | null>;
    before: mve.GValue<RNode<T> | null>;
    after: mve.GValue<RNode<T> | null>;
}
export declare function rwNodeOf<T>(v: T): RWNode<T>;
declare class RWNode<T> implements RNode<T> {
    data: T;
    constructor(data: T);
    index: mve.Value<any>;
    before: mve.Value<any>;
    after: mve.Value<any>;
}
export declare function rnModelList<T>(root: ModelItem<RNode<T>>): {
    model: mve.CacheArrayModel<RNode<T>>;
    destroy: () => void;
};
export {};
