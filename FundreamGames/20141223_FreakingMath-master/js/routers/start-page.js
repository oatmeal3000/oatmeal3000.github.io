define(['jQuery',
		'Backbone'],
			function(
				$,
				Backbone) {
	return {
		routing : function() {
			var Router = Backbone.Router.extend({
				routes : {
				}
			});

			var Router = new Router();
			try {
				Backbone.history.start();
			} catch(err) {
				Backbone.history.loadUrl();
			}
		
			return Router;
		}
	};
});