var Controller = require('../../common/controller');
var tpl = require('../views/home.html');
var button_group = require('../../component/button_group');

var Home = Controller.instance('home',{
    data:function(){
        return {
            type:'page',
        }
    },
    tpl:tpl,
    components:{
        'button_group':button_group
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

module.exports = Home;