var Controller = require('../common/controller');
var Router = require('../common/router');
var Home = require('./js/home');

var router = new Router();
router.route('home',Home);
router.initialize();
var app = new Controller({
    ele:'container',
    data:function(){
        return {
            title:'首页'
        }
    },
    router:router
})