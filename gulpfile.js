// Defining base pathes
var basePaths = {
    dev: './src/',
    prod: './dist/'
};

var gulp = require('gulp');
var rename = require("gulp-rename");

var postcss = require('gulp-postcss');
var sass = require('gulp-sass');
var scss = require('postcss-scss');
var precss = require('precss');
var autoprefixer = require('autoprefixer');
var cssnano = require('gulp-cssnano');

gulp.task('css', function () {
    var processors = [
        autoprefixer({ browsers: ['last 8 versions'] }),
        precss
    ];

    return gulp.src( basePaths.dev + 'css/gPages.scss' )
        .pipe( sass().on('error', sass.logError) )
        .pipe( postcss(processors, {syntax: scss}) )
        .pipe( rename('gPages.min.css') )
        .pipe( cssnano() )
        .pipe( gulp.dest(basePaths.prod + 'css/') );
});

var uglify = require('gulp-uglify');

gulp.task('scripts', function() {
    return gulp.src( basePaths.dev + 'js/gPages.js' )
        .pipe( rename('gPages.min.js') )
        .pipe( uglify() )
        .pipe( gulp.dest(basePaths.prod + 'js/') );
});

// Default task
gulp.task('default', [
    'css',
    'scripts'
]);

// Watch task
gulp.task('watch', ['default'], function () {
    gulp.watch( basePaths.dev + 'css/**/*.scss', ['css']);
    gulp.watch( basePaths.dev + 'js/**/**/*.js', ['scripts']);
});
