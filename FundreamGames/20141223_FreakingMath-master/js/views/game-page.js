define(['jQuery',
		'Underscore',
		'Backbone',
		'modules/global/app-reg',
		'models/formula',
		'views/end-page'],
			function(	$,
						_,
						Backbone,
						appReg,
						formulaModel,
						endPageView) {

	var instance = null;
							
	return {
		
		init : function() {
			if ( ! instance) {
				var formulaM = formulaModel.init();
				var gamePage = Backbone.View.extend({
					el : '#game-page-content',
					template : _.template($('#game-page-template').html()),

					initialize : function() {
						this.options.okSound = new Audio('audio/score.wav');
						this.options.notOkSound = new Audio('audio/gameover.wav');
						this.options.isGameOver = false;

						this.model.on('change', this.render, this);
					},
					events : {
						'click #true-action' : 'trueAction',
						'click #false-action' : 'falseAction'
					},
					render : function() {
						this.$el.html(this.template(this.model.toJSON()));
						
						this.options.elGameTimeBar = $('#game-timer-bar');
					},
					reset : function() {
						this.model.attr().level = 0;
						this.options.isGameOver = false;
						
						appReg.func.cssSetAppBackgroundColor();
						formulaM.set(formulaM.createRandomFormula());
					},
					trueAction : function(event) {
						if (this.options.isGameOver) {
							return;
						}
				
						var _this = this;
						event.currentTarget.src = 'img/true_select.png';
						
						this.endTimer();

						setTimeout(function() {
							if (_this.model.attr().isCorrect) {
								_this.goNextLevel();
							}
							else {
								_this.gameOver();
							}
						}, 200);
					},
					falseAction : function(event) {
						if (this.options.isGameOver) {
							return;
						}
				
						var _this = this;
						event.currentTarget.src = 'img/false_select.png';
						
						this.endTimer();

						setTimeout(function() {
							if (_this.model.attr().isCorrect) {
								_this.gameOver();
							}
							else {
								_this.goNextLevel();
							}
						}, 200);
					},
					gameOver : function() {
						var _this = this;
						this.options.isGameOver = true;
						
						this.endTimer();
						this.options.notOkSound.play();
						setTimeout(function() {
							endPageView.init(_this, _this.model.attr().level);
							$.mobile.changePage('#end-page', { transition: 'slide' });
						}, 1500);
					},
					goNextLevel : function() {
						this.endTimer();
						this.options.okSound.play();
						appReg.func.cssSetAppBackgroundColor();
						formulaM.incrLevel();
						formulaM.set(formulaM.createRandomFormula());
						this.startTimer();
					},
					startTimer : function() {
						var _this = this;
						
						this.options.elGameTimerBarWidth = 100;

						this.options.timerTimeout = setTimeout(function() {
							clearInterval(_this.options.timerInterval);
							_this.options.elGameTimeBar.css('width', '0%');
							_this.gameOver();
						}, 1500);

						this.options.timerInterval = setInterval(function() {
							_this.options.elGameTimerBarWidth -= 5;
							_this.options.elGameTimeBar.css('width', _this.options.elGameTimerBarWidth + '%');
						}, 75);
					},
					endTimer : function() {
						clearInterval(this.options.timerInterval);
						clearTimeout(this.options.timerTimeout);
					}
				});

				instance = new gamePage({ model : formulaM });
				instance.reset();
			}
			else {
				instance.reset();
			}
		}

	};
});