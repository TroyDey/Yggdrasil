var srcJs = [
        'src/templates.js',
        'src/*.js',
        'src/*/*.js',
        'src/*/service/*.js',
        'src/*/controller/*.js',
        'src/*/filter/*.js',
        'src/*/directive/*.js'
    ],
    srcHtml = ['src/*/template/*tmp.html'],
    lib = 'bower_components/**/*.js',
    srcJsHint = [].concat(srcJs),
    karma = ['bower_components/angular/angular.js', 'bower_components/angular-mocks/angular-mocks.js'].concat(srcJs.concat(['test/*spec.js', 'test/**/*spec.js'])),
    readme = 'README.md';

module.exports = {
    srcJs: srcJs,
    srcHtml: srcHtml,
    lib: lib,
    srcJsHint: srcJsHint,
    karma: karma,
    readme: readme
};
