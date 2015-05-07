var srcJs = [
        'src/**/*.js',
        'src/*.js'
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