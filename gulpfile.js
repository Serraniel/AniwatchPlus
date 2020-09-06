const gulp = require('gulp');
const cssnano = require('cssnano')
const gulpLoadPlugins = require('gulp-load-plugins')
const uglify = require('gulp-uglify-es').default;
const del = require('del');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const merge = require('merge-stream');
const fs = require('fs');

const $ = gulpLoadPlugins()

$.sass.compiler = require('sass');

/* ============================================================================
Base consts
============================================================================ */

// Project sources
const src = {
    root: 'src',
    manifests: 'src/manifests',
    styles: 'src/stylesheets',
    scripts: 'src/javascript',
    images: 'src/images',
}

// Build path
const tmp = {
    root: '.tmp',
    manifests: '.tmp/manifests',
    styles: '.tmp/stylesheets',
    scripts: '.tmp/javascript',
    images: '.tmp/images',
}

// Dist path
const dist = {
    root: 'dist',
    chrome: {
        root: 'dist/chrome',
        styles: 'dist/chrome/stylesheets',
        scripts: 'dist/chrome/javascript',
        images: 'dist/chrome/images',
    },
    firefox: {
        root: 'dist/firefox',
        styles: 'dist/firefox/stylesheets',
        scripts: 'dist/firefox/javascript',
        images: 'dist/firefox/images',
    },
    opera: {
        root: 'dist/opera',
        styles: 'dist/opera/stylesheets',
        scripts: 'dist/opera/javascript',
        images: 'dist/opera/images',
    },
    zip: 'dist/zips',
}

// Build mode
const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd;

/* ============================================================================
Build tasks
============================================================================ */

gulp.task('styles', () => {
    return gulp.src(`${src.styles}/*.scss`)
        .pipe($.plumber())
        // sourcemap initialization
        .pipe($.if(isDev, $.sourcemaps.init()))
        // sass compilation
        .pipe($.sass.sync({
            outputStyle: 'expanded',
            precision: 7,
            includePaths: ['.'],
        }).on('error', $.sass.logError))
        // autoprefix
        .pipe($.autoprefixer())
        // out stream size
        .pipe($.size({
            showFiles: true
        }))
        .pipe(gulp.dest(tmp.styles))
        .pipe($.rename({ suffix: '.min' }))
        // minimize and optimize
        .pipe($.if('*.css', $.postcss([
            cssnano({
                safe: true,
                autoprefixer: false,
                zindex: false,
                reduceIdents: {
                    keyframes: true,
                },
            })
        ])))
        // out stream size
        .pipe($.size({
            showFiles: true
        }))
        // write sourcemaps
        .pipe($.if(isDev, $.sourcemaps.write()))
        .pipe(gulp.dest(tmp.styles))
})

gulp.task('scripts', () => {
    let b = browserify({
        entries: `${src.scripts}/index.js`,
        debug: true
    });

    return b.transform('babelify').bundle()
        .pipe($.plumber())
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe($.if(isDev, $.sourcemaps.init({ loadMaps: true })))
        .pipe(uglify({ compress: { drop_console: isProd, drop_debugger: isProd } }))
        .pipe($.rename({ suffix: '.min' }))
        .pipe($.size({
            showFiles: true,
        }))
        .pipe($.if(isDev, $.sourcemaps.write()))
        .pipe(gulp.dest(`${tmp.scripts}`))
})

gulp.task('images', () => {
    return gulp.src(`${src.images}/**/*`)
        .pipe($.plumber())
        .pipe($.imagemin([
            $.imagemin.gifsicle({ interlaced: true }),
            $.imagemin.mozjpeg({ progressive: true }),
            $.imagemin.optipng(),
            $.imagemin.svgo({ plugins: [{ cleanupIDs: false }] })
        ]))
        .pipe($.size({
            showFiles: true,
        }))
        .pipe(gulp.dest(tmp.images))
})

gulp.task('manifests', () => {
    const templateFile = `${src.manifests}/manifest.template.json`;

    let template = JSON.parse(fs.readFileSync(templateFile))

    return gulp.src(`${src.manifests}/**/!(*.template).json`)
        .pipe($.plumber())
        .pipe($.replace('$name', template.name))
        .pipe($.replace('$shortName', template.short_name))
        .pipe($.replace('$version', template.version))
        .pipe($.replace('$semanticVersion', template.version_name))
        .pipe($.replace('$description', template.description))
        .pipe($.replace('$author', template.author))
        .pipe($.replace('$developer', JSON.stringify(template.developer)))
        .pipe($.replace('$homepageURL', template.homepage_url))
        .pipe($.size({
            showFiles: true,
        }))
        .pipe(gulp.dest(tmp.manifests))
})

