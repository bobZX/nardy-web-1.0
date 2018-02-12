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
	 this.lastHandler = null;
	 this.$ele = null;
	 if(ele)
 		this.$ele = document.getElementById(ele);
 }

 Router.prototype.route = function(options){
 	path = options.path.replace(/\s*/g,'');
 	this.routes[options.path] = {handler:options.component};
	 if(options.children){
		 for(var i=0,len = options.children.length;i<len;i++){
			 var croute = options.children[i];
			 this.routes[croute.path] = {handler:croute.component,parent:options.path};
		 }
	 }
 }

 Router.prototype.handle = function(params){ 	
 	if(this.routes.hasOwnProperty(params.path)){
		var route = this.routes[params.path];
 		var handler = route.handler;
		if(!this.$ele)return;
 		if(Utils.isObject(handler)){
			if(handler.hasOwnProperty('initialize')){
				if(route.parent){
					var pHandler = this.routes[route.parent].handler;
					this.$ele.innerHTML = pHandler.initialize();
					var pid = pHandler._id;
					var $pEle = document.getElementsByName(pid)[0];
					var $cEle = $pEle.getElementsByTagName('router-view')[0];
					$cEle.innerHTML = handler.initialize(params.query);
				}else{
					this.$ele.innerHTML = handler.initialize();
				}
			}
 		}else if(Utils.isFunction(handler)){
			this.$ele.innerHTML = handler.call(params.query);
 		}else{
			this.$ele.innerHTML = handler;
 		}
 		if(this.lastHandler&&this.lastHandler.hasOwnProperty('destory')){
			this.lastHandler.destory();
			this.lastHandler = null;
			this.lastHandler = handler;
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