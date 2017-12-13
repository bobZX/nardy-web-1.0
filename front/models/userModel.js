var Model = require('../common/model');
var Utils = require('../common/utils');

var userModel = Utils.Class(Model,{

    options:{
        url:''
    },

    initialize:function(options){
        Model.call(this,options);
        this.options = Utils.extend(this.options,options);
    }

})