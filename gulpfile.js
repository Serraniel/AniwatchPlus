const gulp = require('gulp');
const cssnano = require('cssnano')
const gulpLoadPlugins = require('gulp-load-plugins')
const uglify = require('gulp-uglify-es').default;
const del = require('del');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
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
    vendor: '.tmp/libs',
}

// Dist path
const dist = {
    root: 'dist',
    manifests: 'dist/manifests',
    styles: 'dist/stylesheets',
    scripts: 'dist/javascript',
    images: 'dist/images',
    vendor: 'dist/libs',
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
        //.pipe(uglify({ compress: { drop_console: isProd, drop_debugger: isProd } }))
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
        .pipe($.replace('$developer', template.developer))
        .pipe($.replace('$homepageURL', template.homepage_url))
        .pipe($.size({
            showFiles: true,
        }))
        .pipe(gulp.dest(tmp.manifests))
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

gulp.task('build', gulp.series('clean:build', 'manifests', 'images', 'scripts', 'styles'));

/* ============================================================================
DIST CLEAN ALL
============================================================================ */

gulp.task('dist:copy', (done) => {
    // copy vendor
    gulp.src(`${tmp.vendor}/**/*`)
        .pipe(gulp.dest(dist.vendor))

    // copy images
    gulp.src(`${tmp.images}/**/*`)
        .pipe(gulp.dest(dist.images))

    // copy scripts
    gulp.src(`${tmp.scripts}/**/*.{min.js,min.js.gz}`)
        .pipe(gulp.dest(dist.scripts))

    // copy styles
    gulp.src(`${tmp.styles}/*.{min.css,min.css.gz}`)
        .pipe(gulp.dest(dist.styles))

    done();
})

gulp.task('dist', gulp.series('clean', 'build', 'dist:copy'));