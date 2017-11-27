var Controller = require('../../common/controller');
var tpl = require('../views/home.html');
var btn_group = require('../../component/button_group.html');

var Home = Controller.vm('home',{
    data:function(){
        return {
            user:{
               name:'test',
                age:'29'
            },
            btns:['按钮1','按钮2','按钮3']
        }
    },
    tpl:tpl,
    components:{
        'btn_group':btn_group
    },
    methods:{
        sayWords:function(e){
            e = window.event || e;
            e.preventDefault()
            this.sayHello();
        },
        sayHello:function(){
            alert(this.user.name);
        }
    }
})

module.exports = Home;