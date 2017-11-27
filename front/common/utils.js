/**
 * Created by zhaoxb on 2017/4/18.
 * utils:工具类
 */
 /**==========================================================**/
var Utils = (function(){
     function isType(obj,type){
         return Object.prototype.toString.call(obj) === "[object " + type + "]";
     }
    return {
        Class:function (){
            var len = arguments.length;
            var P = arguments[0];
            var F = arguments[len-1];

            var C = typeof F.initialize == "function" ?
                F.initialize :
                function(){ P.prototype.initialize.apply(this, arguments); };

            if (len > 1) {
                var newArgs = [C, P].concat(
                    Array.prototype.slice.call(arguments).slice(1, len-1), F);
                this.inherit.apply(null, newArgs);
            } else {
                C.prototype = F;
            }
            return C;
        },
        inherit:function(C,P){
            var F = function() {};
            F.prototype = P.prototype;
            C.prototype = new F();
            C.prototype.constructor = C;
            var i, l, o;
            for(i=2, l=arguments.length; i<l; i++) {
                o = arguments[i];
                if(typeof o === "function") {
                    o = o.prototype;
                }
                this.extend(C.prototype, o);
            }
        },
        extend:function(destination,source){
            destination = destination || {};
            if (source) {
                for (var property in source) {
                    var value = source[property];
                    if (value !== undefined) {
                        destination[property] = value;
                    }
                }

                var sourceIsEvt = typeof window.Event == "function"
                    && source instanceof window.Event;

                if (!sourceIsEvt
                    && source.hasOwnProperty && source.hasOwnProperty("toString")) {
                    destination.toString = source.toString;
                }
            }
            return destination;
        },
        isObject:function(obj){
            return isType(obj,"Object");
        },
        isArray:function(obj){
            return Array.isArray(obj) || isType(obj,"Array");
        },
        isString:function(obj){
            return isType(obj,"String");
        },
        isFunction:function(obj){
            return isType(obj,"Function");
        }
    }
})()

module.exports = Utils;


