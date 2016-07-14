'use strict';

var gulp           = require('gulp'),
    autoprefixer   = require('gulp-autoprefixer'),
    sass           = require('gulp-sass'),
    sourcemaps     = require('gulp-sourcemaps'),
    clean          = require('gulp-clean'),
    cssclean       = require('gulp-clean-css'),
    rename         = require('gulp-rename'),
    postcss        = require('gulp-postcss'),
    assets         = require('postcss-assets'),
    uncss          = require('gulp-uncss'),
    browserSync    = require('browser-sync').create();

var path = {
  build : {
    css       : 'css/'
  },

  src : {
    style           : [
      'scss/twentytwenty.scss',
    ]
  },

  watch : {
    style   : 'scss/**/*.scss'
  },

  clean : [
    'css/*',
  ]
};

gulp.task('serve', ['style:build'], function() {

  browserSync.init({
    server: "./"
  });

  gulp.watch("./scss/*.scss", ['style:build']);
  gulp.watch("./html/*.html").on('change', browserSync.reload);
});

gulp.task('style:build', function(){
  gulp.src(path.src.style)
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers : ['last 9 versions', 'ie 9', '> 1%']
    }))
    .pipe(postcss([assets({
      loadPaths : ['src/images/*']
    })]))
    .pipe(gulp.dest(path.build.css))
    .pipe(browserSync.stream());
});

gulp.task('clean', function () {
  return gulp.src(
    path.clean
    , {
      read: false
    })
    .pipe(clean());
});

gulp.task('build', [
  'style:build'
]);

gulp.task('watch', function(){
  gulp.watch(path.watch.style, { interval: 750 }, ['style:build']);
});

gulp.task('default', ['serve', 'build', 'watch']);
