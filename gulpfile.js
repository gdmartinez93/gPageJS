// Defining base pathes
var basePaths = {
    bower: './bower_components/',
    nodemodules: './node_modules/',
    dev: './src/',
    distCss: './css/',
    vendorCss: './css/vendors/',
    distJs: './js/',
    vendorJs: './js/vendors/'
};

// Define utilities
var fs = require('fs');
var forEach = require('lodash.foreach');
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var sourcemaps = require('gulp-sourcemaps');
var cssnano = require('gulp-cssnano');
var cleanCSS = require('gulp-clean-css');

// Define vendors
var vendors = [
    {
        name: 'gridlex',
        css: {
            path: '/docs/gridlex.min.css'
        },
        provider: 'node_modules'
    },
    {
        name: 'css-hamburgers',
        css: {
            dev: true,
            src: '/_sass/hamburgers/**/**',
            file: 'hamburgers',
            extension: '.scss',
            srcMainFile: '/_sass/hamburgers/',
        },
        provider: 'bower_components'
    },
    {
        name: 'fontawesome',
        css: {
            path: '/css/font-awesome.min.css'
        },
        provider: 'bower_components'
    },
    {
        name: 'animate.css',
        css: {
            path: '/animate.min.css'
        },
        provider: 'bower_components'
    },
    {
        name: 'jquery',
        js: {
            path: '/dist/jquery.min.js'
        },
        provider: 'bower_components'
    },
    {
        name: 'materialize',
        js: {
            path: '/dist/js/materialize.min.js'
        },
        css: {
            dev: true,
            src: '/sass/**/**',
            file: 'materialize',
            extension: '.scss',
            srcMainFile: '/sass/'
        },
        provider: 'bower_components'
    },
    {
        name: 'Swiper',
        js: {
            path: '/dist/js/swiper.min.js'
        },
        css: {
            path: '/dist/css/swiper.min.css'
        },
        provider: 'bower_components'
    },
    {
        name: 'lodash',
        js: {
            path: 'lodash.min.js'
        },
        provider: 'node_modules'
    },
    {
        name: 'vivus',
        js: {
            path: '/dist/vivus.min.js'
        },
        provider: 'bower_components'
    },
    {
        name: 'venobox',
        css: {
            path: '/venobox.css'
        },
        js: {
            path: 'venobox.min.js'
        },
        provider: 'bower_components'
    },
    {
        name: 'hint',
        css: {
            path: '/hint.min.css'
        },
        provider: 'bower_components'
    },
    {
        name: 'html5shiv',
        js: {
            path: '/dist/html5shiv.min.js'
        },
        provider: 'bower_components'
    },
    {
        name: 'respond',
        js: {
            path: '/dest/respond.min.js'
        },
        provider: 'bower_components'
    },
    {
        name: 'wowjs',
        js: {
            path: '/wow.min.js'
        },
        provider: 'node_modules'
    }
];
    // Extract files production and packages dev
    gulp.task('copy-vendors-files', function() {
        forEach(vendors, function( item, index ) {
            var pathBase = '';

            if( item.provider == 'bower_components' ){
                pathBase = basePaths.bower;
            }
            else{
                pathBase = basePaths.nodemodules;
            }

            if( typeof item.js != 'undefined' ){
                gulp.src( pathBase + item.name + '/' + item.js.path )
                    .pipe( rename(index + '_' + item.name + '.min.js') )
                    .pipe( uglify() )
                    .pipe( gulp.dest(basePaths.vendorJs) );
            }

            if( typeof item.css != 'undefined' ){
                var cssoptions = item.css;

                if( typeof cssoptions.dev != 'undefined' ){
                    (function( basePaths, item, cssoptions ){
                        fs.stat(basePaths.dev + 'css/packages/' + item.name + '/' + cssoptions.file + cssoptions.extension, function( err, stat ) {
                            if( err != null ) {
                                if( item.provider == 'bower_components' ){
                                    pathBase = basePaths.bower;
                                }
                                else{
                                    pathBase = basePaths.nodemodules;
                                }

                                gulp.src(pathBase + item.name + item.css.srcMainFile + item.css.file + item.css.extension)
                                    .pipe(gulp.dest(basePaths.dev + 'css/packages/' + item.name));

                                gulp.src(pathBase + item.name + item.css.src)
                                    .pipe(gulp.dest(basePaths.dev + 'css/packages/' + item.name));
                            }
                        });
                    }( basePaths, item, cssoptions ) );
                }
                else{
                    gulp.src( pathBase + item.name + '/' + item.css.path )
                        .pipe( cleanCSS() )
                        .pipe( gulp.dest(basePaths.vendorCss) );
                }
            }
        });
    });

