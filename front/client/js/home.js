var Controller = require('../../common/controller');
var tpl = require('../views/home.html');
var btn_group = require('../../component/button_group.html');

var Home = Controller.vm('home',{
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
            }]
        }
    },
    tpl:tpl,
    components:{
        'btn_group':btn_group
    },
    watch:{
        'btns':function(value,oldVal){
            console.log(value);
            console.log(oldVal);
        },
    },
    methods:{
        sayWords:function(e){
            e = window.event || e;
            e.preventDefault()
            this.sayHello();
        },
        sayHello:function(){
            console.log('set btns');
            var btns = this.get('btns');
            for(var i=0;i<btns.length;i++){
                btns[i] = {name:'newBtn'+i};
            }
        }
    }
})

module.exports = Home;