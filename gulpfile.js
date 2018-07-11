var gulp = require('gulp'),
    inlineCss = require('gulp-inline-css');
 
gulp.task('default', function() {
    return gulp.src('./*.html')
        .pipe(inlineCss())
        .pipe(gulp.dest('build/'));
});

gulp.task('build', () =>
  gulp.src('app.js')
    .pipe(bro())
    .pipe(gulp.dest('dist'))
)

gulp.watch('*.js', ['build'])