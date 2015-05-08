var srcJs = [
        'src/*.js',
        'src/*/*.js',
        'src/*/service/*.js',
        'src/*/controller/*.js',
        'src/*/filter/*.js',
        'src/*/directive/*.js'
    ],
    srcJsHint = [].concat(srcJs),
    karma = srcJs.concat(['test/*Spec.js', 'test/**/*Spc.js']),
    readme = 'README.md';

module.exports = {
    srcJs: srcJs,
    srcJsHint: srcJsHint,
    karma: karma,
    readme: readme
};