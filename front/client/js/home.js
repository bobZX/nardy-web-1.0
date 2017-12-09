var Controller = require('../../common/controller');
var tpl = require('../views/home.html');
var button_group = require('../../component/button_group');

var Home = Controller.instance('home',{
    data:function(){
        return {
            type:'page',
            user:{
               name:'test',
                age:'29'
            },
            text:'我是文本框',
        }
    },
    tpl:tpl,
    components:{
        'button_group':button_group,
        'cpn':['button_group','button_group']
    },
    compile:{
        show:false
    },
    watch:{
        'type':function(value,oldVal,name){
            console.log('rerender type view');
            this.rerender(name);
        },
        'user':function(v,ov,name){
            console.log('rerender user view');
            this.rerender(name);
        }
    },
    methods:{
        callSay:function(e){
            CSet['button_group'].set('somewords','let us go!');
        }
    }
})

module.exports = Home;