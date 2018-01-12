var home = require('../client/js/home').initialize();
var btngroup = require('../component/button_group').initialize();



var obj = home;
document.getElementById('container').innerHTML = obj.view?obj.view:obj;