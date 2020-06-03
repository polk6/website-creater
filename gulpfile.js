var gulp = require('gulp'),
	cleanCss = require('gulp-clean-css'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	fileInclude = require('gulp-file-include'),
	less = require('gulp-less'),
	lessAutoprefix = require('less-plugin-autoprefix'),
	sourcemaps = require('gulp-sourcemaps'),
	connect = require('gulp-connect'),
	plumber = require('gulp-plumber'),
	del = require('del');

var _directoryName = 'dev'; // 创建的目标文件夹；dev：开发；dist：生产
/**
 * 显示刷新信息
 */
var _showRefreshMsg = function() {
	let lastRefreshTime = Date.now();
	let refreshCount = 0;
	function rs() {
		let dt = Date.now();
		if (dt - lastRefreshTime > 1000) {
			lastRefreshTime = dt;
			refreshCount++;
			console.log(`浏览器第${refreshCount}次刷新完毕!`);
		}
	}
	return rs;
};

/**
 * task-less
 * @private
 */
function _less(cb) {
	// 1)copy vendor
	gulp.src('src/less/vendor/**').pipe(gulp.dest(_directoryName + '/css/vendor'));

	// 2)less
	let autoprefix = new lessAutoprefix({ browsers: [ 'last 2 versions' ] });

	if (_directoryName == 'dev') {
		gulp
			.src('src/less/*.less')
			.pipe(plumber())
			.pipe(
				less({
					plugins: [ autoprefix ]
				})
			)
			.pipe(sourcemaps.init())
			.pipe(concat('main.min.css'))
			.pipe(sourcemaps.write())
			.pipe(gulp.dest(_directoryName + '/css'))
			.pipe(connect.reload());
	} else {
		gulp
			.src('src/less/*.less')
			.pipe(plumber())
			.pipe(
				less({
					plugins: [ autoprefix ]
				})
			)
			.pipe(cleanCss())
			.pipe(concat('main.min.css'))
			.pipe(gulp.dest(_directoryName + '/css'));
	}
	cb();
}

/**
 * task-js
 * @private
 */
function _js(cb) {
	// 1)copy vendor
	gulp.src('src/js/vendor/**').pipe(plumber()).pipe(gulp.dest(_directoryName + '/js/vendor'));

	// 2)uglify
	if (_directoryName == 'dev') {
		gulp
			.src([ 'src/js/app.js', 'src/js/*.js' ])
			.pipe(plumber())
			.pipe(sourcemaps.init())
			.pipe(uglify())
			.pipe(concat('main.min.js'))
			.pipe(sourcemaps.write())
			.pipe(gulp.dest(_directoryName + '/js'))
			.pipe(connect.reload());
	} else {
		gulp.src([ 'src/js/app.js', 'src/js/*.js' ]).pipe(plumber()).pipe(uglify()).pipe(concat('main.min.js')).pipe(gulp.dest(_directoryName + '/js'));
	}
	cb();
}

/**
 * task-img
 * @private
 */
function _img(cb) {
	if (_directoryName == 'dev') {
		gulp.src('src/img/**').pipe(gulp.dest(_directoryName + '/img')).pipe(connect.reload());
	} else {
		gulp.src('src/img/**').pipe(gulp.dest(_directoryName + '/img'));
	}
	cb();
}

/**
 * task-page
 * @description 不需要layout的页面，如：用户协议
 * @private
 */
function _page(cb) {
	if (_directoryName == 'dev') {
		gulp.src('src/page/**').pipe(plumber()).pipe(gulp.dest(_directoryName + '/page')).pipe(connect.reload());
	} else {
		gulp.src('src/page/**').pipe(gulp.dest(_directoryName + '/page'));
	}
	cb();
}

/**
 * task-html
 * @private
 */
function _html(cb) {
	if (_directoryName == 'dev') {
		gulp
			.src([ 'src/*.html' ])
			.pipe(plumber())
			.pipe(
				fileInclude({
					prefix: '@@',
					basepath: 'src/layout'
				})
			)
			.pipe(gulp.dest(_directoryName))
			.pipe(connect.reload());
	} else {
		gulp
			.src([ 'src/*.html' ])
			.pipe(plumber())
			.pipe(
				fileInclude({
					prefix: '@@',
					basepath: 'src/layout'
				})
			)
			.pipe(gulp.dest(_directoryName));
	}
	cb();
}

/**
 * task-clean
 * @private
 */
async function _clean(cb) {
	await del([ _directoryName ]);
	cb();
}

/**
 * task-server
 * @private
 */
function _server(cb) {
	// 启动liveReload服务
	connect.server({
		name: 'website-creater',
		root: [ 'dev' ],
		port: 8083,
		livereload: true
	});

	// 输出刷新消息
	let showMsg = _showRefreshMsg();
	const watcher = gulp.watch([ 'dev/**' ]);
	watcher.on('all', function(path, stats) {
		showMsg();
	});
	cb();
}

/**
 * dev
 * @private
 */
function _dev(cb) {
	_directoryName = 'dev';
	// watch file change
	gulp.watch('src/less/*.less', { ignoreInitial: false }, _less);
	gulp.watch([ 'src/js/app.js', 'src/js/*.js' ], { ignoreInitial: false }, _js);
	gulp.watch('src/img/**', { ignoreInitial: false }, _img);
	gulp.watch('src/page/**', { ignoreInitial: false }, _page);
	gulp.watch([ 'src/*.html', 'src/layout/*.html' ], { ignoreInitial: false }, _html);
	cb();
}

/**
 * build
 * @private
 */
function _build(cb) {
	_directoryName = 'dist';
	cb();
}

exports.default = gulp.series(_clean, _dev, _server);
exports.build = gulp.series(_clean, _build, gulp.parallel(_less, _js, _img, _page, _html));
