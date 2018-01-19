var Utils = require('./utils')
var dot = require('./doT');

//dot标签用于dotT预编译，后被编译为div标签。适用场景是通过dot标签id，指定重新渲染的对象。dot嵌套只支持3级。
var reg_dot= '<dot [^>]*id=[\'|\"]@id[\'|\"][^>]*>(<dot[^>]*>(<dot[^>]*>(<dot[^>]*>.*?</dot>|.)*?</dot>|.)*?</dot>|.)*?</dot>';
var cid = 0,target;

/**
 * 控制对象集合，全局可见，用于视图事件回调
 * @type {{addController}}
 */
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

/**
 * 模版预编译期渲染函数，用于编译子模版
 * @returns {{render: render}}
 */
var dotRender = function(){
    var _tid = 0,_target = target;
    return {
        render:function(tpl,id,data){
            try{
                var r = '';
                if(Utils.isObject(tpl)){
                    var _data;
                    if(data == undefined||!data)data = this;
                    if(tpl._props_.length){
                        _data = Utils.copyPropByNames(data,tpl._props_);
                    }
                    var c = tpl.initialize(_data,id);
                    if(_target){
                        cset[_target].children.push(c._id);
                        c.parent = cset[_target]._id;
                    }
                    r = c.view;
                }else{
                    if(data){
                        var t = dot.template(tpl,null,this);
                        r = t(Utils.extend({},data,this.events));
                    }else{
                        r = tpl;
                    }
                    var n = (!id||id == 'undefined')?'nd_t'+(_tid++):id;
                    r = '<div name="'+n+'">'+ r +'</div>';
                }
                return r;
            }catch(e){
                console.error('#dotRender error#'+e.message);
            }
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
    var data = options.data.call(this),evts = {};
    this._id = options.ele || options._id_;
    this.name = options.name;
    var scope = cset.addController(this,this._id);
    if(options.methods){
        Utils.each(options.methods, function (callback,func) {
            this[func] = callback;
            evts[func] = scope+'.'+ func +'(event)';
        },this);
    }

    this.data = data;
    this.events = evts;
    if(options.props){
        Utils.each(options.props,function(prop){
            if(options._propDatas_&&options._propDatas_.hasOwnProperty(prop)) {
                if (this.data.hasOwnProperty(prop))
                    this.data[prop] = null;
                //TODO propData为引用类型的影响
                this.data[prop] = options._propDatas_[prop];
            }
        },this)
    }
    this._observe(this.data);

    var tpl,view_name = this._id,html='';

    this.components = options.components;
    this.tpl = options.tpl;
    this.children = [];
    target = this._id;
    var preRender = Utils.extend(dotRender(),{components:this.components,events:this.events},this.data);
    tpl = dot.template(this.tpl, null, preRender);
    html = tpl(Utils.extend({},this.data,this.events));
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

    if(options.mounted){
        options.mounted.call(this);
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

/**
 * 监听数据get、set方法
 * @param data
 * @private
 */
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

/**
 * 添加对数据对象的观察（递归使子对象继承父对象观察回调函数）
 * @param data
 * @param name
 * @param callback
 * @private
 */
Controller.prototype._watch = function(data,name,callback){
    var new_data = (new Watcher(this,data,name,callback)).value;
    if(Utils.isObject(new_data)||Utils.isArray(new_data)){
        Utils.each(new_data,function(value,key){
            this._watch(new_data,key,callback);
        },this)
    }
}

/**
 * 销毁实例
 */
Controller.prototype.destory = function(){
    if(this.children.length){
        Utils.each(this.children,function(child){
            cset[child].destory.call(cset[child]);
        })
    }
    this.data = null;
    this.components = null;
    delete cset[this._id];
}

/**
 * 重新渲染整个模版，或根据id渲染指定的dot标签
 * @param id，dot标签id
 */
Controller.prototype.rerender = function(id){
    try{
        for(var i=0;i<this.children.length;i++){
            cset[this.children[i]].destory();
        }
        this.children.length = 0;
        target = this._id;
        var preRender = Utils.extend(dotRender(),{components:this.components,events:this.events},this.data);
        var _tpl = '';
        if(id){
            var _str = reg_dot.replace('@id',id);
            var _reg = new RegExp(_str,"i");
            var r = _reg.exec(this.tpl.toString().replace(/[\r\t\n]/g, " ").replace(/\"/g,"\'"));
            if(r[0])_tpl = r[0];
        }else{
            _tpl = this.tpl;
        }
        var tpl = dot.template(_tpl, null, preRender);
        var html = tpl(Utils.extend({},this.data,this.events));
        if(id){
            var $ele = document.getElementById(id);
            $ele.outerHTML = html;
        }else{
            this.view = html;
            var $eles = document.getElementsByName(this._id);
            for (var i = 0; i < $eles.length; i++) {
                var $ele = $eles[i];
                console.log($ele)
                $ele.innerHTML = html;
            }
        }
    }catch(e){
        console.error(e.message);
    }
}

/**
 * 页面实例
 * @param name
 * @param options
 * @returns {{initialize: initialize, destroy: destroy}}
 */
Controller.instance = function(name,options){
    var _ids = [];
    return {
        initialize:function(data,id){
            var _id;
            if(!id||id=='undefined'){
                _id = options._id_ = 'nd_'+(cid++);
            }else{
                _id = options._id_ = id;
            }
            _ids.push(_id);
            options.name = name;
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

/**
 * 组件实例
 * @param name
 * @param options
 * @returns {{_props_: Array, initialize: initialize}}
 */
Controller.component = function(name,options){
    var _props = [];
    if(options.props){
        _props = Array.prototype.slice.call(options.props);
    }
    return {
        _props_:_props,
        initialize:function(data,id){
            if(!id||id == 'undefined'){
                options._id_ = 'nd_c'+(cid++);
            }else{
                options._id_ = id;
            }
            options._propDatas_ = data;
            options.name = name;
            var c = new Controller(options);
            return c;
        }
    }
}

/**
 * 数据对象依赖
 * @constructor
 */
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
/**
 * 观察者
 * @param scope
 * @param data
 * @param name
 * @param callback
 * @constructor
 */
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

/**
 * 获取子模板对象的属性集合（弃用）
 * @param children
 * @param prop
 * @param result
 * @returns {*}
 */
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