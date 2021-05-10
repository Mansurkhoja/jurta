/*
 * Gulp Simple © 2020,
 * version: "1.0.0",
 * l: "ISC"
 * mansur.atm@gmail.com,
 */
'use strict';
//Places
const srcFolder = 'src'; //all source, libs etc.
const buildFolder = 'build'; //get from source and build.
//Paths
const path = {
	//src all paths
	srcPath: {
		html: srcFolder + '/*.html',
		htmlComponents: srcFolder + '/html/*.html',
		scss: srcFolder + '/scss/style.scss',
		cssLibs: srcFolder + '/scss/libs/*.css',
		scssComponents: srcFolder + '/scss/*.scss',
		js: srcFolder + '/js/*.js',
		jsLibs: srcFolder + '/js/libs/*.js',
		img: srcFolder + '/img/*.{png,PNG,jpg,JPG,jpeg,JPEG,gif,GIF,webp,WEBP}',
		imgMin: srcFolder + '/img/imgmin/',
		icons: srcFolder + '/img/icons/**/*.{svg,ico}',
		fonts: srcFolder + '/fonts/**/*',
		favicon: srcFolder + '/favicon/**/*'
	},
	//build all paths
	buildPath: {
		html: buildFolder + '/',
		css: buildFolder + '/css/',
		js: buildFolder + '/js/',
		img: buildFolder + '/img/',
		icons: buildFolder + '/img/icons/',
		fonts: buildFolder + '/fonts/',
		favicon: buildFolder + '/favicon/'
	}
};
//Add gulp and all plugins
const { src, dest, parallel, series, watch } = require('gulp'), // Gulp
	fileInclude = require('gulp-file-include'), //include files
	sass = require('gulp-sass'), //sass,scss
	cleancss = require('gulp-clean-css'), //minify css
	rename = require('gulp-rename'), //rename like .min
	sourcemaps = require('gulp-sourcemaps'), //sourcemaps for css, js
	notify = require('gulp-notify'), // notify errors
	uglify = require('gulp-uglify-es').default, //minify js
	babel = require('gulp-babel'), //babel ES6 to ES5
	plumber = require('gulp-plumber'), // notify errors
	browserSync = require('browser-sync').create(), // browser auto-load
	autoprefixer = require('gulp-autoprefixer'), // vendor autoprefix
	imagemin = require('gulp-imagemin'), //imagemin
	webp = require('gulp-webp'), //convert to webp
	svgSprite = require('gulp-svg-sprite'), //svg sprites
	pngSprite = require('gulp.spritesmith'), //png sprites
	newer = require('gulp-newer'), //watch new images
	woff = require('gulp-ttf2woff'), //ttf2woff
	woff2 = require('gulp-ttf2woff2'), //ttf2woff2
	eot = require('gulp-ttf2eot'), //ttf2eot
	del = require('del'); //delete

//FUNCTIONS
//FUNCTIONS FOR BUILD
//HTML FUNCTION
function html() {
	return src(path.srcPath.html)
		.pipe(fileInclude())
		.pipe(dest(path.buildPath.html))
		.pipe(browserSync.stream());
}
//SCSS FUNCTION
function scss() {
	return (
		src(path.srcPath.scss)
			.pipe(sourcemaps.init())
			.pipe(
				sass({
					outputStyle: 'expanded'
				})
			)
			.on(
				'error',
				notify.onError({
					title: 'SCSS',
					message: 'Error: <%= error.message %>'
				})
			)
			.pipe(
				autoprefixer({
					overrideBrowserslist: ['last 15 versions'],
					grid: true,
					cascade: true
				})
			)
			.pipe(dest(path.buildPath.css))
			.pipe(cleancss())
			.pipe(
				rename({
					suffix: '.min'
				})
			)
			//.pipe(sourcemaps.write())
			.pipe(
				sourcemaps.write('.', {
					includeContent: false,
					sourceRoot: '../src'
				})
			)
			.pipe(dest(path.buildPath.css))
			.pipe(browserSync.stream())
	);
}

