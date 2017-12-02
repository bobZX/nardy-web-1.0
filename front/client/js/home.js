var Controller = require('../../common/controller');
var tpl = require('../views/home.html');
var btn_group = require('../../component/button_group.html');
var text= require('../../component/text.html');

var Home = Controller.instance('home',{
    data:function(){
        return {
            type:'page',
            user:{
               name:'test',
                age:'29'
            },
            btns:[{
                name:'bnt1',
                type:'delete'
            },{
               name:'btn2',
                type:'add'
            }],
            text:'我是文本框'
        }
    },
    tpl:tpl,
    components:{
        'btn_group':btn_group,
        'text':text
    },
    watch:{
        'type':function(value,oldVal,name){
            console.log('rerender type view');
            this.rerender(name);
        },
        'user':function(v,ov,name){
            console.log('rerender user view');
            this.rerender(name);
        },
        'btns':function(v,ov,n){
            console.log('rerender btns view');
            this.rerender(n);
        }
    },
    methods:{
        sayWords:function(e){
            e = window.event || e;
            this.sayHello();
        },
        sayHello:function(){
            console.log('set type');
            // var btns = this.get('btns');
            // btns.forEach(function(o,i){
            //     o.name = 'newbtn'+i;
            // })
            this.set('user.name','bobzhao')
        }
    }
})

module.exports = Home;