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
            btng: {

                btns: [{
                    name: 'bnt4',
                    type: 'delete'
                }, {
                    name: 'btn3',
                    type: 'add'
                }]
            },
            btng2: {

            },
            somewords: 'we will be better',
        }
    },
    tpl:tpl,
    components:{
        'button_group':button_group
    },
    watch:{
        'type':function(value,oldVal){
            this.rerender("footer");
        },
        'user':function(v,ov){
            console.log('user watch');
        }
    },
    methods:{
        callSay:function(e){
            this.set("type","type");
        },
        sayWords:function(e){
            e = window.event || e;
            alert('hi everyone');
        }
    }
})

module.exports = Home;