"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var rename = require("gulp-rename");
var svgstore = require("gulp-svgstore");
var svgmin = require("gulp-svgmin");
var path = require("path");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var cheerio = require('gulp-cheerio');

gulp.task("style", function() {
    gulp.src("sass/style.scss")
        .pipe(plumber())
        .pipe(sass())
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(gulp.dest("css"))
        .pipe(server.stream());
});

gulp.task("serve", ["style"], function() {
    server.init({
        server: ".",
        notify: false,
        open: true,
        cors: true,
        ui: false
    });

    gulp.watch("sass/**/*.{scss,sass}", ["style"]);
    gulp.watch("*.html").on("change", server.reload);
});

gulp.task("sprite", function() {
    return gulp.src("img/svg/*.svg")
    .pipe(cheerio({
        run: function ($) {
            $('[fill]').removeAttr('fill');
        },
        parserOptions: { xmlMode: true }
    }))
    /*.pipe(svgmin(/*function (file) {
        var prefix = path.basename(file.relative, path.extname(file.relative));
        return {
            plugins: [{
                cleanupIDs: {
                    prefix: prefix + "i-",
                    minify: true
                }
            }]
        }
    }))*/
    .pipe(svgstore({
        inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("img/svg"));
});

gulp.task("html", function() {
    return gulp.src("*.html")
    .pipe(posthtml([
        include()
    ]))
    .pipe(gulp.dest("."));
});
