var gulp = require('gulp');
var shell = require('gulp-shell');
// var rollup = require('gulp-rollup');

gulp.task('default', shell.task(
	['rollup -c']
));