// PostCSS
var postcss = require('gulp-postcss');
var sass = require('gulp-sass');
var cssnext = require('cssnext');
var scss = require('postcss-scss');
var precss = require('precss');
var autoprefixer = require('autoprefixer');
var partialImport = require('postcss-partial-import')({ /* options */ });
var inlineComment = require('postcss-inline-comment');

gulp.task('css', function () {
    var processors = [
        partialImport,
        cssnext,
        autoprefixer({ browsers: ['last 8 versions'] }),
        inlineComment,
        precss
    ];

    gulp.src( basePaths.dev + 'css/*.scss' )
        .pipe( sourcemaps.init() )
        .pipe( sass().on('error', sass.logError) )
        .pipe( postcss(processors, {syntax: scss}) )
        .pipe( rename('theme.min.css') )
        .pipe( cssnano() )
        .pipe( sourcemaps.write('.') )
        .pipe( gulp.dest(basePaths.distCss) );
});
    // Create file with all vendors css
    gulp.task('create-vendors-cssfile', function(){
        return gulp.src( basePaths.vendorCss + '*.*' )
            .pipe( concat('bundle_vendors.css') )
            .pipe( gulp.dest(basePaths.vendorCss) )
            .pipe( sourcemaps.init() )
            .pipe( rename('vendors.min.css') )
            .pipe( sourcemaps.write('.') )
            .pipe( gulp.dest(basePaths.distCss) );
    });

// ES6 with Browserify with transform Babelify
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var modernizr = require('gulp-modernizr');

gulp.task('scripts', function() {
    return browserify({entries: basePaths.dev + 'js/theme.js', extensions: ['.js'], debug: true})
        .transform( babelify )
        .bundle()
        .pipe( source('bundle.js') )
        .pipe( buffer() )
        .pipe( sourcemaps.init({loadMaps: true}) )
        //.pipe( uglify() )
        .pipe( rename('theme.min.js') )
        .pipe( sourcemaps.write('./') )
        .pipe( gulp.dest(basePaths.distJs) );
});
    // Create file with all vendors css
    gulp.task('create-vendors-jsfile', function(){
        return gulp.src( [basePaths.vendorJs + '*.js', basePaths.vendorJs + '*.min.js'] )
            .pipe( sourcemaps.init() )
            .pipe( concat('bundle_vendors.js') )
            .pipe( gulp.dest(basePaths.vendorJs) )
            .pipe( rename('vendors.min.js') )
            .pipe( sourcemaps.write('./') )
            .pipe( gulp.dest(basePaths.distJs) );
    });
    // Build custom Modernizr
    gulp.task('build-modernizr', function(){
        return gulp.src( basePaths.dev + 'js/*.js' )
            .pipe( modernizr({
                "options" : [
                    "setClasses",
                    "addTest",
                    "html5printshiv",
                    "testProp",
                    "fnBind"
                ],
                "tests" : [
                    "csscalc",
                    "flexbox",
                    "flexboxlegacy",
                    "flexboxtweener",
                    "flexwrap",
                    "objectfit"
                ]
             }) )
            .pipe( rename('modernizr-custom.min.js') )
            .pipe( uglify() )
            .pipe( gulp.dest(basePaths.distJs) );
    });

// Default task
gulp.task('default', [
    'copy-vendors-files',
    'css',
    'scripts'
]);
gulp.task('build-vendors', [
    'build-modernizr',
    'create-vendors-jsfile',
    'create-vendors-cssfile',
]);

// Watch task
gulp.task('watch', ['default'], function () {
    gulp.watch( basePaths.dev + 'css/**/*.scss', ['css']);
    gulp.watch( basePaths.dev + 'js/**/**/*.js', ['scripts']);
});
