//dot用法
var dotUsage = require('./dotUsage').initialize();
//页面
//var home = require('../client/js/home').initialize();
//组件
//var btngroup = require('../component/button_group').initialize();




var obj = dotUsage;
document.getElementById('container').innerHTML = obj.view?obj.view:obj;