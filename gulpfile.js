/**
 gulp and webpack
 created by bobZX
*/

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    less = require('gulp-less')
    cssmin = require('gulp-minify-css');
    webpack = require('webpack'),
    webpackConfig = require('./webpack.config.js');


var webpackConfig = Object.create(webpackConfig);
var devCompiler = webpack(webpackConfig);	
gulp.task('build', function (callback) {
  devCompiler.run(function(err, stats) {
     callback();
  });
});
//将图片拷贝到目标目录
gulp.task('copy:images', function (done) {
    gulp.src(['./front/images/*']).pipe(gulp.dest('./front/dist/images')).on('end', done);
});
//将字体图标拷贝到目标目录
gulp.task('copy:fonts', function (done) {
    gulp.src(['./front/asset/fonts/*']).pipe(gulp.dest('./front/dist/fonts')).on('end', done);
});
//将字体图标拷贝到目标目录
gulp.task('copy:libs', function (done) {
    gulp.src(['./front/asset/libs/*']).pipe(gulp.dest('./front/dist/libs')).on('end', done);
});

gulp.task('css',function(callback){
	gulp.src(['.front/asset/css/*.css'])
        .pipe(concat('style.min.css'))
        .pipe(cssmin())
        .pipe(gulp.dest('./front/dist/'))
        .on('end', callback);
});

gulp.task('less', function (callback) {
    gulp.src(['.front/asset/css/*.less'])
        .pipe(less())
        .pipe(concat('less.min.css'))
        .pipe(cssmin())
        .pipe(gulp.dest('.front/dist/'))
        .on('end', callback);
});

gulp.task('watch', function (callback) {
    gulp.watch(['./front/**/**/*','./front/**/*'], ['build','css','less'])
        .on('end', callback);
});

gulp.task('default',['build','css','less','copy:images','copy:fonts','copy:libs']);
//开发
gulp.task('dev', ['build', 'css','less','copy:images','copy:fonts','copy:libs','watch']);