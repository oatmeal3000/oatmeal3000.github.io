// App Registry
define([], function() {
    var appReg = { data : {}, func : {} };
	
	appReg.data.colorCodes = ['556270', 'FF6B6B', '00A0B0', 'E6781E', '8EBE94', 'D41E45'];	

	appReg.func.cssSetAppBackgroundColor = function() {
		$('.ui-panel-content-wrap, .ui-page, .page, .content').css('background-color', '#' + appReg.func.getRandomColorCodeHex());
	};

	appReg.func.getRandomColorCodeHex = function() {
		return appReg.data.colorCodes[appReg.func.getRandomInt(0, appReg.data.colorCodes.length - 1)];
	};

	appReg.func.getRandomInt = function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	/*appReg.func.placeAd = function(Inneractive, container) {
		var options = {
			APP_ID : 'DroidIndustries_FreakingMath_other',
			TYPE : 'Banner',
			REFRESH_RATE : 30
		};
		var ad = Inneractive.createAd(options);
		ad.addTo($(container)[0]);
	};*/

    return appReg;
});