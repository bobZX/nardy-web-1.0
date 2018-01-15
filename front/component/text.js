var Controller = require('../common/controller');
var tpl = require('./text.html');

var text = Controller.component('text',{
    data:function () {
        return {
            content:'我是文本框'
        }
    },
    props:['content'],
    tpl:tpl,
    methods:{
        showContent:function(e){
            alert(this.get('content'));
        }
    }
})

module.exports = text;