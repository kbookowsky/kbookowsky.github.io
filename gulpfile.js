/* eslint-disable no-param-reassign */
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify-es').default;
const imagemin = require('gulp-imagemin');
const del = require('del');
const strip = require('gulp-strip-comments');

const dirPath = './build/';
const paths = {
  styles: {
    src: 'assets/scss/**/*.scss',
    dest: 'build/css/',
  },
  vendor: {
    dest: 'build/css/vendor/',
  },
  scripts: {
    src: 'assets/js/*.js',
    dest: 'build/js/',
  },
  vendorScripts: {
    dest: 'build/js/vendor',
  },
  nodeScripts: {
    swiper: './node_modules/swiper/swiper-bundle.min.js',
  },
  nodeStyles: {
    swiper: './node_modules/swiper/swiper-bundle.min.css',
  },
};

function clean() {
  return del.sync(['build/']);
}

function sassMain() {
  return gulp.src(paths.styles.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(
      sass(
        {
          outputStyle: 'compressed',
        }
      )
    )
    .pipe(
      rename(
        (path) => {
          path.extname = '.min.css';
        }
      )
    )
    .pipe(gulp.dest(paths.styles.dest));
}

function uglifyMain() {
  return gulp.src([paths.scripts.src])
    .pipe(strip())
    .pipe(uglify())
    .pipe(
      rename(
        {
          extname: '.min.js',
        }
      )
    )
    .pipe(gulp.dest(paths.scripts.dest));
}

function copyNodeScripts() {
  const scripts = Object.values(paths.nodeScripts);
  return scripts.forEach(
    (script) => {
      gulp.src([script])
        .pipe(gulp.dest(paths.vendorScripts.dest));
    }
  );
}

function copyNodeStyles() {
  const styles = Object.values(paths.nodeStyles);
  return styles.forEach(
    (style) => {
      gulp.src([style])
        .pipe(gulp.dest(paths.vendor.dest));
    }
  );
}

function minifyImages() {
  return gulp.src('assets/img/**/*.+(png|jpg|gif|svg)')
    .pipe(
      imagemin(
        [
          imagemin.gifsicle(
            {
              interlaced: true,
            }
          ),
          imagemin.mozjpeg(
            {
              quality: 75,
              progressive: true,
            }
          ),
          imagemin.optipng(
            {
              optimizationLevel: 2,
            }
          ),
          imagemin.svgo(
            {
              plugins: [{
                removeViewBox: true,
              },
              {
                cleanupIDs: true,
              },
              ],
            }
          ),
        ]
      )
    )
    .pipe(gulp.dest(`${dirPath}/img`));
}

function copyFonts() {
  return gulp.src('assets/fonts/*')
    .pipe(gulp.dest(`${dirPath}/fonts`));
}

function watch() {
  gulp.watch('assets/scss/**/*.scss', sassMain);
  gulp.watch('assets/js/*.js', uglifyMain);
  gulp.watch('assets/img/*', minifyImages);
}

function build(cb) {
  clean();
  sassMain();
  copyNodeScripts();
  copyNodeStyles();
  uglifyMain();
  minifyImages();
  copyFonts();
  cb();
}

exports.default = watch;
exports.watch = watch;
exports.build = build;
