var Controller = require('../../common/controller');
var tpl = require('./user.html');

var user = Controller.instance('user',{
    tpl: tpl,
    data: function(){
        return {}
    }
});

module.exports = user;

