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
    srcJsHint = [].concat(srcJs),
    karma = ['bower_components/**/*.min.js'].concat(srcJs.concat(['test/*Spec.js', 'test/**/*Spc.js'])),
    readme = 'README.md';

module.exports = {
    srcJs: srcJs,
    srcHtml: srcHtml,
    srcJsHint: srcJsHint,
    karma: karma,
    readme: readme
};