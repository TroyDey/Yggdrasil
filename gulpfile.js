var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    karma = require('gulp-karma'),
    clean = require('gulp-clean'),
    jsHint = require('gulp-jshint'),
    express = require('express'),
    connect = require('connect-livereload'),
    open = require('gulp-open');

var paths = require('./paths.js');

var jsHintrc = './.jshintrc';

var directiveName = 'treeDriective';

var EXPRESS_PORT = 2015;

gulp.task('lint', function () {
    return gulp.src(paths.srcJsHint)
        .pipe(jsHint(jsHintrc))
        .pipe(jsHint.reporter('default'));
});

gulp.task('tests', function () {
    return gulp.src(paths.karma)
        .pipe(karma({configFile: 'karma.conf.js', action: 'run'})
            .on('error', function (err) {
                throw err;
            }));
});

gulp.task('express', function () {
    express()
        .use(connect())
        .use(express.static(__dirname))
        .listen(EXPRESS_PORT);
});

gulp.task('open', function () {
    var options = {
        url: 'http://localhost:' + EXPRESS_PORT + '/index.html'
    };

    gulp.src('index.html')
        .pipe(open('', options));
});

gulp.task('serve', ['express', 'open']);



