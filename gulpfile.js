/* eslint-disable no-param-reassign */
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify-es').default;
const imagemin = require('gulp-imagemin');
const del = require('del');
const babel = require('gulp-babel');
const browsersync = require('browser-sync').create();
const strip = require('gulp-strip-comments');

const dirPath = './build/';
const paths = {
  blocks: {
    src: 'assets/scss/blocks/*.scss',
    dest: 'build/css/blocks/',
  },
  pages: {
    src: 'assets/scss/pages/*.scss',
    dest: 'build/css/pages/',
  },
  styles: {
    src: ['assets/scss/*.scss', 'assets/scss/partials/*.scss'],
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
  blockScripts: {
    src: 'assets/js/blocks/*.js',
    dest: 'build/js/blocks/',
  },
  nodeScripts: {
    swiper: './node_modules/swiper/swiper-bundle.min.js',
    select2: './node_modules/select2/dist/js/select2.min.js',
    glightbox: './node_modules/glightbox/dist/js/glightbox.min.js',
  },
  nodeStyles: {
    swiper: './node_modules/swiper/swiper-bundle.min.css',
    select2: './node_modules/select2/dist/css/select2.min.css',
    glightbox: './node_modules/glightbox/dist/css/glightbox.min.css',
  },
};

function initBrowserSync() {
  browsersync.init(
    {
      proxy: 'http://zloty-klucz.localhost/',
    }
  );
}

function reload() {
  browsersync.reload();
}

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
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browsersync.stream());
}

function sassBlocks() {
  return gulp.src([paths.blocks.src])
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
    .pipe(gulp.dest(paths.blocks.dest))
    .pipe(browsersync.stream());
}

function sassPages() {
  return gulp.src([paths.pages.src])
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
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
    .pipe(gulp.dest(paths.pages.dest))
    .pipe(browsersync.stream());
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
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browsersync.stream());
}

function uglifyBlocks() {
  return gulp.src([paths.blockScripts.src])
    .pipe(strip())
    .pipe(
      babel(
        {
          presets: ['@babel/env'],
        }
      )
    )
    .pipe(uglify())
    .pipe(
      rename(
        {
          extname: '.min.js',
        }
      )
    )
    .pipe(gulp.dest(paths.blockScripts.dest))
    .pipe(browsersync.stream());
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
  initBrowserSync();
  gulp.watch(['assets/scss/*.scss', 'assets/scss/partials/*.scss'], sassMain);
  gulp.watch('assets/scss/blocks/*.scss', sassBlocks).on('change', reload);
  gulp.watch('assets/scss/pages/*.scss', sassPages).on('change', reload);
  gulp.watch('assets/js/*.js', uglifyMain);
  gulp.watch('assets/js/blocks/*.js', uglifyBlocks);
  gulp.watch('assets/img/*', minifyImages);
  gulp.watch(['*.php', 'blocks/*/*', 'partials/*.php', 'theme.json']).on('change', reload);
}

function build(cb) {
  clean();
  sassMain();
  sassBlocks();
  sassPages();
  copyNodeScripts();
  copyNodeStyles();
  uglifyMain();
  uglifyBlocks();
  minifyImages();
  copyFonts();
  cb();
}

exports.default = watch;
exports.watch = watch;
exports.build = build;
