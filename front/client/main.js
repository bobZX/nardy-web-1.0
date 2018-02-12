var Controller = require('../common/controller');
var menu = require('../components/menu/menu');
var ucenter = require('../components/ucenter/ucenter');
var router = require('./router');

var c = new Controller({
    ele:'container',
    data:function(){
        return {
        }
    },
    router:router,
    components:{
        menu:menu,
        ucenter:ucenter
    }
});