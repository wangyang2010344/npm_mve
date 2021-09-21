class Dep{
	static target:mve.Watcher
	static watcherCount=0
	static uid=0
	id=Dep.uid++
	subs:{[key:number]:mve.Watcher}={}
	depend(){
		if(Dep.target){
			this.subs[Dep.target.id]=Dep.target
		}
	}
	notify(){
		const oldSubs=this.subs
		this.subs={}
		for(const key in oldSubs){
			oldSubs[key].update()
		}
	}
}
/**一个基础的只读数组包含 */
export interface BaseReadArray<T>{
	size():number
	get(i:number):T
}
/**一个基础的可读写数组 */
export interface BaseArray<T> extends BaseReadArray<T>{
	insert(i:number,v:T):void
	remove(i:number):T
	set(i:number,v:T):T
	move(oldI:number,newI:number):void
	clear():void
}
export class SimpleArray<T> implements BaseArray<T>{
	private array:T[]=[]
	get(i: number): T {
		return this.array[i]
	}
	insert(i: number, v: T): void {
		this.array.splice(i,0,v)
	}
	push(v:T){
		this.array.push(v)
	}
	forEach(fun:(v:T,i:number)=>void){
		this.array.forEach(fun)
	}
	indexOf(v:T){
		return this.array.indexOf(v)
	}
	splice(i:number,d:number,...vs:T[]){
		return this.array.splice(i,d,...vs)
	}
	remove(i: number): T {
		return this.array.splice(i,1)[0]
	}
	set(i: number, v: T): T {
		const oldV=this.array[i]
		this.array[i]=v
		return oldV
	}
	move(oldI: number, newI: number): void {
		arrayMove(this,oldI,newI)
	}
	clear(): void {
		this.array.length=0
	}
	size(): number {
		return this.array.length
	}
}
export namespace mve{
  /**只读形式*/
  export type GValue<T>=()=>T
  /**值或获得值*/
	export type TValue<T>=T|GValue<T>
	/**延迟设置具体属性值 */
	export interface MDelaySet<T,A=any>{
		after(v:A,set:(v:T)=>void):void
		():A
	}
	export function delaySetAfter<T,A>(fun:()=>A,after:(v:A,set:(v:T)=>void)=>void):MDelaySet<T,A>{
		const newFun=fun as MDelaySet<T,A>
		newFun.after=after
		return newFun
	}
	/**属性节点可以的类型 */
	export type MTValue<T,A=any>=TValue<T>|MDelaySet<T,A>
  /**存储器 */
  export interface Value<T>{
    (v:T):void
    ():T
  }
  /**新存储器*/
  export function valueOf<T>(v:T):Value<T>{
    const dep=new Dep()
    return function(){
      if(arguments.length==0){
        dep.depend()
        return v
      }else{
        if(Dep.target){
          throw "计算期间不允许修改"
        }else{
          v=arguments[0]
          dep.notify()
        }
      }
    }
  }
	/**
	 * 转化成统一的函数
	 * @param a 
	 */
  export function valueOrCall<T>(a:TValue<T>):mve.GValue<T>{
    if(typeof(a)=='function'){
      return a as mve.GValue<T>
    }else{
      return function(){return a}
    }
	}
	/**
	 * 重写属性值为可观察
	 * @param a 
	 * @param fun 
	 */
	export function reWriteMTValue<T,V>(a:MDelaySet<V,T>|GValue<T>,fun:(v:T)=>V){
		const after=a['after']
		const vm=function(){return fun(a())}
		vm.after=after
		return vm
	}
  export interface ArrayModelView<T>{
    insert(index:number,row:T):void
    remove(index:number):void
		set(index:number,row:T):void
    move(oldIndex:number,newIndex:number):void
	}
	/**构造只读的模型*/
	export class CacheArrayModel<T> implements BaseReadArray<T>{
		constructor(
			public readonly size:GValue<number>,
			private readonly array:BaseReadArray<T>,
			private readonly views:SimpleArray<ArrayModelView<T>>
		){}
    addView(view:ArrayModelView<T>){
      this.views.push(view);
			//自动初始化
      for(var i=0;i<this.array.size();i++){
        view.insert(i,this.array[i])
      }
    }
    removeView(view:ArrayModelView<T>){
			const index=this.views.indexOf(view)
      if (index!=-1) {
        this.views.remove(index);
      }
    }
		get(i: number): T {
			//不支持响应式
			return this.array[i]
		}
		getLast(): T {
			const size=this.size()
			return this.array[size-1]
		}
		findIndex(fun: (v: T, i: number) => boolean): number {
			const size=this.size()
			for(let i=0;i<size;i++){
				const row=this.get(i)
				if(fun(row,i)){
					return i
				}
			}
			return -1
		}
    forEach(fun:(row:T,i:number)=>void){
			const size=this.size()
			for(let i=0;i<size;i++){
				fun(this.get(i),i)
			}
    }
		map<V>(fun:(row:T,i:number)=>V){
			const vs:V[]=[]
			const size=this.size()
			for(let i=0;i<size;i++){
				vs.push(fun(this.get(i),i))
			}
			return vs
		}
		filter(fun:(row:T,i:number)=>boolean){
			const vs:T[]=[]
			const size=this.size()
			for(let i=0;i<size;i++){
				const row=this.get(i)
				if(fun(row,i)){
					vs.push(row)
				}
			}
			return vs
		}
		findRow(fun:(row:T,i:number)=>boolean){
			const size=this.size()
			for(let i=0;i<size;i++){
				const row=this.get(i)
				if(fun(row,i)){
					return row
				}
			}
		}
    indexOf(row:T){
      return this.findIndex(theRow=>theRow==row);
    }
    count(fun:(row:T,i:number)=>boolean){
      const size=this.size()
      let count=0
			for(let i=0;i<size;i++){
				const row=this.get(i)
				if(fun(row,i)){
					count++
				}
			}
      return count
    }
    exist(fun:(row:T,i:number)=>boolean){
      const size=this.size()
			for(let i=0;i<size;i++){
				const row=this.get(i)
				if(fun(row,i)){
					return true
				}
			}
      return false
    }
    all(fun:(row:T,i:number)=>boolean){
      const size=this.size()
			for(let i=0;i<size;i++){
				const row=this.get(i)
				if(!fun(row,i)){
					return false
				}
			}
      return true
    }
    join(split?:string){
      return this.map(v=>v).join(split)
    }
	}
  export class ArrayModel<T> extends CacheArrayModel<T>{
    private readonly views_value:SimpleArray<ArrayModelView<T>>;
		private readonly size_value:mve.Value<number>;
		private readonly array_value:SimpleArray<T>
    constructor(array:T[]=[]) {
			const array_value=new SimpleArray<T>()
			for(const row of array){
				array_value.push(row)
			}
			const size_value=mve.valueOf(0);
			const views_value=new SimpleArray<ArrayModelView<T>>()
			super(size_value,array_value,views_value)
			this.size_value=size_value
			this.array_value=array_value
      this.views_value=views_value;
			//长度是可观察的
			this.reload_size();
    }
    private reload_size(){
      this.size_value(this.array_value.size());
    }
    insert(index:number,row:T){
			this.array_value.insert(index,row)
			this.views_value.forEach(function(view){
        view.insert(index,row);
			})
      this.reload_size();
    }
    remove(index:number){
      /*更常识的使用方法*/
      const row=this.get(index);
      this.array_value.remove(index);
			this.views_value.forEach(function(view){
        view.remove(index);
			})
      this.reload_size();
      return row;
		}
		set(index:number,row:T){
			const oldRow=this.array_value.splice(index,1,row)[0]
			this.views_value.forEach(function(view){
				view.set(index,row)
			})
			this.reload_size()
			return oldRow
		}
		/**清理匹配项 */
		removeWhere(fun:(row:T,i:number)=>boolean){
			var i=this.size()-1;
			while(i>-1){
				var theRow=this.get(i);
				if(fun(theRow,i)){
					this.remove(i);
				}
				i--;
			}
		}
		/**清理单纯相等的项 */
		removeEqual(row:T){
			this.removeWhere(theRow=>theRow==row)
		}
		move(oldIndex:number,newIndex:number){
			/**有效的方法*/
			arrayMove(this.array_value,oldIndex,newIndex)
			this.views_value.forEach(function(view){
				view.move(oldIndex,newIndex);
			})
			this.reload_size()
		}
    /*多控件用array和model，单控件用包装*/
    moveToFirst(index:number) {
      this.move(index,0);
    }
    moveToLast(index:number){
      this.move(index,this.size_value()-1);
    }
    shift(){
      return this.remove(0);
    }
    unshift(row:T){
      return this.insert(0,row)
    }
    pop(){
      return this.remove(this.size_value()-1);
    }
    push(row:T){
      return this.insert(this.size_value(),row);
    }
    clear(){
      while(this.size_value()>0){
        this.pop();
      }
    }
    reset(array:T[]=[]){
      this.clear();
			for(const row of array){
				this.push(row)
			}
		}
  }
  export function arrayModelOf<T>(array:T[]){
    return new ArrayModel(array)
  }

