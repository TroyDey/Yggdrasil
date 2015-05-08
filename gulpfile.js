var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    karma = require('gulp-karma'),
    clean = require('gulp-clean'),
    jsHint = require('gulp-jshint'),
    express = require('express'),
    connect = require('connect-livereload'),
    open = require('gulp-open'),
    rename = require('gulp-rename'),
    bump = require('gulp-bump'),
    templateCache = require('gulp-angular-templatecache'),
    camelCase = require('camelcase');

var paths = require('./paths.js');
var packageJson = require('./package.json');
var jsHintrc = './.jshintrc';

var directiveName = 'tree-directive';

var EXPRESS_PORT = 2015;

gulp.task('lint', function () {
    return gulp.src(paths.srcJsHint)
        .pipe(jsHint(jsHintrc))
        .pipe(jsHint.reporter('default'));
});

gulp.task('clean', function () {
    return gulp.src(['deployment/*', 'src/templates.js'])
        .pipe(clean());
});

gulp.task('bump', function () {
    return gulp.src('./package.json')
        .pipe(bump())
        .pipe(gulp.dest('./'));
});

gulp.task('build-scripts', function () {
    return gulp.src(paths.srcJs)
        .pipe(concat(directiveName.toLowerCase() + '.' + packageJson.version + '.js'))
        .pipe(gulp.dest('deployment/js'))
        .pipe(rename(directiveName.toLowerCase() + '.' + packageJson.version + '.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('deployment/js'));
});

gulp.task('build-templates', function () {
    return gulp.src('src/*/template/*tmp.html')
        .pipe(templateCache('templates.js', {module: camelCase(directiveName + '-templates')}))
        .pipe(gulp.dest('src'));
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

//Composite tasks
gulp.task('open-site', ['express', 'open']);
gulp.task('build-all', ['build-templates', 'bump', 'build-scripts']);
gulp.task('clean-build', ['clean', 'build-all']);


gulp.task('serve', ['clean-build', 'open-site']);


