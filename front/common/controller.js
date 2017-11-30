var Utils = require('./utils')
var dot = require('./doT');

//控制对象集合，全局可见，用于视图事件回调
var cset = window.CSet = (function(){
    return {
        add:function(cObj,id){
            if(this.hasOwnProperty(id))
                delete this[id];
            this[id] = cObj;
            return 'CSet.'+id;
        }
    }
})();

var Controller = function (options) {
    var innerHTML = '';
    if(!options.tpl){
        if(options.ele)
            innerHTML = document.getElementById(options.ele).innerHTML;
    }else{
        innerHTML = options.tpl;
    }
    if(!Utils.isFunction(options.data)){
        console.error('data props is not a function');
        return;
    }
    var data = options.data.call(this);
    this.data = data;
    var _data = Utils.extend(true,{},data);
    if(options.methods){
        var id = options.ele || options._id;
        var scope = cset.add(this,id);
        Utils.each(options.methods, function (callback,func) {
            this[func] = callback;
            _data[func] = scope+'.'+ func +'(event)';
        },this);
    }
    //监听数据模型get、set方法
    this._observe(this.data);
    var tpl;
    if(!options.components){
        tpl = dot.template(innerHTML);
    }else{
        tpl = dot.template(innerHTML,null,options.components);
    }
    var html = tpl(_data);
    if(options.ele){
        var $ele = document.getElementById(options.ele);
        $ele.setAttribute('name',options.ele);
        $ele.innerHTML = html;
    }else{
        html = '<div name="view_page">'+html+'</div>';
    }
    this.view = html;
    if(options.watch){
        Utils.each(options.watch,function(callback,name){
            this._watch(this.data,name,callback);
        },this)
    }
    if(options.router){
        options.router.$ele = document.getElementsByTagName('router-view')[0];
    }
}

Controller.prototype.get = function(name){
    try{
        return Utils.gset(this.data,name);
    }catch(e){
        console.error('has not key');
        return null;
    }
}

Controller.prototype.set = function(name,value){
    try{
        Utils.gset(this.data,name,value);
    }catch(e){
        console.error('has not key');
        return false;
    }
}

//监听数据get、set方法
Controller.prototype._observe = function  (data){
    if(Utils.isObject(data) || Utils.isArray(data)){
        Utils.each(data,function(value,key){
            //递归监听子对象
            this._observe(value);
            var depend = new Depend();
            var self = this;
            Object.defineProperty(data,key,{
                get:function (){
                    if(Depend.watcher) {
                        depend.addWatcher(Depend.watcher)
                    }
                    return value;
                },
                set:function (newVal){
                    if(value === newVal)
                        return
                    value = newVal;
                    depend.notify();
                    self._observe(value);
                }
            })
        },this)
    }
}

//添加对数据对象的观察（递归使子对象继承父对象观察回调函数）
Controller.prototype._watch = function(data,name,callback){
    var _data = (new Watcher(this,data,name,callback)).value;
    if(Utils.isObject(_data)||Utils.isArray(_data)){
        Utils.each(_data,function(value,key){
            this._watch(_data,key,callback);
        },this)
    }
}

Controller.vm = function(id,options){
    return {
        initialize:function(params){
            options.data.params = params;
            options._id = id;
            var c = new Controller(options);
            return c.view;
        }
    }
}

//数据对象依赖
function Depend (){
    this.watchers = [];
}
Depend.prototype = {
    addWatcher:function(watcher){
        this.watchers.push(watcher);
    },
    notify:function(){
        Utils.each(this.watchers,function(watcher){
            watcher.update();
        })
    }
}
//观察者
function Watcher(scope,data,name,callback){
    this.vm = scope;
    this.data = data;
    this.hasPrefix = false;
    if(name.toString().indexOf('.')>-1){
       this.hasPrefix = true;
    }
    this.name = name;
    this.callback = callback;
    this.value = this.get();
}
Watcher.prototype = {
    update:function(){
        var value = this.hasPrefix?this.vm.get(this.name):this.data[this.name];
        var oldVal = this.value;
        if(value!=oldVal){
            this.value = value;
            this.callback.call(this.vm,value,oldVal);
        }
    },
    get:function(){
        Depend.watcher = this;
        var value = this.hasPrefix?this.vm.get(this.name):this.data[this.name];
        Depend.watcher = null;
        return value;
    }
}

module.exports = Controller;