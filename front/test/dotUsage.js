var Controller = require('../common/controller');
var tpl = require('./dotUsage.html');
var text = require('../component/text');

var dotUsage = Controller.component('dotUsage',{
    data:function(){
        return {
            name:'dotT',
            show:true,
            count:0,
            arr:['txt1','txt2','txt3']
        }
    },
    tpl:tpl,
    watch:{
        name:function(v,ov){
        }
    },
    components:{
        text:text
    },
    methods:{
        sayWords:function(e){
            e = window.event || e;
            this.sayHello();
        },
        sayHello:function(){
            alert('hi everyone');
        }
    }
})

module.exports = dotUsage