  export abstract class Watcher{
		constructor(){
			Dep.watcherCount++
		}
    static uid=0
    id=Watcher.uid++
    private enable=true
    update(){
      if(this.enable){
        this.realUpdate()
      }
    }
    disable(){
      this.enable=false
			Dep.watcherCount--
    }
    protected abstract realUpdate():void;
  }
  
  export function Watch(exp:()=>void){
    return new WatcherImpl(exp)
  }

  export function WatchExp<A,B>(before:()=>A,exp:(a:A)=>B,after:(b:B)=>void){
    return new WatcherImplExp(before,exp,after)
  }

  export function WatchBefore<A>(before:()=>A,exp:(a:A)=>void){
    return new WatcherImplBefore(before,exp)
  }

  export function WatchAfter<B>(exp:()=>B,after:(b:B)=>void){
    return new WatcherImplAfter(exp,after)
  }

  export interface LifeModel{
    Watch(exp:()=>void):void
    WatchExp<A,B>(before:()=>A,exp:(a:A)=>B,after:(b:B)=>void):void
    WatchBefore<A>(before:()=>A,exp:(a:A)=>void):void
    WatchAfter<B>(exp:()=>B,after:(b:B)=>void):void
    Cache<T>(fun:()=>T):()=>T
		destroyList:(()=>void)[]
  }

