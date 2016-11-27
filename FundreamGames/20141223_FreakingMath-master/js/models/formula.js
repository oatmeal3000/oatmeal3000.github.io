define(['jQuery',
		'Backbone',
		'modules/global/app-reg'],
			function(	$,
						Backbone,
						AppReg) {

	var model = Backbone.Model.extend({

		defaults : {
			level : 0,
			
			operand1 : null,
			operator : '+',
			operand2 : null,
			result : null,
			isCorrect : null
		},

		initialize : function() {
		},
		createRandomFormula : function() {
			var attr = $.extend({}, this.attr());
			
			this.setOperandsByLevel(attr);
			this.calcResult(attr);
			
			return attr;
		},
		calcResult : function(attr) {
			attr.isCorrect = AppReg.func.getRandomInt(0, 1);

			switch (attr.operator) {
				case '+':
				default:
					attr.result = attr.operand1 + attr.operand2;
			}

			if ( ! attr.isCorrect) {
				if (AppReg.func.getRandomInt(0, 1)) {
					attr.result -= AppReg.func.getRandomInt(1, 4);
				}
				else {
					attr.result += AppReg.func.getRandomInt(1, 4);
				}
			}
		},
		setOperandsByLevel : function(attr) {
			if (this.attr().level < 3) {
				this.setOperandsValue(attr, 1, 5);
			} 
			else if (this.attr().level >= 3 && this.attr().level < 6) {
				this.setOperandsValue(attr, 1, 7);
			}
			else if (this.attr().level >= 6 && this.attr().level < 10) {
				this.setOperandsValue(attr, 2, 9);
			}
			else if (this.attr().level >= 10 && this.attr().level < 15) {
				this.setOperandsValue(attr, 2, 12);
			}
			else if (this.attr().level >= 15 && this.attr().level < 20) {
				this.setOperandsValue(attr, 4, 14);
			}
			else if (this.attr().level >= 20 && this.attr().level < 25) {
				this.setOperandsValue(attr, 1, 18);
			}
			else if (this.attr().level >= 25 && this.attr().level < 30) {
				this.setOperandsValue(attr, 3, 20);
			}
			else if (this.attr().level >= 30 && this.attr().level < 35) {
				this.setOperandsValue(attr, 5, 25);
			}
			else if (this.attr().level >= 35 && this.attr().level < 40) {
				this.setOperandsValue(attr, 6, 30);
			}
			else if (this.attr().level >= 40 && this.attr().level < 45) {
				this.setOperandsValue(attr, 1, 35);
			}
			else if (this.attr().level >= 45 && this.attr().level < 50) {
				this.setOperandsValue(attr, 8, 40);
			}
			else if (this.attr().level >= 50 && this.attr().level < 100) {
				this.setOperandsValue(attr, 3, 50);
			}
			else if (this.attr().level >= 100 && this.attr().level < 200) {
				this.setOperandsValue(attr, 9, 100);
			}
			else if (this.attr().level >= 200 && this.attr().level < 300) {
				this.setOperandsValue(attr, 12, 150);
			}
			else if (this.attr().level >= 300 && this.attr().level < 400) {
				this.setOperandsValue(attr, 50, 150);
			}
			else if (this.attr().level >= 400 && this.attr().level < 500) {
				this.setOperandsValue(attr, 100, 200);
			}
			else if (this.attr().level >= 500 && this.attr().level < 1000) {
				this.setOperandsValue(attr, 100, 500);
			}
			else {
				this.setOperandsValue(attr, 500, 1000);
			}
		},
		setOperandsValue : function(attr, min, max) {
			attr.operand1 = AppReg.func.getRandomInt(min, max);
			attr.operand2 = AppReg.func.getRandomInt(min, max);
		},
		incrLevel : function() {
			++this.attr().level;
		},
		attr : function() {
			return this.attributes;
		}
	
	});
							
	return {
		
		init : function() {
			return new model();
		}

	};
});