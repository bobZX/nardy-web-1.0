var Controller = require('../../common/controller');
var tpl = require('../views/signin.html');

var SignIn = Controller.instance('SignIn',{
    tpl:tpl,
    data:function(){
        return {}
    }
});

module.exports = SignIn;