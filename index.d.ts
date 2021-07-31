import { EOChildFun } from "./childrenBuilder";
import { BuildResult, BuildResultList, EOParseResult, mve } from "./util";
export declare function objectForEach<T>(vs: {
    [key: string]: T;
}, fun: (v: T, k: string) => void): void;
export declare const parseUtil: {
    bind<T>(me: mve.LifeModel, value: mve.MTValue<T, any>, fun: (v: T) => void): void;
    bindKV<T_1>(me: mve.LifeModel, map: {
        [key: string]: mve.MTValue<T_1, any>;
    }, fun: (k: string, v: T_1) => void): void;
};
export interface ElementResult<JO, EO> {
    (n: JO): EOChildFun<EO>;
    one(me: mve.LifeModel, n: JO, life?: BuildResult): EOParseResult<EO>;
    root(fun: (me: mve.LifeModel) => JO): EOParseResult<EO>;
}
/**原始的组装*/
export declare function buildElementOrginal<JO, EO>(fun: (me: mve.LifeModel, n: JO, life?: BuildResult) => EOParseResult<EO>): ElementResult<JO, EO>;
/**通用的子元素组装 */
export declare function buildElement<JO, EO>(fun: (me: mve.LifeModel, n: JO, out: BuildResultList) => EO): ElementResult<JO, EO>;
