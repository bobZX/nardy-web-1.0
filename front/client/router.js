var Router = require('../common/router');

var app = require('./app/app');
var user = require('./user/user');
var add = require('./user/add');

var router = new Router();
router.route({path:'app',component:app});
router.route({path:'user',component:user,children:[{path:'user/add',component:add}]});
router.initialize();

module.exports = router;