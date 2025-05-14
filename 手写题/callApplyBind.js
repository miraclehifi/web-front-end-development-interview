// * call
Function.prototype.myCall = function(context, ...args) {
    if(!this instanceof Function) {
        throw new TypeError("Function.prototype.myCall - 被调用的对象必须是函数");
    }
    // 如果没有传入上下文对象，则默认为全局对象
    context = context || globalThis
    // 用Symbol来创建唯一的fn，防止名字冲突 
    const fnKey = Symbol('key')
    // this是调用myCall的函数，将函数绑定到上下文对象的新属性上
    context[fnKey] = this
    
    const result = context[fnKey](...args)
    // 删除 context 对象上的 fnKey 属性，避免对 context 对象造成不必要的修改
    delete context[fnKey]
    return result
}

// * apply
Function.prototype.myApply = function(context, argsArr) {
    if( typeof this !== 'function') {
        throw new TypeError("Function.prototype.myApply - 被调用的对象必须是函数");
    }
    if(argsArr && !Array.isArray(argsArr)) {
        throw new TypeError("Function.prototype.myApply - 传入的参数必须是数组");
    }
    // 如果没有传入上下文对象，则默认为全局对象
    context = context || globalThis

    argsArr = argsArr || []
    // 用Symbol来创建唯一的fn，防止名字冲突 
    const fnKey = Symbol('key')
    // this是调用myCall的函数，将函数绑定到上下文对象的新属性上
    context[fnKey] = this
    
    const result = context[fnKey](...argsArr)
    // 删除 context 对象上的 fnKey 属性，避免对 context 对象造成不必要的修改
    delete context[fnKey]
    return result
}

// * bind
Function.prototype.myBind = function(context, ...args) {
    if(!this instanceof Function) {
        throw new TypeError("Function.prototype.myBind - 被调用的对象必须是函数");
    }
    // 如果没有传入上下文对象，则默认为全局对象
    context = context || globalThis
    // 用Symbol来创建唯一的fn，防止名字冲突 
    const fnKey = Symbol('key')
    // this是调用myCall的函数，将函数绑定到上下文对象的新属性上
    context[fnKey] = this
    
    return function fn(...params) {
        let result
        if(this instanceof fn) {
            // 如果 this 是 fn 的实例，说明该函数是通过 new 关键字调用的
            result = new context[fnKey](...args, ...params)
        } else {
            // 如果不是通过 new 调用的，则直接调用原始函数
            result = context[fnKey](...args, ...params)
        }
        delete context[fnKey]
        return result
    }
}

// * new
function myNew(constructor, ...args) {
    // 步骤 1: 创建一个新对象
    const obj = {};

    // 步骤 2: 设置新对象的原型
    obj.__proto__ = constructor.prototype;

    // 步骤 3: 执行构造函数，并将 this 指向新对象
    const result = constructor.apply(obj, args);

    // 步骤 4: 如果构造函数返回一个对象，则返回该对象；否则，返回新创建的对象
    return typeof result === 'object' && result!== null? result : obj;
}

// 测试代码
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
}

const person = myNew(Person, 'John', 30);
console.log(person.name); // 输出: John
console.log(person.age);  // 输出: 30