  class LifeModelImpl implements LifeModel{
		destroyList=[]
    private pool:Watcher[]=[]
    Watch(exp){
      this.pool.push(mve.Watch(exp))
    }
    WatchExp(before,exp,after){
      this.pool.push(mve.WatchExp(before,exp,after))
    }
    WatchBefore(before,exp){
      this.pool.push(mve.WatchBefore(before,exp))
    }
    WatchAfter(exp,after){
      this.pool.push(mve.WatchAfter(exp,after))
    }
    Cache(fun){
      const dep=new Dep()
      let cache
      this.Watch(function(){
        cache=fun()
        dep.notify()
      })
      return function(){
        dep.depend()
        return cache
      }
    }
    destroy(){
      while(this.pool.length>0){
        this.pool.pop().disable()
      }
			for(let destroy of this.destroyList){
				destroy()
			}
    }
  }
  export function newLifeModel():{
    me:LifeModel,
    destroy():void
  }{
    const lm=new LifeModelImpl()
    return {
      me:lm,
      destroy(){
        lm.destroy()
      }
    }
  }
  export type LifeModelReturn=ReturnType<typeof newLifeModel>
}

class WatcherImpl extends mve.Watcher{
  constructor(
    public readonly exp:()=>void
  ){
    super()
    this.update()
  }
  realUpdate(){
    Dep.target=this
    this.exp()
    Dep.target=null
  }
}
class WatcherImplExp<A,B> extends mve.Watcher{
  constructor(
    public readonly before:()=>A,
    public readonly exp:(a:A)=>B,
    public readonly after:(b:B)=>void
  ){
    super()
    this.update()
  }
  realUpdate(){
    const a=this.before()
    Dep.target=this
    const b=this.exp(a)
    Dep.target=null
    this.after(b)
  }
}
class WatcherImplBefore<A> extends mve.Watcher{
  constructor(
    public readonly before:()=>A,
    public readonly exp:(a:A)=>void
  ){
    super()
    this.update()
  }
  realUpdate(){
    const a=this.before()
    Dep.target=this
    this.exp(a)
    Dep.target=null
  }
}
class WatcherImplAfter<B> extends mve.Watcher{
  constructor(
    public readonly exp:()=>B,
    public readonly after:(b:B)=>void
  ){
    super()
    this.update()
  }
  realUpdate(){
    Dep.target=this
    const b=this.exp()
    Dep.target=null
    this.after(b)
  }
}