/* ============================================================================
Watchers
============================================================================ */

gulp.task('watch', (done) => {
    gulp.watch(`${src.styles}/**/*.scss`, gulp.series('clean:build', 'styles', 'dist:copy', 'dist:zip'))

    gulp.watch(`${src.scripts}/**/*.js`, gulp.series('clean:build', 'scripts', 'dist:copy', 'dist:zip'))

    gulp.watch(`${src.images}/**/*`, gulp.series('clean:build', 'images', 'dist:copy', 'dist:zip'))

    gulp.watch(`${src.manifests}/**/*.*`, gulp.series('clean:build', 'manifests', 'dist:copy', 'dist:zip'))

    done();
})

/* ============================================================================
Clean
============================================================================ */

gulp.task('clean:build', del.bind(null, [tmp.root]))

gulp.task('clean:dist', del.bind(null, [dist.root], { force: true })) // Das Force brauchen wir, da das Assets Verzeichnis außerhalb des Working Directories ist.

gulp.task('clean', gulp.series('clean:build', 'clean:dist'))

/* ============================================================================
BUILD CLEAN ALL
============================================================================ */

gulp.task('build', gulp.series('manifests', 'images', 'scripts', 'styles'));

gulp.task('build:clean', gulp.series('clean:build', 'manifests', 'images', 'scripts', 'styles'));

/* ============================================================================
DIST CLEAN ALL
============================================================================ */

gulp.task('dist:chrome', (done) => {
    return merge(
        // copy images
        gulp.src(`${tmp.images}/**/*`)
        .pipe(gulp.dest(dist.chrome.images)),

        // copy scripts
        gulp.src(`${tmp.scripts}/**/*.{min.js,min.js.gz}`)
        .pipe(gulp.dest(dist.chrome.scripts)),

        // copy styles
        gulp.src(`${tmp.styles}/*.{min.css,min.css.gz}`)
        .pipe(gulp.dest(dist.chrome.styles)),

        gulp.src(`${tmp.manifests}/chrome*`)
        .pipe($.rename('manifest.json'))
        .pipe(gulp.dest(dist.chrome.root))
    );
})

gulp.task('dist:firefox', (done) => {
    return merge(
        // copy images
        gulp.src(`${tmp.images}/**/*`)
        .pipe(gulp.dest(dist.firefox.images)),

        // copy scripts
        gulp.src(`${tmp.scripts}/**/*.{min.js,min.js.gz}`)
        .pipe(gulp.dest(dist.firefox.scripts)),

        // copy styles
        gulp.src(`${tmp.styles}/*.{min.css,min.css.gz}`)
        .pipe(gulp.dest(dist.firefox.styles)),

        gulp.src(`${tmp.manifests}/firefox*`)
        .pipe($.rename('manifest.json'))
        .pipe(gulp.dest(dist.firefox.root))
    );
})

gulp.task('dist:opera', (done) => {
    return merge(
        // copy images
        gulp.src(`${tmp.images}/**/*`)
        .pipe(gulp.dest(dist.opera.images)),

        // copy scripts
        gulp.src(`${tmp.scripts}/**/*.{min.js,min.js.gz}`)
        .pipe(gulp.dest(dist.opera.scripts)),

        // copy styles
        gulp.src(`${tmp.styles}/*.{min.css,min.css.gz}`)
        .pipe(gulp.dest(dist.opera.styles)),

        gulp.src(`${tmp.manifests}/opera*`)
        .pipe($.rename('manifest.json'))
        .pipe(gulp.dest(dist.opera.root))
    );
})

gulp.task('dist:copy', gulp.series('dist:chrome', 'dist:firefox', 'dist:opera'));

gulp.task('dist:zip', (done) => {
    gulp.src(`${dist.chrome.root}/**/*`)
        .pipe($.zip('chrome.zip'))
        .pipe(gulp.dest(dist.root));

    gulp.src(`${dist.firefox.root}/**/*`)
        .pipe($.zip('firefox.zip'))
        .pipe(gulp.dest(dist.root));

    gulp.src(`${dist.opera.root}/**/*`)
        .pipe($.zip('opera.zip'))
        .pipe(gulp.dest(dist.root));

    done();
})

gulp.task('dist', gulp.series('clean', 'build', 'dist:copy', 'dist:zip'));