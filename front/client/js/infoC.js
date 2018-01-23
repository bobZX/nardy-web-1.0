var Controller = require('../../common/controller');
var Utils = require('../../common/utils');
var tpl = require('../views/infoC.html');

/**
 * 页面-企业信息
 * @type {any}
 */
var infoCompany = Controller.instance('infoC',{
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

module.exports = infoCompany;