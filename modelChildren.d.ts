import { EOChildFun, EOChildren } from "./childrenBuilder";
import { mve, BaseReadArray } from "./util";
export interface ModelCacheValue<V> {
    readonly index: mve.GValue<number>;
    readonly value: V;
}
export declare type ModelCacheChildren<V> = mve.CacheArrayModel<ModelCacheValue<V>>;
export interface ModelWriteValue<V> extends ModelCacheValue<V> {
    index: mve.Value<number>;
    destroy(): void;
}
/**
 * 初始化更新计数
 * @param views
 * @param index
 */
export declare function initUpdateIndex<V>(views: BaseReadArray<ModelWriteValue<V>>, index: number): void;
/**
 * 删除时更新计算
 * @param views
 * @param index
 */
export declare function removeUpdateIndex<V>(views: BaseReadArray<ModelWriteValue<V>>, index: number): void;
/**
 * 移动时更新计数
 * @param views
 * @param oldIndex
 * @param newIndex
 */
export declare function moveUpdateIndex<V>(views: BaseReadArray<ModelWriteValue<V>>, oldIndex: number, newIndex: number): void;
export interface ModelCacheReturn<V> {
    views: ModelCacheChildren<V>;
    destroy(): void;
}
/**
 * 从一个model到另一个model，可能有销毁事件
 * 应该是很少用的，尽量不用
 * 可以直接用CacheArrayModel<T>作为组件基础参数，在组件需要的字段不存在时，入参定义T到该字段的映射
 * @param model
 * @param insert
 */
export declare function modelCache<T, V>(model: mve.CacheArrayModel<T>, insert: (row: T, index: mve.GValue<number>) => V, destroy?: (v: V) => void): ModelCacheReturn<V>;
/**
 * 从model到视图
 * @param model
 * @param fun
 */
export declare function modelChildren<T, EO>(model: mve.CacheArrayModel<T>, fun: (me: mve.LifeModel, row: T, index: mve.GValue<number>) => EOChildren<EO>): EOChildFun<EO>;
export interface ModelChildrenRenderReturn<V, EO> {
    data: V;
    element: EOChildren<EO>;
}
/**
 * 从model到带模型视图
 * 应该是很少用的，尽量不用
 * @param model
 * @param fun
 */
export declare function modelCacheChildren<T, V, EO>(model: mve.CacheArrayModel<T>, fun: (me: mve.LifeModel, row: T, index: mve.GValue<number>) => ModelChildrenRenderReturn<V, EO>): {
    views: ModelCacheChildren<V>;
    children: EOChildFun<EO>;
};
