import gulp from 'gulp';
import browser from 'browser-sync';
import notify from 'gulp-notify';
import plumber from 'gulp-plumber';

import nunjucksRender from 'gulp-nunjucks-render';
import lorem from 'lorem-ipsum';

import sass from 'gulp-sass';

import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';

// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------
const njkEnvironment = (env) => {
    env.addGlobal('lorem', (count = '10', units = 'sentences', makeSentence = false, sentenceLowerBound = 5, sentenceUpperBound = 15, format = 'html') => {
        const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);
        const str = lorem({
            // More options here: https://www.npmjs.com/package/lorem-ipsum
            count, // Number of words, sentences, or paragraphs to generate.
            units, // Generate 'words', 'sentences', or 'paragraphs'.
            sentenceLowerBound, // Minimum words per sentence.
            sentenceUpperBound, // Maximum words per sentence.
            format, // Plain text or html
        });
        return units === 'words' && makeSentence ? `${capitalize(str)}.` : str;
    });

    env.addGlobal('merge', (defaults, options) => {
        const isObject = item => item && typeof item === 'object' && !Array.isArray(item);

        const mergeDeep = (target, src) => {
            const output = Object.assign({}, target);
            if (isObject(target) && isObject(src)) {
                Object.keys(src)
                    .forEach((key) => {
                        if (isObject(src[key])) {
                            if (!(key in target)) {
                                Object.assign(output, { [key]: src[key] });
                            } else {
                                output[key] = mergeDeep(target[key], src[key]);
                            }
                        } else {
                            if (src[key] !== null) {
                                Object.assign(output, { [key]: src[key] });
                            } else {
                                delete output[key];
                            }
                        }
                    });
            }

            return output;
        };

        return mergeDeep(defaults, options);
    });

    // env.addGlobal('data', JSON.parse(fs.readFileSync('src/njk/helpers/data.json').toString()));

    env.addFilter('slug', str => str && str.replace(/\s/g, '-', str).toLowerCase());

    env.addFilter('debug', str => console.log('[DEBUG_NJK]:', str));

    env.addFilter('interpolate', str => env.renderString(str));

    env.addFilter('unique', str => `${str}-${Math.random() * 0xffffff | 0}`);
};

function errorHandler(...args) {
    notify.onError({
        title: '<%= error.plugin %>',
        message: '\nmessage:<%= error.message %>\nfileName:<%= error.fileName %>',
        // 'error' object contains: name, message, stack ,fileName, plugin, showProperties, showStack properties
        sound: 'Submarine',
    })
        .apply(this, Array.prototype.slice.call(args));
    this.emit('end');
}

const reload = (done) => {
    browser.reload();
    done();
};

// Compile layouts, pages, and partials into flat HTML files
// Then parse using Inky templates
const njk = () => gulp.src('src/njk/*.njk')
    .pipe(plumber(errorHandler))
    .pipe(nunjucksRender({
        path: ['src/njk'],
        envOptions: { autoescape: false },
        manageEnv: njkEnvironment, // docs https://github.com/carlosl/gulp-nunjucks-render#environment
    }))
    .pipe(gulp.dest('build/'));

// Compile Sass into CSS
const scss = () => gulp.src('src/scss/style.scss')
    .pipe(plumber(errorHandler))
    // .pipe(injectString.prepend(`$imgPath: "${renderIMGPath}";`))
    .pipe(sass())
    .pipe(gulp.dest('build/'))
    .pipe(browser.stream());

const js = () => browserify('src/js/script.js')
    .transform('babelify', { presets: ['env'] })
    .bundle()
    .on('error', notify.onError({
        message: '\nmessage:<%= error.message %>\nfileName:<%= error.fileName %>',
        // 'error' object contains: name, message, stack ,fileName, plugin, showProperties, showStack properties
        sound: 'Submarine',
    }))
    .pipe(source('script.js'))
    .pipe(buffer())
    .pipe(gulp.dest('build/'));

// Copy and compress img
const img = () => gulp.src('src/img/**/*')
    .pipe(gulp.dest('build/img/'));

// Start a server with LiveReload to preview the site in
const server = (done) => {
    browser.init({
        server: 'build/',
        port: 3002,
        watchOptions: {
            debounceDelay: 500, // This introduces a small delay when watching for file change events to avoid triggering too many reloads
        },
    });
    done();
};

// Watch for file changes
const watch = () => {
    gulp.watch('src/img/**/*', gulp.series(img, reload));
    gulp.watch('src/njk/**/*', gulp.series(njk, reload));
    gulp.watch('src/js/**/*', gulp.series(js, reload));
    gulp.watch('src/scss/**/*', gulp.series(scss));
};

// Build the "build" folder by running all of the above tasks
gulp.task('build', gulp.parallel(njk, js, scss, img));

gulp.task('default', gulp.series('build', server, watch));
