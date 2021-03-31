const gulp = require('gulp')
const { src, dest, series, parallel, watch } = require('gulp')
const imagemin = require('gulp-imagemin')
const concat = require('gulp-concat')
const sourcemaps = require('gulp-sourcemaps')
const terser = require('gulp-terser')
const cssnano = require('cssnano')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')

const htmlPath = 'src/*.html'
const jsonPath = 'src/json/*.json'
const imgPath = 'src/img/*'
const jsPath = 'src/js/*.js'
const cssPath = 'src/css/*.css'

const htmlTask = () => {
  return src(htmlPath).pipe(gulp.dest('dist'))
}

const jsonTask = () => {
  return src(jsonPath).pipe(gulp.dest('dist/json'))
}

const imgTask = () => {
  return src(imgPath).pipe(imagemin()).pipe(gulp.dest('dist/img'))
}

const jsTask = () => {
  return src(jsPath)
    .pipe(sourcemaps.init())
    .pipe(concat('index.js'))
    .pipe(terser())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/js'))
}

const cssTask = () => {
  return src(cssPath)
    .pipe(sourcemaps.init())
    .pipe(concat('style.css'))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('dist/css'))
}

exports.default = parallel(htmlTask, jsonTask, imgTask, jsTask, cssTask)

// const watchTask = () => {
//   watch(
//     [htmlPath, jsPath, cssPath],
//     { interval: 1000 },
//     parallel(htmlTask, jsTask, cssTask)
//   )
// }

// exports.default = series(
//   parallel(htmlTask, imgTask, jsTask, cssTask),
//   watchTask
// )
