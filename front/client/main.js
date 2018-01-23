var Controller = require('../common/controller');
var Router = require('../common/router');
var menu = require('../component/menu');
var ucenter = require('../component/ucenter');
var app = require('./js/app');
var infoC =  require('./js/infoC');
var infoU = require('./js/infoU');
var security = require('./js/security');
var user = require('./js/user');
var add = require('./js/add');

var router = new Router();
router.route({path:'app',component:app});
router.route({path:'infoc',component:infoC});
router.route({path:'infou',component:infoU});
router.route({path:'security',component:security});
router.route({path:'user',component:user,children:[{path:'user/add',component:add}]});
router.initialize();
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