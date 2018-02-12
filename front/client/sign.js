var Controller = require('../common/controller');
var Router = require('../common/router');
var SignIn = require('./js/signin');
var SignUp = require('./js/signup');

var router = new Router();
router.route({path:'in',component:SignIn});
router.route({path:'up',component:SignUp});
router.initialize();
var app = new Controller({
    ele:'container',
    data:function(){
        return {
        }
    },
    router:router
})