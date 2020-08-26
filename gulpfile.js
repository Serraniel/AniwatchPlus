const gulp = require('gulp');
const cssnano = require('cssnano')
const gulpLoadPlugins = require('gulp-load-plugins')
const uglify = require('gulp-uglify-es').default;
const del = require('del');

const $ = gulpLoadPlugins()

$.sass.compiler = require('sass');

/* ============================================================================
Base consts
============================================================================ */

// Project sources
const src = {
    root: 'src',
    styles: 'src/stylesheets',
    scripts: 'src/javascript',
    images: 'src/images',
}

// Build path
const tmp = {
    root: '.tmp',
    styles: '.tmp/stylesheets',
    scripts: '.tmp/javascript',
    images: '.tmp/images',
    vendor: '.tmp/libs',
    maps: '../sourcemaps',
}

// Dist path
const dist = {
    root: 'dist',
    styles: 'dist/stylesheets',
    scripts: 'dist/javascript',
    images: 'dist/images',
    vendor: 'dist/libs',
    maps: 'dist/sourcemaps',
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
        .pipe($.if(isDev, $.sourcemaps.write(tmp.maps)))
        .pipe(gulp.dest(tmp.styles))
})

gulp.task('scripts', () => {
    return gulp.src(`${src.scripts}/**/*.js`)
        .pipe($.plumber())
        .pipe($.if(isDev, $.sourcemaps.init()))
        .pipe($.babel())
        .pipe($.rename({ suffix: '.min' }))
        .pipe($.if('*.js', uglify({ compress: { drop_console: isProd, drop_debugger: isProd } })))
        .pipe($.size({
            showFiles: true,
        }))
        .pipe($.if(isDev, $.sourcemaps.write(tmp.maps)))
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
        .pipe($.size({ title: 'images' }))
        .pipe(gulp.dest(tmp.images))
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

gulp.task('build', gulp.series('clean:build', 'images', 'scripts', 'styles'));

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

    // sourcemaps
    gulp.src(`${tmp.root}/**/*.map`)
        .pipe(gulp.dest(dist.root))

    done();
})

gulp.task('dist', gulp.series('clean', 'build', 'dist:copy'));