function csslibs() {
	return src(path.srcPath.cssLibs).pipe(dest(path.buildPath.css));
}
//JS FUNCTIONS
function js() {
	return src(path.srcPath.js)
		.pipe(
			plumber({
				errorHandler: notify.onError({
					title: 'JS',
					message: 'Error: <%= error.message %>'
				})
			})
		)
		.pipe(
			babel({
				presets: ['@babel/preset-env']
			})
		)
		.pipe(dest(path.buildPath.js))
		.pipe(sourcemaps.init())
		.pipe(uglify()) // минификация JS
		.pipe(
			rename({
				suffix: '.min' // переименовываем сжатый файл
			})
		)
		.pipe(
			sourcemaps.write('.', { includeContent: false, sourceRoot: '../src' })
		) // запись sourcemap'ов
		.pipe(dest(path.buildPath.js))
		.pipe(browserSync.stream());
}
// ADD ALL LIBS IN ONE
function jslibs() {
	return src(path.srcPath.jsLibs).pipe(dest(path.buildPath.js));
}
//IMAGE FUNCTIONS
// IMG
function img() {
	src([srcFolder + '/img/*.{svg,SVG}']).pipe(dest(path.buildPath.img));
	return src([srcFolder + '/img/imgmin/**/*']).pipe(dest(path.buildPath.img));
}

function imgMin() {
	src(path.srcPath.img).pipe(webp()).pipe(dest(path.srcPath.imgMin));
	return src(path.srcPath.img)
		.pipe(newer(path.srcPath.imgMin))
		.pipe(
			imagemin(
				[
					imagemin.gifsicle({ interlaced: true }),
					imagemin.mozjpeg({ quality: 69, progressive: true }),
					imagemin.optipng({ optimizationLevel: 5 })
				],
				{ verbose: true }
			)
		)
		.pipe(dest(path.srcPath.imgMin));
}
// SPRITE PNG
function spritePng() {
	return src([srcFolder + '/img/icons/*.{png,PNG}'])
		.pipe(
			pngSprite({
				imgName: 'sprite.png',
				cssName: 'sprite.css'
			})
		)
		.pipe(dest(path.buildPath.icons));
}
// SPRITE SVG
function spriteSvg() {
	return src(path.srcPath.icons)
		.pipe(
			svgSprite({
				mode: {
					stack: {
						sprite: '../sprite.svg'
					}
				}
			})
		)
		.pipe(dest(path.buildPath.icons));
}
//favicon
function favicon() {
	return src(path.srcPath.favicon).pipe(dest(path.buildPath.favicon));
}
//FONTS FUNCTIONS
// fonts from src to build
function fonts() {
	return src(path.srcPath.fonts).pipe(dest(path.buildPath.fonts));
}
// ttf to eot and woff
function ttf2WoffAndEot() {
	src(path.srcPath.fonts)
		.pipe(woff())
		.pipe(dest([srcFolder + '/fonts']));
	src(path.srcPath.fonts)
		.pipe(eot())
		.pipe(dest([srcFolder + '/fonts']));
	return src(path.srcPath.fonts)
		.pipe(woff2())
		.pipe(dest([srcFolder + '/fonts']));
}
function video() {
	return src([srcFolder + '/video/**/*']).pipe(dest([buildFolder + '/video']));
}
//BROWSER-SYNC FUNCTION
function browserReload() {
	browserSync.init({
		server: {
			baseDir: buildFolder
		},
		port: 3000
	});
}
//REMOVE FUNCTION
function remove() {
	return del([buildFolder + '/*']);
}
//WATCHER FUNCTION
function watcher() {
	// watch([path.srcPath.htmlComponents], html)
	watch([path.srcPath.html], html);
	watch([path.srcPath.scss], scss);
	watch([path.srcPath.scssComponents], scss);
	watch([path.srcPath.js], js);
	watch([path.srcPath.img], img);
	watch([path.srcPath.icons], spriteSvg);
	watch([srcFolder + '/img/icons/*.{png,PNG}'], spritePng);
}
//COMPOSE TASKS

//for src
//if need minify and webp
// gulp imgMin
//if need fonts ttf2WoffAndEot
// gulp ttf2WoffAndEot

//for build
//if need favicon
// gulp favicon
let build = series(
	remove,
	parallel(
		html,
		scss,
		csslibs,
		js,
		video,
		jslibs,
		img,
		spritePng,
		spriteSvg,
		fonts
	)
);
let make = parallel(build, watcher, browserReload);
//ALL EXPORTS
exports.html = html;
exports.scss = scss;
exports.js = js;
exports.jslibs = jslibs;
exports.csslibs = csslibs;
exports.img = img;
exports.imgMin = imgMin;
exports.spritePng = spritePng;
exports.spriteSvg = spriteSvg;
exports.fonts = fonts;
exports.favicon = favicon;
exports.fontsSrc = ttf2WoffAndEot;
exports.remove = remove;
exports.build = build;
exports.make = make;
exports.default = make;
exports.video = video;
