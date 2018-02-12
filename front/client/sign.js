var Controller = require('../common/controller');
var Router = require('../common/router');
var SignIn = require('./signin/signin');
var SignUp = require('./signup/signup');

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