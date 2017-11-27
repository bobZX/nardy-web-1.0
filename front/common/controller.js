var Utils = require('./utils')
var dot = require('./doT');

var cObjs = window.CObjects = (function(){
    return {
        add:function(cObj,id){
            if(this.hasOwnProperty(id))
                delete this[id];
            this[id] = cObj;
            return 'CObjects.'+id;
        }
    }
})()

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
    for(var d in data){
        this[d] = data[d];
    }
    if(options.methods){
        var id = options.ele || options._id;
        var scope = cObjs.add(this,id);
        for(var m in options.methods){
            this[m] = options.methods[m];
            data[m] = scope+'.'+ m +'(event)';
        }
    }
    var tpl;
    if(!options.components){
        tpl = dot.template(innerHTML);
    }else{
        tpl = dot.template(innerHTML,null,options.components);
    }
    var html = tpl(data);
    if(options.ele){
        document.getElementById(options.ele).innerHTML = html;
    }
    this.view = html;
    if(options.router){
        options.router.$ele = document.getElementsByTagName('router-view')[0];
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

module.exports = Controller;