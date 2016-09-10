var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require("gulp-util");
var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var webpackConfig = require("./webpack.config.js");
var stream = require('webpack-stream');
var sass = require('gulp-sass');
var lr = require('gulp-livereload');

gulp.task('webpack', [], function() {
	 return gulp.src(path.ALL) 
 .pipe(sourcemaps.init()) 
 .pipe(stream(webpackConfig)) 
 .pipe(uglify())
 .pipe(sourcemaps.write())
 .pipe(gulp.dest(path.DEST_BUILD));
 });

gulp.task("webpack-dev-server", function(callback) {
	var myConfig = Object.create(webpackConfig);
		myConfig.devtool = "eval";
		myConfig.debug = true;
	new WebpackDevServer(webpack(myConfig), {
	 publicPath: "/" + myConfig.output.publicPath,
	 stats: {
	 colors: true
	 }
	}).listen(8080, "localhost", function(err) {
	if (err) throw new gutil.PluginError("webpack-dev-server", err);
	gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
	});
	});

var path = {
    HTML: '/index.html',
    ALL: ['src/**/*.jsx', 'src/**/*.js'],
    MINIFIED_OUT: 'build.min.js',
    DEST_SRC: 'dist/src',
    DEST_BUILD: 'dist/build',
    DEST: 'dist'
};


gulp.task('watch', function() {
	gulp.watch(path.ALL, ['webpack'])

});

gulp.task('sass', function () {
  return gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist/css'))
    .pipe(lr());
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task('dev-build', ['webpack-dev-server', 'watch', 'sass:watch']);
