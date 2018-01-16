/**
 * 说明：数据模型基类
 * 用途：
 * 1、数据校验
 * 2、别名转换
 * 3、持久化数据/缓存
 * 4、动态配置，请求地址、请求方式http/websocket/activeX/wechat等
 * 5、数据映射、数据预处理
 * 6、数据模拟
 */
var Utils = require('./utils');
var axios = require(axios);

var mid = 0;  //模型id
//默认选项
var defaultOptions = {
    url:'',
    baseURL:'http://127.0.0.1:10055',
}

var BaseModel = function(options){
    this._mid = mid++;
    if(options)this.options = Utils.extend({},defaultOptions,options);
    //模型分页信息
    this.page = {
        start:0,
        size:10,
        currentPage:0,
        total:0
    }
}


BaseModel.prototype.request = function(method,options,config){

}

/**
 * 保存模型属性对象
 * @param model 属性对象
 * @param callback 回调
 */
BaseModel.prototype.save = function(model,callback){
    axios.post(this.options.url,model).then(function(res){
        if(callback)callback.call(this,res.data);
    }).catch(function(err){
        console.log('error happened in saving model'+err);
    });
}

/**
 * 修改模型属性对象
 * @param model 属性对象
 * @param callback 回调
 */
BaseModel.prototype.modify = function(model,callback){
    axios.put(this.options.url,model).then(function(res){
        if(callback)callback.call(this,res.data);
    }).catch(function(err){
        console.log('error happened in modifying model:'+err);
    })
}

/**
 * 通过ID删除模型属性对象
 * @param id
 * @param callback 回调
 */
BaseModel.prototype.deleteById = function(id,callback){
    var url = this.options.url+'/'+id;
    axios.delete(url).then(function(res){
        if(callback)callback.call(this,res.data);
    }).catch(function(err){
        console.log('error happened in devaring model:'+err);
    });
}

/**
 * 通过ID查询模型属性对象
 * @param id
 * @param callback 回调
 */
BaseModel.prototype.selectById = function(id,callback){
    var url = this.options.url+'/'+id;
    var self = this;
    axios.get(url).then(function(res){
        if(callback)callback.call(this,res.data);
    }).catch(function(err){
        console.log('error happened in selectting model by id:'+err)
    });
}

/**
 * 通过参数查询模型属性对象
 * @param params 参数
 * @param callback 回调
 */
BaseModel.prototype.selectByParam = function(params,callback){
    var url = this.options.url + '/selectByParam';
    var config = {}
    if(Utils.isObject(params))config.params = params;
    axios.get(url,config).then(function(res){
        if(callback)callback.call(this,res.data);
    }).catch(function(err){
        console.log('error happened in selectting model by param'+err);
    });
}

/**
 * 按页查询(多态) selectByPage(type[,pager[,params]],callback)
 * @param type 页改变类型1:上页，2:跳转，3:下页
 * @param pager 可选，跳转页码
 * @param params 可选，查询参数
 * @param callback 回调函数
 */
BaseModel.prototype.selectByPage = function(type){
    var length = arguments.length;
    var page = this.page;
    var totalPage = Math.ceil(page.total/page.limit);
    if(type == 'PRE'){//上页
        page.currentPage = 0>=--page.currentPage?1:page.currentPage;
    }else if(type == 'PAGER'){//跳转
        var pager = arguments[1];
        page.currentPage = pager&&pager>0?pager:page.currentPage;
    }else if(type == 'NEXT'){//下页
        page.currentPage = totalPage<++page.currentPage?totalPage:page.currentPage;
    }else if(type == 'FIRST'){//首页
        page.currentPage = 1;
    }else{//末页
        page.currentPag = totalPage;
    }
    var params = arguments[length-2];
    params = Utils.extend({},params);
    params.start = (page.currentPage-1)*page.limit;
    params.size = page.limit;
    var callback = arguments[length-1];
    if(typeof callback == 'function'){
        this.selectByParam(params,function(res){
            callback.call(this,res);
        });
    }
}

/**
 * POST请求(多态) post(url[,params[,config]],sucFn,errorFn)
 * @param url 请求地址
 * @param params 可选，请求参数
 * @param config 可选，其他设置
 * @param sucFn 成功后回调
 * @param errorFn 失败后回调
 */
BaseModel.prototype.post = function(url){
    var len = arguments.length;
    var params = Utils.isObject(arguments[1])?arguments[1]:{};
    var config = Utils.isObject(arguments[2])?arguments[2]:{};
    var sucFn = arguments[len-2];
    var errorFn = arguments[len-1];
    axios.post(url,params,config).then(sucFn).catch(errorFn);
}

/**
 * PUT请求 put(url[,params[,config]],sucFn,errorFn)
 * @param url 请求地址
 * @param params 可选，请求参数
 * @param config 可选，其他设置
 * @param sucFn 成功后回调
 * @param errorFn 失败后回调
 */
BaseModel.prototype.put = function(url){
    var len = arguments.length;
    var params = Utils.isObject(arguments[1])?arguments[1]:{};
    var config = Utils.isObject(arguments[2])?arguments[2]:{};
    var sucFn = arguments[len-2];
    var errorFn = arguments[len-1];
    axios.put(url,params,config).then(sucFn).catch(errorFn);
}

/**
 * DEvarE请求 devare(url[,params[,config]],sucFn,errorFn)
 * @param url 请求地址
 * @param params 可选，请求参数
 * @param config 可选，其他设置
 * @param sucFn 成功后回调
 * @param errorFn 失败后回调
 */
BaseModel.prototype.delete = function(url){
    var len = arguments.length;
    var params = Utils.isObject(arguments[1])?arguments[1]:{};
    var config = Utils.isObject(arguments[2])?arguments[2]:{};
    var sucFn = arguments[len-2];
    var errorFn = arguments[len-1];
    config.data = params;
    axios.delete(url,config).then(sucFn).catch(errorFn);
}

/**
 * GET请求 get(url[,params[,config]],sucFn,errorFn)
 * @param url 请求地址
 * @param params 可选，请求参数
 * @param config 可选，其他设置
 * @param sucFn 成功后回调
 * @param errorFn 失败后回调
 */
BaseModel.prototype.get = function(url){
    var len = arguments.length;
    var params = Utils.isObject(arguments[1])?arguments[1]:{};
    var config = Utils.isObject(arguments[2])?arguments[2]:{};
    var sucFn = arguments[len-2];
    var errorFn = arguments[len-1];
    config.params = params;
    axios.get(url,config).then(sucFn).catch(errorFn);
}