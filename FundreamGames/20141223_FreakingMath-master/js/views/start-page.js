define(['jQuery',
		'Underscore',
		'Backbone',
		'Inneractive',
		'modules/global/app-reg',
		'views/game-page'],
			function(	$,
						_,
						Backbone,
						Inneractive,
						appReg,
						gamePageView) {

	var instance = null;

	return {
		
		init : function() {
			if ( ! instance) {
				var startPageV = Backbone.View.extend({
					el : '#start-page-content',
					template : _.template($('#start-page-template').html()),
					
					initialize : function() {
						this.render();
						appReg.func.cssSetAppBackgroundColor();
					},
					events : {
						'click #start-game-action' : 'startGameAction'
					},
					render : function() {
						this.$el.html(this.template());
					},
					startGameAction : function(event) {
						this.selectStartGame();

						setTimeout(function() {
							$.mobile.changePage('#game-page', { transition: 'slide' });
							gamePageView.init();
						}, 150);
					},
					selectStartGame : function() {
						$('#start-game-action > img').attr('src', 'img/play_select.png');
					}
				});
				instance = new startPageV();
				/*setTimeout(function() {
					appReg.func.placeAd(Inneractive, instance.el);	
				}, 50);*/
			}
		}

	};
});