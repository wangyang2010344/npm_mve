export declare type VirtualChildType<EO> = EO | VirtualChild<EO>;
export interface VirtualChildParam<EO> {
    remove(e: EO): void;
    append(e: EO, isMove?: boolean): void;
    insertBefore(e: EO, old: EO, isMove?: boolean): void;
}
/**虚拟的子层树*/
export declare class VirtualChild<EO> {
    private param;
    private parent?;
    private constructor();
    private children;
    static deepRun<EO>(view: VirtualChildType<EO>, fun: (view: EO) => void): void;
    /**自己的后一个节点 */
    private after?;
    private pureRemove;
    remove(index: number): void;
    move(oldIndex: number, newIndex: number): void;
    private pureInsert;
    private nextEL;
    insert(index: number, view: VirtualChildType<EO>): void;
    private static preformaceAdd;
    private static realNextEO;
    private static realParentNext;
    static newRootChild<EO>(param: VirtualChildParam<EO>): VirtualChild<EO>;
    push(view: VirtualChildType<EO>): void;
    newChildAt(index: number): VirtualChild<EO>;
    newChildAtLast(): VirtualChild<EO>;
}
