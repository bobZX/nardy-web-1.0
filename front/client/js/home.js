var Controller = require('../../common/controller');
var tpl = require('../views/home.html');
var button_group = require('../../component/button_group');

var Home = Controller.instance('home',{
    data:function(){
        return {
            a:3,
            type:'page',
            user:{
               name:'test',
                age:'29'
            },
            text:'我是文本框',
            cpn:['button_group','button_group'],
            somewords:'we will be better'
        }
    },
    tpl:tpl,
    components:{
        'button_group':button_group
    },
    compile:{
        show:false
    },
    watch:{
        'type':function(value,oldVal){
            console.log('type watch');
        },
        'user':function(v,ov){
            console.log('user watch');
        }
    },
    methods:{
        callSay:function(e){

        }
    }
})

module.exports = Home;