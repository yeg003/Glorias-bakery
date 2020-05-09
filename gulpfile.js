const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('gulp-cssnano');
const uglify = require('gulp-uglify');
const rename = require("gulp-rename");
const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache');
const autoprefixer = require('gulp-autoprefixer');



gulp.task("sass", function (done) {
    return gulp
        .src(['./src/sass/**/*.scss'])
        .pipe(sourcemaps.init())
        .pipe(autoprefixer())
        .pipe(sass().on('error', sass.logError))
        .pipe(cssnano())
        .pipe(sourcemaps.write("."))
        .pipe(rename(function (path) {
            if (!path.extname.endsWith('.map')) {
                path.basename += ".min"
            }

        }))
        .pipe(gulp.dest('./dist/css'));

    done();
});



gulp.task("javascript", function(done) {
    return gulp
        .src('./src/js/**/*.js')
        .pipe(uglify())
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest("./dist/js"));

    done();
});


gulp.task("imagemin", function(done) {
    return gulp
        .src("./src/img/**/*.+(png|jpg|gif|svg|jpeg)")
        .pipe(cache(imagemin()))
        .pipe(gulp.dest("./dist/img"))
    done();
});


gulp.task("watch", function () {
    browserSync.init({
        server: {
            baseDir: "./"
        },

        browser: "google chrome"
    });

    gulp
        .watch(["./src/sass/**/*.scss", "**/*.html", "./src/js/**/*.js", "./src/img/**/*.+(png|jpg|gif|svg|jpeg)" ], gulp.series(["sass", "javascript", "imagemin"]))
        .on("change", browserSync.reload);
})

gulp.task("clear-cache", function(done) {
    return cache.clearAll(done);
})

gulp.task("default", gulp.series(["watch"])); 