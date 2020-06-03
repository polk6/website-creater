/**
 * about.html
 */
(function(App) {
	var about = {
		/**
         * 初始化
         */
		init: function(opts) {
			// 轮播
			$('#page_about_carousel').carousel({
				interval: 3000
			});
		}
	};
	App.about = about;
})(window.App);
