var Utils = require('./utils')
var dot = require('./doT');

var reg_model = /\{\{\s*[!~?=]+?it.([\w$]+)[^\}\s]*\}\}/g;

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

    if(!options.tpl){
        if(!options.ele){
            console.error('tpl or ele prop is null;');
            return;
        }
        options.tpl = document.getElementById(options.ele).innerHTML;
    }

    if(!Utils.isFunction(options.data)){
        console.error('data props is not a function');
        return;
    }
    var data = options.data.call(this);
    if(options.methods){
        var id = options.ele || options._id_;
        var scope = cset.add(this,id);
        Utils.each(options.methods, function (callback,func) {
            this[func] = callback;
            data[func] = scope+'.'+ func +'(event)';
        },this);
    }

    //监听数据模型get、set方法
    this.data = data;
    this._observe(this.data);

    var tpl,view_name;
    this.components = options.components;
    tpl = dot.template(options.tpl,null,this.components);
    var html = tpl(this.data);
    if(options.ele){
        var $ele = document.getElementById(options.ele);
        $ele.setAttribute('name',options.ele);
        $ele.innerHTML = html;
        view_name = options.ele;
    }else{
        html = '<div name="view_tab">'+html+'</div>';
        view_name = "view_tab";
    }
    this.view = html;

    this.model_tpl = {};
    this.addModelTpl(options.tpl,view_name);
    if(options.components){
        Utils.each(options.components,function(tpl,view_name){
            this.addModelTpl(tpl,view_name);
        },this)
    }

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
    //TODO 初始data数据筛选，未watch对象不监听
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
    if(!callback.name)callback.name = name;
    var new_data = (new Watcher(this,data,name,callback)).value;
    if(Utils.isObject(new_data)||Utils.isArray(new_data)){
        Utils.each(new_data,function(value,key){
            this._watch(new_data,key,callback);
        },this)
    }
}

Controller.prototype.addModelTpl = function(tpl,view_name){
    var rs = tpl.toString().match(reg_model);
    if(rs&&rs.length){
        for(var i=0;i<rs.length;i++){
            var reg = new RegExp(reg_model);
            reg.exec(rs[i]);
            var m = RegExp.$1;
            if(!this.model_tpl.hasOwnProperty(m)){
                this.model_tpl[m] = [];
            }
            this.model_tpl[m].push({
                tpl:tpl,
                name:view_name
            })
        }
    }
}

Controller.prototype.rerender = function(model_name){
    if(this.model_tpl.hasOwnProperty(model_name)){
        try {
            var mtpls = this.model_tpl[model_name];
            //TODO mtpls存在嵌套，子节点不需要重复渲染
            for(var k=0;k<mtpls.length;k++){
                var mtpl = mtpls[k];
                var tpl = dot.template(mtpl.tpl, null, this.components);
                var html = tpl(this.data);
                var $eles = document.getElementsByName(mtpl.name);
                for (var i = 0; i < $eles.length; i++) {
                    var $ele = $eles[i];
                    $ele.innerHTML = html;
                }
            }
        }catch(e){
            console.error(e.message);
        }
    }
}

Controller.instance = function(id,options){
    return {
        initialize:function(params){
            options.data.params = params;
            options._id_ = id;
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
            this.callback.call(this.vm,value,oldVal,getTName(this.callback.name));
        }
    },
    get:function(){
        Depend.watcher = this;
        var value = this.hasPrefix?this.vm.get(this.name):this.data[this.name];
        Depend.watcher = null;
        return value;
    }
}

function getTName(name){
    var i = name.indexOf('.')
    if(i>-1){
        name = name.substring(0,i);
    }
    return name;
}

module.exports = Controller;