var Controller = require('../common/controller');
var tpl = require('./button_group.html');
var text = require('./text');

var button_group = Controller.component('button_group',{
    data:function(){
      return {
          btns:[{
              name:'bnt1',
              type:'delete'
          },{
              name:'btn2',
              type:'add'
          }]
      }
    },
    props:['somewords'],
    tpl:tpl,
    watch:{
        somewords:function(v,ov){
            //this.rerender();
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
            console.log('set btns');
            var btns = this.get('btns');
            btns.forEach(function(o,i){
                o.name = 'newbtn'+i;
            })
        }
    }
})

module.exports = button_group