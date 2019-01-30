"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var rename = require("gulp-rename");
var svgstore = require("gulp-svgstore");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var minify = require("gulp-csso");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var run = require("run-sequence");
var del = require("del");
var htmlmin = require("gulp-htmlmin");
var uglifyjs = require("gulp-uglify");
var pump = require("pump");

// Разовые таски, не идущие в билд
gulp.task("images", function() {
    return gulp.src("img/**/*.{png,jpg}")
    .pipe(imagemin([
        imagemin.optipng({optimizationlevel: 3}),
        imagemin.jpegtran({progressive: true})
    ]))
    .pipe(gulp.dest("img"));
});

gulp.task("images-svg", function() {
    return gulp.src("img/svg/*.svg")
    .pipe(imagemin(
        imagemin.svgo()
    ))
    .pipe(gulp.dest("img/svg"));
});

gulp.task("webp", function() {
    return gulp.src("img/**/*.{png,jpg}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("img"));
});

// Регулярно используемые таски идущие в билд и в живой сервер
gulp.task("sprite", function() {
    return gulp.src("img/svg/*.svg")
    .pipe(svgstore({
        inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img/svg"));
});

gulp.task("html", function() {
    return gulp.src("*.html")
    .pipe(posthtml([
        include()
    ]))
    .pipe(gulp.dest("build"))
    .pipe(server.stream());
});

gulp.task("minify-html", function() {
    return gulp.src("build/*.html")
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest("build"));
});

gulp.task("minify-js", function(cb) {
    pump([
        gulp.src("build/js/*.js"),
        uglifyjs(),
        rename("script.min.js"),
        gulp.dest("build/js")
    ]),
    cb
});

gulp.task("copy", function() {
    return gulp.src([
        "fonts/**/*.{woff,woff2}",
        "img/**",
        "js/**"
    ], {
        base: "."
    })
    .pipe(gulp.dest("build"));
});

gulp.task("clean", function() {
    return del("build");
});

gulp.task("style", function() {
    gulp.src("sass/style.scss")
        .pipe(plumber())
        .pipe(sass())
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(gulp.dest("build/css"))
        .pipe(minify())
        .pipe(rename("style.min.css"))
        .pipe(gulp.dest("build/css"))
        .pipe(server.stream());
});

gulp.task("build", function (done) {
    run(
        "clean",
        "copy",
        "style",
        "sprite",
        "html",
        "minify-html",
        "minify-js",
        done
    );
});

gulp.task("serve", function () {
    server.init({
        server: "build/",
        notify: false,
        open: true,
        cors: true,
        ui: false
    });
    gulp.watch("sass/**/*.scss", ["style"]);
    gulp.watch("*.html", ["html"]);
});
