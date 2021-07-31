export type VirtualChildType<EO>= EO | VirtualChild<EO>

export interface VirtualChildParam<EO>{
  remove(e:EO):void,
  append(e:EO,isMove?:boolean):void,
  insertBefore(e:EO,old:EO,isMove?:boolean):void
}
/**虚拟的子层树*/
export class VirtualChild<EO>{
  private constructor(
    private param:VirtualChildParam<EO>,
    private parent?:VirtualChild<EO>
  ){}
  private children:VirtualChildType<EO>[]=[]

  static deepRun<EO>(view:VirtualChildType<EO>,fun:(view:EO)=>void){
    if(view instanceof VirtualChild){
      for(let i=0;i<view.children.length;i++){
        VirtualChild.deepRun(view.children[i],fun)
      }
    }else{
      fun(view)
    }
  }
  /**自己的后一个节点 */
  private after?:VirtualChildType<EO>
  private pureRemove(index:number){
    const view=this.children.splice(index,1)[0]
    const before=this.children[index-1]
    const after=this.children[index]
    if(before && before instanceof VirtualChild){
      before.after=after
    }
    return view
  }
  remove(index:number){
    if(index>-1 && index<this.children.length){
      const view=this.pureRemove(index)
      const param=this.param
      VirtualChild.deepRun(view,function(e){
        param.remove(e)
      })
    }else{
      console.warn(`删除${index}失败,总宽度仅为${this.children.length}`)
    }
  }
  move(oldIndex:number,newIndex:number){
    if(oldIndex>-1 && oldIndex<this.children.length
    && newIndex>-1 && newIndex<this.children.length){
      const view=this.pureRemove(oldIndex)
      const after=this.pureInsert(newIndex,view)
      const realNextEL=this.nextEL(after)
			VirtualChild.preformaceAdd(view,this.param,realNextEL,true)
    }else{
			console.warn(`移动失败${oldIndex}->${newIndex},总宽度仅为${this.children.length}`)
		}
  }
  private pureInsert(index:number,view:VirtualChildType<EO>){
    this.children.splice(index,0,view)
    const before=this.children[index-1]
    const after=this.children[index+1]
    if(view instanceof VirtualChild){
      view.parent=this
      view.param=this.param
      view.after=after
    }
    if(before && before instanceof VirtualChild){
      before.after=view
    }
    return after
  }
  private nextEL(after:VirtualChildType<EO>){
    if(after){
      return VirtualChild.realNextEO(after)
    }else{
      return VirtualChild.realParentNext(this)
    }
  }
  insert(index:number,view:VirtualChildType<EO>){
    if(index>-1 && index<(this.children.length+1)){
      const after=this.pureInsert(index,view)
      const realNextEL=this.nextEL(after)
			VirtualChild.preformaceAdd(view,this.param,realNextEL)
    }else{
      console.warn(`插入${index}失败,总宽度仅为${this.children.length}`)
    }
  }

	private static preformaceAdd<EO>(view:VirtualChildType<EO>,param:VirtualChildParam<EO>,realNextEL?:EO,move?:boolean){
		if(realNextEL){
			VirtualChild.deepRun(view,function(e){
				param.insertBefore(e,realNextEL,move) 
			})
		}else{
			VirtualChild.deepRun(view,function(e){
				param.append(e,move)
			})
		}
	}
  private static realNextEO<EO>(view:VirtualChildType<EO>):EO|null{
    if(view instanceof VirtualChild){
      const childrenFirst=view.children[0]
      if(childrenFirst){
        //寻找自己的子级节点
        return VirtualChild.realNextEO(childrenFirst)
      }else{
        //自己的后继
        const after=view.after
        if(after){
          return VirtualChild.realNextEO(after)
        }else{
          return VirtualChild.realParentNext(view.parent)
        }
      }
    }else{
      return view
    }
  }
  private static realParentNext<EO>(parent?:VirtualChild<EO>):EO|null{
    if(parent){
      const after=parent.after
      if(after){
        return VirtualChild.realNextEO(after)
      }else{
        return VirtualChild.realParentNext(parent.parent)
      }
    }else{
      return null
    }
  }
  static newRootChild<EO>(param:VirtualChildParam<EO>){
    return new VirtualChild(param)
  }
  push(view:VirtualChildType<EO>){
    return this.insert(this.children.length,view)
  }
  newChildAt(index:number):VirtualChild<EO>{
    const child=new VirtualChild(this.param,this)
    this.insert(index,child)
    return child
  }
  newChildAtLast(){
    return this.newChildAt(this.children.length)
  }
}