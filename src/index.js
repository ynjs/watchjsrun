function getName(target){
    if(typeof target=="function"){
        return `函数 target.name`;
    }else if(typeof target=="object"){
        return target;
    }
}

const handler = {
    // .取值
	get: function(target, key) {
        if(key==="__watchjsrun"){return true;}
		console.log(`访问`,getName(target),`.${typeof key ==="symbol"?"symbol":key}`);
        if(typeof target[key] === "object" || typeof target[key] == "function"){
            if(target[key].__watchjsrun){
                return target[key];
            }
            return createProxy(target[key])
        }
		return target[key];
	},
    // =赋值
	set:function(target, key, value){
		console.log("设置",target,`的属性 ${key} 由 `,target[key],` 改为 `,getName(value));
        if(value && (typeof value === "object" || typeof value == "function")){
            if(!value.__watchjsrun){
                value = createProxy(value);
            }
        }
		return Reflect.set(target, key, value);
	},
    // ()、call、apply 调用
	apply: function(target, thisBinding, args) {
		console.log(`调用`,getName(target),"(",...args,")");
        let rev = target.apply(thisBinding,args);
		console.log(`返回`,rev);
        
        if((typeof rev === "object" || typeof rev == "function") && !rev.__watchjsrun){
            rev = createProxy(rev);
        }
        return rev;
	},
    // new 实例化
	construct: function(target, args) {
		console.log(`实例化 ${target.name} 参数 (${args.join(",")})`);
        let rev = new target(...args);
        if(!rev.__watchjsrun){
            rev = createProxy(rev);
        }
		return rev;
	}/*,
    // Object.has
    has(target, propKey){
        Reflect.has(target, propKey);
    },
    // Object.deleteProperty
    deleteProperty(target, propKey){
        Reflect.deleteProperty(target, propKey);
    },
    // Object.keys
    ownKeys(target){
        Reflect.ownKeys(target);
    },
    // Object.preventExtensions
    preventExtensions(){

    },
    // Object.defineProperty
    defineProperty(target, key, descriptor){
        return Reflect.deleteProperty(target, key, descriptor);
    },
    // Object.getOwnPropertyDescriptor 返回一个属性描述对象或者undefined。
    getOwnPropertyDescriptor(target, key){
        return Object.getOwnPropertyDescriptor(target, key);
    }*/
};

function createProxy(target){
    return new Proxy(target,handler)
}
export default createProxy;