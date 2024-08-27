var gulp = require('gulp');
var pug = require('gulp-pug');
var sass = require('gulp-sass')(require('sass'));
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var clean = require('gulp-clean');

var data = require('./source/data/data');

var slugFn = (text) => {
  if (!text) {
    return 'slug-unknown';
  }
  return text.toLowerCase().replaceAll(/['"!\(\),]/g, '').replaceAll(/[\s-]+/g, '-');
};

// template
var templateTasks = data.characters.map((character) => {
  var fileName = slugFn(character.name) + '.html';
  var fnName = 'buildTemplate:' + fileName;
  var tmp = {
    [fnName]: () => {
      character.slug = slugFn;
      return gulp.src('./source/templates/chara.pug')
        .pipe(
          pug({
            locals: character,
            basedir: './source/templates'
          })
        )
        .pipe(rename(fileName))
        .pipe(gulp.dest('./dist'));
    }
  };
  return tmp[fnName];
});
exports.template = gulp.series(...templateTasks);

// static
function static() {
  return gulp.src('./source/static/**/*', { encoding: false })
    .pipe(gulp.dest('./dist'));
}
exports.static = static;

// style
function style() {
  return gulp.src('./source/styles/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('app.css'))
    .pipe(gulp.dest('./dist'));
}
exports.style = style;

// watch
function watch() {
  gulp.watch('./source/templates/**/*.pug', gulp.series(...templateTasks));
  gulp.watch('./source/static/**/*', static);
  gulp.watch('./source/styles/**/*.scss', style);
}
exports.watch = watch;

function cleanDist() {
  return gulp.src('./dist', {read: false})
    .pipe(clean());
}
exports.clean = cleanDist;

exports.default = gulp.series(...templateTasks, static, style, watch);