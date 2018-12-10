const path = require('path');
const gulp = require('gulp');
const appfy = require('gulp-appfy-tasks');
const del = require('del');

const isProduction = process.env && process.env.NODE_ENV === 'production';

appfy.init(__dirname, {
    'sourcePath': 'src',
    'destPath': './build',
    'assetsTemplate': 'assets/[hash].[ext]',
    'entryCSS': 'css/index.css',
    'entryJS': 'index.js',
    'entryHTML': 'index.html',
    'customWatch': false,
    'browsersync': {
        'port': 3000,
        'notify': false,
        'server': { 'baseDir': './build' }
    },
    'notify': {
        'onError': false,
        'onUpdated': false
    },
    'browserify': {
        watchify: {
            'delay': 100,
            'ignoreWatch': [
                '**/node_modules/**'
            ],
            'poll': false
        },
        sourcemap: true,
        uglify: isProduction,
        options: {
            paths: [path.join(__dirname, 'src')]
        }
    },
    'postcss': {
        'sourcemap': true,
        'plugins': null,
        'options': {}
    }
});

appfy.defineTasks();

// override the "clean" task
gulp.task('clean', cb => {
    del([
        path.join(__dirname, '..', 'build', 'js', 'tabi.js'),
        path.join(__dirname, '..', 'build', 'js', 'tabi.js.map')
    ]);

    cb();
});
