var gulp          = require('gulp');
var browserSync   = require('browser-sync').create();
var sass          = require('gulp-sass');
var sassUnicode   = require('gulp-sass-unicode');
var autoprefixer  = require('gulp-autoprefixer');
var gulpif        = require('gulp-if');
var util          = require('gulp-util');
var imagemin      = require('gulp-imagemin');
var notify        = require('gulp-notify');


var production    = util.env.production;


var handleError = function(task) {
  return function(err) {    
    notify.onError({
      message: task + ' failed. Please check the logs.',
    })(err);

    console.log(err.toString());

    this.emit('end');
  };
};


gulp.task('serve', ['sass'], function() {

  browserSync.init({
    server: "./dist"
  });

  gulp.watch("app/svg/**/*.svg", ['svg']);
  gulp.watch("app/images/**/*", ['images']);
  gulp.watch("app/scss/**/*.scss", ['sass']);
  gulp.watch("app/index.html", ['index']);
});


gulp.task('sass', function() {
  return gulp.src("app/scss/*.scss")
    .pipe(sass({
      sourceComments: !production,
      outputStyle: production ? 'compressed' : 'nested'
    }))
    .on('error', handleError('SASS'))
    .pipe(sassUnicode())
    .pipe(gulpif(production, autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    })))
    .pipe(gulp.dest("dist/css"))
    .pipe(browserSync.stream());
});


gulp.task('images', function() {
  return gulp.src('app/images/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'))
    .pipe(browserSync.stream());
});


gulp.task('svg', function() {
  return gulp.src('app/svg/**/*.svg')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/svg'))
    .pipe(browserSync.stream());
})


gulp.task('index', function() {
  return gulp.src("app/index.html")
    .pipe(gulp.dest("dist"))
    .pipe(browserSync.stream());
})


gulp.task('watch', ['build', 'serve']);
gulp.task('build', ['sass', 'index', 'images', 'svg']);
