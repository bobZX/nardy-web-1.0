var Controller = require('../../common/controller');
var tpl = require('./signin.html');

/**
 * 页面-登录
 * @type {any}
 */
var SignIn = Controller.instance('SignIn',{
    tpl:tpl,
    data:function(){
        return {}
    }
});

module.exports = SignIn;