export type EmptyFun=()=>void
export function orRun(v?:EmptyFun){
  if(v){v()}
}
export interface BuildResult{
	init?():void,
	destroy?():void
}
export function orInit(v:BuildResult){
  if(v.init){
    v.init()
  }
}
export function orDestroy(v:BuildResult){
  if(v.destroy){
    v.destroy()
  }
}
/**
 * 判断是否是数组
 */
export function isArray<T>(v):v is Array<T>{
	return v instanceof Array || Object.prototype.toString.call(v) === '[object Array]';
}

export function arrayForEach<T>(vs:BaseReadArray<T>,fun:(v:T,i:number)=>void){
	for(let i=0;i<vs.size();i++){
		fun(vs.get(i),i)
	}
}
/**
 * 数组移动
 * @param vs 
 * @param oldIndex 
 * @param newIndex 
 */
export function arrayMove<T>(vs:BaseArray<T>,oldIndex:number,newIndex:number){
	const row=vs.remove(oldIndex)
	vs.insert(newIndex,row);
}
export class BuildResultList{
  private constructor(){}
  static init(...xs:BuildResult[]){
    const it=new BuildResultList()
    for(let i=0;i<xs.length;i++){
      it.push(xs[i])
    }
    return it
  }
  private inits:EmptyFun[]=[]
  private destroys:EmptyFun[]=[]
  orPush(v?:BuildResult){
    if(v){
      this.push(v)
    }
  }
  push(v:BuildResult){
    if(v.init){
      this.inits.push(v.init)
    }
    if(v.destroy){
      this.destroys.push(v.destroy)
    }
  }
  getInit(){
    const inits=this.inits
    const size=inits.length
    if(size>1){
      return function(){
        for(let i=0;i<size;i++){
          inits[i]()
        }
      }
    }else
    if(size==1){
      return inits[0]
    }
  }
  getDestroy(){
    const destroys=this.destroys
    const size=destroys.length
    if(size>1){
      return function(){
        for(let i=size-1;i>-1;i--){
          destroys[i]()
        }
      }
    }else
    if(size==1){
      return destroys[0]
    }
  }
  getAsOne<E>(e?:E):EOParseResult<E>{
    return {
			element:e,
      init:this.getInit(),
      destroy:this.getDestroy()
    }
  }
}
/**单元素的解析返回*/
export interface EOParseResult<EO> extends BuildResult{
  element:EO
}
export function onceLife<T extends BuildResult>(p:T,nowarn?:boolean){
	const warn=!nowarn
  const self={
    isInit:false,
    isDestroy:false,
    out:p
  }
  const init=p.init
  const destroy=p.destroy
  if(init){
    p.init=function(){
      if(self.isInit){
				if(warn){
					console.warn("禁止重复init")
				}
      }else{
        self.isInit=true
        init()
      }
    }
		if(!destroy){
			p.destroy=function(){
				if(self.isDestroy){
					if(warn){
						console.warn("禁止重复destroy")
					}
				}else{
					self.isDestroy=true
					if(!self.isInit){
						console.warn("未初始化故不销毁")
					}
				}
			}
		}
  }
  if(destroy){
		if(!init){
			p.init=function(){
				if(self.isInit){
					if(warn){
						console.warn("禁止重复init")
					}
				}else{
					self.isInit=true
				}
			}
		}
    p.destroy=function(){
      if(self.isDestroy){
				if(warn){
					console.warn("禁止重复destroy")
				}
      }else{
        self.isDestroy=true
        if(self.isInit){
          destroy()
        }else{
					console.warn("未初始化故不销毁")
        }
      }
    }
  }
  return self
}