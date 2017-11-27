var Utils = require('./utils.js');

 function getRouteParams(){
 	var hashDeatail = location.hash.split("?"),
    hashName = hashDeatail[0].split("#")[1],//路由地址
    params = hashDeatail[1] ? hashDeatail[1].split("&") : [],//参数内容
    query = {};
	for(var i = 0;i<params.length ; i++){
	    var item = params[i].split("=");
	    query[item[0]] = item[1]
	}        
	return     {
	    path:hashName,
	    query:query
	}
 }

 var Router = function(ele){
 	 this.routes = {};
	 this.$ele = null;
	 if(ele)
 		this.$ele = document.getElementById(ele);
 }

 Router.prototype.route = function(path,handler){
 	path = path.replace(/\s*/g,'');
 	this.routes[path] = handler;
 }

 Router.prototype.handle = function(params){ 	
 	if(this.routes.hasOwnProperty(params.path)){
 		var handler = this.routes[params.path];
		if(!this.$ele)return;
 		if(Utils.isObject(handler)){
			if(handler.hasOwnProperty('initialize')){
				this.$ele.innerHTML = '<div>'+handler.initialize(params.query)+'</div>';
			}
 		}else if(Utils.isFunction(handler)){
			this.$ele.innerHTML = '<div>'+handler.call(params.query)+'</div>';
 		}else{
			this.$ele.innerHTML = '<div>'+handler+'</div>';
 		}
 	}else{
 		location.hash = '';
 	}
}

Router.prototype.initialize = function(callback){
	var self = this;
    //页面加载匹配路由
    window.addEventListener('load',function(){
    	var params = getRouteParams();
        self.handle(params);
        if(callback)
        	callback.call(this,params.path);
    })
    //路由切换
    window.addEventListener('hashchange',function(){
    	var params = getRouteParams();
        self.handle(params);
        if(callback)
        	callback.call(this,params.path);
    })
}

module.exports = Router;