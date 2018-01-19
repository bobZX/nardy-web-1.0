var Controller = require('../common/controller');
var Router = require('../common/router');
var menu = require('../component/menu');
var ucenter = require('../component/ucenter');
var app = require('./js/app');

var router = new Router();
router.route('app',app);
router.initialize();
var app = new Controller({
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