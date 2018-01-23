var Controller = require('../../common/controller');
var tpl = require('../views/add.html');

var userAdd = Controller.instance('userAdd',{
    tpl: tpl,
    data: function(){
        return {}
    }
});

module.exports = userAdd;