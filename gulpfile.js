var gulp = require('gulp');
var shell = require('gulp-shell');
// var rollup = require('gulp-rollup');
var webserver = require('gulp-webserver');

gulp.task('default', shell.task(
	['rollup -c']
));

gulp.task('run', function() {
	gulp.src('./build/')
		.pipe(webserver({
			livereload: false,
			directoryListing: false,
			open: true
		}));
});
