const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const less = require('gulp-less');
const browserSync = require('browser-sync').create();
const exec = require('child_process').exec;

const src = `${__dirname}/src/front/assets`;
const dest = `${__dirname}/public`;

gulp.task('browser-sync', () => {
	browserSync.init({
		startPath: '/',
		open: false,
		proxy: 'localhost:8080'
	});
});

gulp.task('start-server', (cb) => {
	exec('DEBUG=dTorrent:* node ./index.js', (err, stdout, stderr) => {
		if(err) {
			throw new Error(err);
		}
		console.log(stdout);
		console.log(stderr);
		cb(err);
	});
});

gulp.task('npm:fonts', () => {
	return gulp.src([
		`${__dirname}/node_modules/font-awesome/fonts/*`
	])
		.pipe(gulp.dest(`${dest}/fonts`));
});

gulp.task('npm:css', () => {
	return gulp.src([
			`${__dirname}/node_modules/bootstrap/dist/css/*.min.css`,
			`${__dirname}/node_modules/angular-ui-bootstrap/dist/*.css`,
			`${__dirname}/node_modules/font-awesome/css/*.min.css`,
			`${__dirname}/node_modules/font-awesome-animation/dist/*.min.css`,
		])
		.pipe(concat('script.min.css'))
		.pipe(gulp.dest(`${dest}/css`));
});

gulp.task('npm:js', () => {
	return gulp.src([
			`${__dirname}/node_modules/angular/*.min.js`,
			`${__dirname}/node_modules/jquery/dist/*.min.js`,
			`${__dirname}/node_modules/angular-ui-bootstrap/dist/*.js`,
			`${__dirname}/node_modules/bootstrap-notify/*.min.js`,
			`${__dirname}/node_modules/lodash/lodash.js`,
		])
		.pipe(concat('script.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest(`${dest}/js`));
});

gulp.task('app:css', () => {
	return gulp.src([
		`${src}/css/*.less`,
		`!${src}/css/_*.less`
	])
		.pipe(less())
		.pipe(concat('main.css'))
		.pipe(gulp.dest(`${dest}/css`))
		.pipe(browserSync.stream());
});

gulp.task('app:js', () => {
	return gulp.src(`${src}/js/**/*.js`)
		.pipe(concat('app.min.js'))
		.pipe(gulp.dest(`${dest}/js`))
		.pipe(browserSync.stream());
});

gulp.task('app:templates', () => {
	return gulp.src([
			`${src}/templates/**/*.html`
		])
		.pipe(gulp.dest(`${dest}/templates`));
});

gulp.task('watch', () => {
	gulp.watch([`${src}/js/**/*.js`], ['app:js']);
	gulp.watch([`${src}/css/*.less`], ['app:css']);
	gulp.watch([`${src}/templates/**/*.html`], ['app:templates']);
	gulp.watch([`${__dirname}/src/**/*.html`]).on('change', browserSync.reload);
	gulp.watch([`${__dirname}/src/**/*.twig`]).on('change', browserSync.reload);
});

gulp.task('dev', ['npm:fonts', 'npm:css', 'npm:js', 'app:js', 'app:css', 'app:templates', 'watch', 'browser-sync']);

gulp.task('prod', ['npm:fonts', 'npm:css', 'npm:js', 'app:js', 'app:css', 'app:templates']);