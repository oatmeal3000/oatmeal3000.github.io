require.config({
	paths : {
        jQuery : 'vendor/jquery/jquery-1.10.2.min',
		jQueryMobile : 'vendor/jquery_mobile/jquery.mobile-1.3.2.min',
		Underscore : 'vendor/underscore/underscore-min',
		Backbone : 'vendor/backbone/backbone-min',
		Inneractive : 'vendor/inneractive/inneractive'
    },
    shim : {
		jQuery : {
			exports : '$'
		},
		jQueryMobile : {
			exports : '$m',
			deps : ['jQuery']
        },
		Underscore : {
			exports : '_'
		},
		Backbone : {
			exports : 'Backbone',
			deps : ['Underscore', 'jQuery']
		},
		Inneractive : {
			exports : 'Inneractive',
			deps : ['jQuery']
		}
    }
});


require(['jQuery', 'jQueryMobile', 'views/start-page'], function($, $m, startPageView) {
	
	$(document).ready(function(){
		$.mobile.page.prototype.options.domCache = false;

		startPageView.init();
	});

});
