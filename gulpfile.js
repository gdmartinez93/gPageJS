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
var cssmin = require('gulp-cssmin');

gulp.task('css', function () {
    var processors = [
        autoprefixer({ browsers: ['last 8 versions'] }),
        precss
    ];

    return gulp.src( basePaths.dev + 'css/gPages.scss' )
        .pipe( sass().on('error', sass.logError) )
        .pipe( postcss(processors, {syntax: scss}) )
        .pipe(cssmin())
        .pipe( rename({suffix: '.min'}) )
        .pipe( gulp.dest(basePaths.prod + 'css/') );
});

// ES6 with Browserify with transform Babelify
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');

gulp.task('scripts', function() {
    return browserify({entries: basePaths.dev + 'js/gPages.js', extensions: ['.js'], debug: true})
        .transform( babelify )
        .bundle()
        .pipe( source('bundle.js') )
        .pipe( buffer() )
        //.pipe( uglify() )
        .pipe( rename('gPages.min.js') )
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
