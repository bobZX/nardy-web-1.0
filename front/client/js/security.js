var Controller = require('../../common/controller');
var tpl = require('../views/security.html');

/**
 * 页面-修改密码
 */
var security = Controller.instance('security',{
    tpl: tpl,
    data: function(){
        return {

        }
    },
    props:['step'],
    components:{
    },
    methods: {

    },
    mounted: function(){
    }
});

module.exports = security;