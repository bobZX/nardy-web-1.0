var Controller = require('../../common/controller');
var tpl = require('../views/signup.html');

/**
 * 页面-注册
 * @type {any}
 */
var SignUp = Controller.instance('SignUp',{
    tpl:tpl,
    data:function(){
        return {}
    }
});

module.exports = SignUp;