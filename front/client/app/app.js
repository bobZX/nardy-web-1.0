var Controller = require('../../common/controller');
var Utils = require('../../common/utils');
var tpl = require('./app.html');
var step1 = require('./step/step1.html');
var step2 = require('./step/step2.html');

/**
 * 页面-应用
 * @type {any}
 */
var app = Controller.instance('app',{
    tpl:tpl,
    data:function(){
        return {
            type:'page'
        }
    },
    components:{
    },
    watch:{
        'type': function(value,oldVal){
            this.rerender("footer");
        }
    },
    methods:{
        change: function(e){
            this.set("type","type");
        },
        addApp: function(e){
            e = e || window.e;
            var body = [step1,step2];
            var options = {
                title: '提示',
                type: 'step',
                size: 'small'
            };
            Utils.modal(body,options,function(data,next){
                if(data.stepNum == 1){
                    data.hasVlide = true;
                }
                console.log(data);
                if(data.stepNum == 2){
                    Utils.modal('hide');
                }else{
                    next();
                }
            })
        }
    },
    mounted:function(){
        console.log('done!');
    }
});

module.exports = app;