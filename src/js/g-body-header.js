/** header.html */
(function(App) {
    var header = {
        /**
         * 初始化
         */
        init: function(opts) {
        },
       
        /**
         * 滚动条事件
         */
        scrollWheel: function() {
            // 1.注册scroll
            $(document).bind('scroll', function(e) {
                var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
                // 菜单
                if (scrollTop >1 && !$('#g_body_header_nav').hasClass('navbar-bg-white')) {
                    $('#g_body_header_nav').addClass('navbar-bg-white');
                } else if (scrollTop < 1 && $('#g_body_header_nav').hasClass('navbar-bg-white')) {
                    $('#g_body_header_nav').removeClass('navbar-bg-white');
                }
            });
        }
    };
    App.header = header;
    App.header.init();
})(window.App);
