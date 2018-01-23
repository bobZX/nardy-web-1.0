var Controller = require('../../common/controller');
var Utils = require('../../common/utils');
var tpl = require('../views/infoU.html');

/**
 * 页面-个人资料
 * @type {any}
 */
var infoUser = Controller.instance('infoU',{
    tpl:tpl,
    data:function(){
        return {

        }
    },
    components:{
    },
    watch:{
    },
    methods:{
    },
    mounted:function(){

    }
})

module.exports = infoUser;