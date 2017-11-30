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
            var options, name, src, copy, copyIsArray, clone;
            var target = arguments[0] || {}, i = 1, length = arguments.length, deep = false;

            // Handle a deep copy situation
            if (this.isBool(target)) {
                deep = target;
                target = arguments[i] || {};
                i++;
            }
            // Handle case when target is a string or something (possible in deep copy)
            if (typeof target !== 'object' && !this.isFunction(target)) {
                target = {};
            }
            // Extend Util itself if only one argument is passed
            if (i === length) {
                target = this;
                i--;
            }
            for (; i < length; i++) {
                // Only deal with non-null/undefined values
                if ((options = arguments[i]) != null) {
                    // Extend the base object
                    for (name in options) {
                        src = target[name];
                        copy = options[name];

                        // Prevent never-ending loop
                        if (target === copy) {
                            continue;
                        }

                        // Recurse if we're merging plain objects or arrays
                        if (deep && copy && (this.isObject(copy) || (copyIsArray = this.isArray(copy)))) {
                            if (copyIsArray) {
                                copyIsArray = false;
                                clone = src && this.isArray(src) ? src : [];

                            } else {
                                clone = src && this.isObject(src) ? src : {};
                            }

                            // Never move original objects, clone them
                            target[name] = this.extend(deep, clone, copy);
                        }
                        // Don't bring in undefined values
                        else if (copy !== undefined) {
                            target[name] = copy;
                        }
                    }
                }
            }
            // Return the modified object
            return target;
        },
        gset:function(data,name,value){
            if (name) {
                var ns = name.split('.');
                while (ns.length > 1 && data.hasOwnProperty(ns[0])) {
                    data = data[ns.shift()];
                }
                name = ns[0];
            } else {
                return data;
            }

            if (typeof value !== 'undefined') {
                data[name] = value;
                return;
            } else {
                return data[name];
            }
        },
        isBool:function(bool){
            return typeof bool === 'boolean';
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
        },
        each:function(iterator, callback, context){
            var i, ret;
            if (!context) {
                context = this;
            }
            // 数组
            if (this.isArray(iterator)) {
                for (i = 0; i < iterator.length; i++) {
                    ret = callback.call(context, iterator[i], i, iterator);
                    // 回调返回 false 退出循环
                    if (ret === false) {
                        break;
                    }
                    // 回调返回 null 从原数组删除当前选项
                    if (ret === null) {
                        iterator.splice(i, 1);
                        i--;
                    }
                }

            } else if (this.isObject(iterator)) {
                var keys = Object.keys(iterator);
                for (i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    ret = callback.call(context, iterator[key], key, iterator);

                    // 回调返回 false 退出循环
                    if (ret === false) {
                        break;
                    }
                    // 回调返回 null 从原对象删除当前选项
                    if (ret === null) {
                        delete iterator[key];
                    }
                }
            }
        }
    }
})()

module.exports = Utils;


