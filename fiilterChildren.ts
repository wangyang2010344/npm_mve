import { EOChildFun, EOChildren } from "./childrenBuilder";
import { ifChildren } from "./ifChildren";
import { isArray, mve } from "./util";



/**
 * 无缓存mvc
 * @param array 
 * @param fun 
 */
export function filterChildren<T,EO>(
	array:()=>T[],
	fun:(me:mve.LifeModel,row:T,index:number)=>EOChildren<EO>
):EOChildFun<EO>{
	return ifChildren(function(me){
		const vs:EOChildren<EO>[]=[]
		array().forEach(function(row,index){
			const v=fun(me,row,index)
			if(isArray(v)){
				v.forEach(vi=>vs.push(vi))
			}else{
				vs.push(v)
			}
		})
		return vs
	})
}