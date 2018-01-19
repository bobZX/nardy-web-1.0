var Controller = require('../../common/controller');
var tpl = require('../views/app.html');

var app = Controller.instance('app',{
    data:function(){
        return {
            type:'page',
        }
    },
    tpl:tpl,
    components:{
    },
    watch:{
        'type':function(value,oldVal){
            this.rerender("footer");
        }
    },
    methods:{
        change:function(e){
            this.set("type","type");
        }
    },
    mounted:function(){
        console.log('done!');
    }
})

module.exports = app;