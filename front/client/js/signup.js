var Controller = require('../../common/controller');
var tpl = require('../views/signup.html');

var SignUp = Controller.instance('SignUp',{
    tpl:tpl,
    data:function(){
        return {}
    }
});

module.exports = SignUp;