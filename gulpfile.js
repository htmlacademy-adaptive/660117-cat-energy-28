import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import libsquoosh from 'gulp-libsquoosh';
import svgstore from 'gulp-svgstore';
import rename from 'gulp-rename';
import { deleteAsync } from "del";

// Styles

export const styles = () => {
  return gulp.src('source/sass/style.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

//Copy

const copy = (done) => {
  gulp
    .src(
      ["source/fonts/**/*.{woff,woff2}", "source/*.ico", "source/*.webmanifest","source/img/svg/*.svg", "source/js/*.js"],
      {
        base: "source",
      }
    )
    .pipe(gulp.dest("build"));
  done();
};


//Html

export const html = () => {
  return gulp.src('source/*.html')
  .pipe(gulp.dest('build'))
}

//Images

const optimizeImg = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
  .pipe(libsquoosh())
  .pipe(gulp.dest('build/img'));
}

const webp = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
  .pipe(libsquoosh({webp: {} }))
  .pipe(gulp.dest('build/img'));
}

//Svg

const sprite = () => {
  return gulp.src('source/img/svg/inline-svg/*.svg')
  .pipe(
    svgstore({
    inlineSvg: true,
  })
  )
  .pipe(rename('sprite.svg'))
  .pipe(gulp.dest('build/img'));
}

//Clean

const clean = () => {
  return deleteAsync("build");
}

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Watcher

const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/*.html').on('change', browser.reload);
  gulp.watch('source/*.html', gulp.series(html));
}

//Start

export const start = gulp.series(
  clean,
  copy,
  optimizeImg,
  gulp.parallel(styles,html,sprite,webp),
  gulp.series(server,watcher)
);


export default gulp.series(
  styles, server, watcher
);
