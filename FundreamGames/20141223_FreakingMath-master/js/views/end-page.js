define(['jQuery',
		'Underscore',
		'Backbone',
		'Inneractive',
		'modules/global/app-reg'],
			function(	$,
						_,
						Backbone,
						Inneractive,
						appReg) {

	var instance = null;

	return {
		
		init : function(gamePageView, newScore) {
			if ( ! instance) {
				var endPageV = Backbone.View.extend({
					el : '#end-page-content',
					template : _.template($('#end-page-template').html()),

					events : {
						'click #end-game-play-action' : 'playAgainAction'
					},
					render : function(bestScore) {
						this.$el.html(this.template({ newScore : this.options.newScore, bestScore: bestScore }));
					},
					reset : function(gamePageView, newScore) {
						this.options.gamePageView = gamePageView;
						this.options.newScore = newScore;
				
						this.render(this.handleScores());
					},
					playAgainAction : function() {
						this.options.gamePageView.reset();
						$.mobile.changePage('#game-page', { transition: 'slide', reverse: true });
					},
					handleScores : function() {
						// asyncStorage ?
						var bestScore = localStorage.getItem('ba-freaking-memory-best-score');
						if (bestScore === null) {
							bestScore = 0;
						}
						if (this.options.newScore > bestScore) {
							bestScore = this.options.newScore;
							localStorage.setItem('ba-freaking-memory-best-score', this.options.newScore);
						}
						return bestScore;
					}
				});
				instance = new endPageV();
				instance.reset(gamePageView, newScore);
				/*setTimeout(function() {
					appReg.func.placeAd(Inneractive, instance.el);
				}, 250);*/
			}
			else {
				instance.reset(gamePageView, newScore);
				/*setTimeout(function() {
					appReg.func.placeAd(Inneractive, instance.el);
				}, 250);*/
			}
		}

	};
});