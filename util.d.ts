/**一个基础的只读数组包含 */
export interface BaseReadArray<T> {
    size(): number;
    get(i: number): T;
}
/**一个基础的可读写数组 */
export interface BaseArray<T> extends BaseReadArray<T> {
    insert(i: number, v: T): void;
    remove(i: number): T;
    set(i: number, v: T): T;
    move(oldI: number, newI: number): void;
    clear(): void;
}
export declare class SimpleArray<T> implements BaseArray<T> {
    private array;
    get(i: number): T;
    insert(i: number, v: T): void;
    push(v: T): void;
    forEach(fun: (v: T, i: number) => void): void;
    indexOf(v: T): number;
    splice(i: number, d: number, ...vs: T[]): T[];
    remove(i: number): T;
    set(i: number, v: T): T;
    move(oldI: number, newI: number): void;
    clear(): void;
    size(): number;
}
export declare namespace mve {
    /**只读形式*/
    type GValue<T> = () => T;
    /**值或获得值*/
    type TValue<T> = T | GValue<T>;
    /**延迟设置具体属性值 */
    interface MDelaySet<T, A = any> {
        after(v: A, set: (v: T) => void): void;
        (): A;
    }
    function delaySetAfter<T, A>(fun: () => A, after: (v: A, set: (v: T) => void) => void): MDelaySet<T, A>;
    /**属性节点可以的类型 */
    type MTValue<T, A = any> = TValue<T> | MDelaySet<T, A>;
    /**存储器 */
    interface Value<T> {
        (v: T): void;
        (): T;
    }
    /**新存储器*/
    function valueOf<T>(v: T): Value<T>;
    /**
     * 转化成统一的函数
     * @param a
     */
    function valueOrCall<T>(a: TValue<T>): mve.GValue<T>;
    /**
     * 重写属性值为可观察
     * @param a
     * @param fun
     */
    function reWriteMTValue<T, V>(a: MDelaySet<V, T> | GValue<T>, fun: (v: T) => V): {
        (): V;
        after: any;
    };
    interface ArrayModelView<T> {
        insert(index: number, row: T): void;
        remove(index: number): void;
        set(index: number, row: T): void;
        move(oldIndex: number, newIndex: number): void;
    }
    /**构造只读的模型*/
    class CacheArrayModel<T> implements BaseReadArray<T> {
        readonly size: GValue<number>;
        private readonly array;
        private readonly views;
        constructor(size: GValue<number>, array: BaseReadArray<T>, views: SimpleArray<ArrayModelView<T>>);
        addView(view: ArrayModelView<T>): void;
        removeView(view: ArrayModelView<T>): void;
        get(i: number): T;
        getLast(): T;
        findIndex(fun: (v: T, i: number) => boolean): number;
        forEach(fun: (row: T, i: number) => void): void;
        map<V>(fun: (row: T, i: number) => V): V[];
        filter(fun: (row: T, i: number) => boolean): T[];
        findRow(fun: (row: T, i: number) => boolean): T;
        indexOf(row: T): number;
        count(fun: (row: T, i: number) => boolean): number;
        exist(fun: (row: T, i: number) => boolean): boolean;
        all(fun: (row: T, i: number) => boolean): boolean;
        join(split?: string): string;
    }
    class ArrayModel<T> extends CacheArrayModel<T> {
        private readonly views_value;
        private readonly size_value;
        private readonly array_value;
        constructor(array?: T[]);
        private reload_size;
        insert(index: number, row: T): void;
        remove(index: number): T;
        set(index: number, row: T): T;
        /**清理匹配项 */
        removeWhere(fun: (row: T, i: number) => boolean): void;
        /**清理单纯相等的项 */
        removeEqual(row: T): void;
        move(oldIndex: number, newIndex: number): void;
        moveToFirst(index: number): void;
        moveToLast(index: number): void;
        shift(): T;
        unshift(row: T): void;
        pop(): T;
        push(row: T): void;
        clear(): void;
        reset(array?: T[]): void;
    }
    function arrayModelOf<T>(array: T[]): ArrayModel<T>;
    abstract class Watcher {
        constructor();
        static uid: number;
        id: number;
        private enable;
        update(): void;
        disable(): void;
        protected abstract realUpdate(): void;
    }
    function Watch(exp: () => void): WatcherImpl;
    function WatchExp<A, B>(before: () => A, exp: (a: A) => B, after: (b: B) => void): WatcherImplExp<A, B>;
    function WatchBefore<A>(before: () => A, exp: (a: A) => void): WatcherImplBefore<A>;
    function WatchAfter<B>(exp: () => B, after: (b: B) => void): WatcherImplAfter<B>;
    interface LifeModel {
        Watch(exp: () => void): void;
        WatchExp<A, B>(before: () => A, exp: (a: A) => B, after: (b: B) => void): void;
        WatchBefore<A>(before: () => A, exp: (a: A) => void): void;
        WatchAfter<B>(exp: () => B, after: (b: B) => void): void;
        Cache<T>(fun: () => T): () => T;
        destroyList: (() => void)[];
    }
    function newLifeModel(): {
        me: LifeModel;
        destroy(): void;
    };
    type LifeModelReturn = ReturnType<typeof newLifeModel>;
}
declare class WatcherImpl extends mve.Watcher {
    readonly exp: () => void;
    constructor(exp: () => void);
    realUpdate(): void;
}
declare class WatcherImplExp<A, B> extends mve.Watcher {
    readonly before: () => A;
    readonly exp: (a: A) => B;
    readonly after: (b: B) => void;
    constructor(before: () => A, exp: (a: A) => B, after: (b: B) => void);
    realUpdate(): void;
}
declare class WatcherImplBefore<A> extends mve.Watcher {
    readonly before: () => A;
    readonly exp: (a: A) => void;
    constructor(before: () => A, exp: (a: A) => void);
    realUpdate(): void;
}
declare class WatcherImplAfter<B> extends mve.Watcher {
    readonly exp: () => B;
    readonly after: (b: B) => void;
    constructor(exp: () => B, after: (b: B) => void);
    realUpdate(): void;
}
export declare type EmptyFun = () => void;
export declare function orRun(v?: EmptyFun): void;
export interface BuildResult {
    init?(): void;
    destroy?(): void;
}
export declare function orInit(v: BuildResult): void;
export declare function orDestroy(v: BuildResult): void;
/**
 * 判断是否是数组
 */
export declare function isArray<T>(v: any): v is Array<T>;
export declare function arrayForEach<T>(vs: BaseReadArray<T>, fun: (v: T, i: number) => void): void;
/**
 * 数组移动
 * @param vs
 * @param oldIndex
 * @param newIndex
 */
export declare function arrayMove<T>(vs: BaseArray<T>, oldIndex: number, newIndex: number): void;
export declare class BuildResultList {
    private constructor();
    static init(...xs: BuildResult[]): BuildResultList;
    private inits;
    private destroys;
    orPush(v?: BuildResult): void;
    push(v: BuildResult): void;
    getInit(): EmptyFun;
    getDestroy(): EmptyFun;
    getAsOne<E>(e?: E): EOParseResult<E>;
}
/**单元素的解析返回*/
export interface EOParseResult<EO> extends BuildResult {
    element: EO;
}
export declare function onceLife<T extends BuildResult>(p: T, nowarn?: boolean): {
    isInit: boolean;
    isDestroy: boolean;
    out: T;
};
export {};
