var Utils = require('./utils')
var dot = require('./doT');

var reg_model = /\{\{\s*[!~?=]+?it.([\w$]+)[^\}\s]*\}\}/g;
var cid = 0,target;

//控制对象集合，全局可见，用于视图事件回调
var cset = window.CSet = (function(){
    return {
        addController:function(cObj,id){
            if(this.hasOwnProperty(id))
                delete this[id];
            this[id] = cObj;
            return 'CSet.'+id;
        }
    }
})();

var dotRender = function(){
    var _tid = 0,_target = target;
    return {
        render:function(tpl,data,name){
            var r = '';
            if(Utils.isObject(tpl)){
                var _data;
                if(!data)data = this;
                if(tpl._props_.length){
                    _data = Utils.copyPropByNames(data,tpl._props_);
                }
                var c = tpl.initialize(_data);
                if(_target){
                    cset[_target].children.push(c._id);
                    c.parent = cset[_target]._id;
                }
                r = c.view;
            }else{
                if(data){
                    var t = dot.template(tpl,null,this);
                    r = t(data);
                }else{
                    r = tpl;
                }
                var n = name?name+'_t'+(_tid++):'unknown_t'+(_tid++);
                r = '<div name="'+n+'">'+ r +'</div>';
            }
            return r;
        }
    }
}

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
    this._id = options.ele || options._id_;
    if(options.methods){
        var scope = cset.addController(this,this._id);
        Utils.each(options.methods, function (callback,func) {
            this[func] = callback;
            data[func] = scope+'.'+ func +'(event)';
        },this);
    }

    //监听数据模型get、set方法
    this.data = data;
    if(options._propDatas_){
        Utils.each(options._propDatas_,function(propData,name){
            if(this.data.hasOwnProperty(name))
                this.data[name] = null;
            this.data[name] = propData;
        },this)
    }
    this._observe(this.data);

    var tpl,view_name = this._id,html='';

    //this.model_tpl = {}//数据模型依赖模板缓存;
    //this.addModelTpl(options.tpl,view_name);

    this.components = options.components;
    this.tpl = options.tpl;
    this.children = [];
    target = this._id;
    var preRender = Utils.extend(dotRender(),{component:this.components},this.data);
    tpl = dot.template(this.tpl, null, preRender);
    html = tpl(this.data);
    if (options.ele) {
        var $ele = document.getElementById(options.ele);
        $ele.setAttribute('name', options.ele);
        $ele.innerHTML = html;
    } else {
        html = '<div name="'+view_name+'">' + html + '</div>';
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
    var new_data = (new Watcher(this,data,name,callback)).value;
    if(Utils.isObject(new_data)||Utils.isArray(new_data)){
        Utils.each(new_data,function(value,key){
            this._watch(new_data,key,callback);
        },this)
    }
}

/**
 * 数据模板绑定搁置
Controller.prototype.addModelTpl = function(tpl,view_name,models){
    if(!models){
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
                    name:view_name,
                    isComponent:false
                })
            }
        }
    }else{
        for(var i=0;i<models.length;i++){
            var m = models[i];
            if(!this.model_tpl.hasOwnProperty(m)){
                this.model_tpl[m] = [];
            }
            this.model_tpl[m].push({
                name:view_name,
                isComponent:true
            })
        }
    }
}
 **/

//销毁
Controller.prototype.destory = function(){
    if(this.children.length){
        Utils.each(this.children,function(child){
            cset[child].destroy();
        })
    }
    this.data = null;
    this.components = null;
    //this.model_tpl  = null;
    delete cset[this._id];
}

Controller.prototype.rerender = function(){
    try{
        for(var i=0;i<this.children.length;i++){
            cset[this.children[i]].destory();
        }
        this.children.length = 0;
        target = this._id;
        var preRender = Utils.extend(dotRender(),{component:this.components},this.data);
        var tpl = dot.template(this.tpl, null, preRender);
        var html = tpl(this.data);
        this.view = html;
        var $eles = document.getElementsByName(this._id);
        for (var i = 0; i < $eles.length; i++) {
            var $ele = $eles[i];
            console.log($ele)
            $ele.innerHTML = html;
        }
    }catch(e){
        console.error(e.message);
    }
}

Controller.instance = function(id,options){
    var _ids = [];
    return {
        initialize:function(data){
            var _id = options._id_ = id+'_'+(cid++);
            _ids.push(_id);
            var c = new Controller(options);
            if(data)c.data = Utils.extend(c.data,data);
            return c.view;
        },
        destroy:function(){
            for(var i=0;i<_ids.length;i++){
                cset[_ids[i]].destory();
            }
        }
    }
}

Controller.component = function(id,options){
    var _props = [];
    if(options.props){
        _props = Array.prototype.slice.call(options.props);
    }
    return {
        _props_:_props,
        initialize:function(data){
            options._id_ = id+'_c'+(cid++);
            options._propDatas_ = data;
            var c = new Controller(options);
            return c;
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

//获取对象名称头部
function getHeadName(name){
    var i = name.indexOf('.')
    if(i>-1){
        name = name.substring(0,i);
    }
    return name;
}

//获取子模板对象的属性集合
function getChildProp(children,prop,result){
    if(result&&Utils.isObject(children)){
        Utils.each(children,function(child,name){
            if(Utils.isObject(child)&&child.hasOwnProperty(prop)){
                var o;
                if(Utils.isObject(child[prop])){
                    o = child[prop];
                }else{
                    o = new Object();
                    o[name] = child[prop];
                }
                result = Utils.extend(result,o);
            }else{
                return result;
            }
            if(child.hasOwnProperty('components')){
                getChildProp(child['components'],prop,result);
            }
        })
        return result;
    }
}

module.exports = Controller;