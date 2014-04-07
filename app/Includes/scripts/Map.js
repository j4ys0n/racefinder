(function ( $, w, AppGlobal ){
	"use strict";
	var func = new Function();

	func = function Map( oSettings ){
		var oOptions,
			clickEvt,
			scrollEvt,
			self = this,
			doc = $(document),
			wdw = $(w),
			html = $('html'),
			apiKey = 'AIzaSyAuS_AXBjFep-g23GTsUeFkNEeloKzAvmU',
			mapOptions,
			map,
			geocoder;
		this.oDefaults = {
			mapCanvasClass: '.map-canvas'
		};

		mapOptions = {
			center: new google.maps.LatLng(40.7195235,-73.9981957),
			zoom: 9
		};

		//mix in the defaults and settings
		oOptions = $.extend( this.oDefaults, oSettings );
		//selector cache
		this.combinedSelectors = {};

		if( this.feature.test('touchend') ){
			clickEvt = 'touchend';
			scrollEvt = 'touchmove';
		} else {
			clickEvt = 'click';
			scrollEvt = 'scroll';
		}

		//helpers

		function addMarker( loc ){
			geocoder.geocode( { address: loc }, function ( results, status ){
				if( status == google.maps.GeocoderStatus.OK ){
					var marker = new google.maps.Marker({
						map: map,
						position: results[0].geometry.location
					})
				}else{
					console.log( 'geocode failed:', status );
				}
			});
		}

		function init(){
			map = new google.maps.Map( doc.find( oOptions.mapCanvasClass )[0], mapOptions );
			geocoder = new google.maps.Geocoder();
		}

		return {
			init: init,
			addMarker: addMarker
		};
	};
	func.prototype = AppGlobal.prototype;
	func.prototype.constructor = function Map(){ return false;};
	w.Map = func;
}( jQuery, window, AppGlobal ));