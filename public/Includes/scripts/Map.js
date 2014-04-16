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
			map;
		this.oDefaults = {
			contentType: 'application/json; charset=utf-8',
			mapCanvasClass: '.map-canvas'
		};

		mapOptions = {
			center: new google.maps.LatLng(40.7195235,-73.9981957),
			zoom: 5
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
		function addMarker( x ){
			var marker = new google.maps.Marker({
				map: map,
    			//animation: google.maps.Animation.DROP,
				position: new google.maps.LatLng( x.location_lat, x.location_long ),
				title: x.name
			});
			var dt = new Date(x.race_date);
			var markerInfo = '<div class="markerInfo"><a href="'+x.link+'" target="_blank">'+x.name+'</a><br/>'
								+'<h3 style="display: inline-block;">'+dt.getMonth()+'/'+dt.getDate()+'/'+dt.getUTCFullYear()+'</h3>&nbsp;&nbsp;'
								+'<h4 style="display: inline-block;">'+x.location+'</h4></div>';
			var infowindow = new google.maps.InfoWindow({
			    content: markerInfo
			});
			google.maps.event.addListener(marker, 'click', function() {
				infowindow.open(map,marker);
			});
		}

		function addRaces( res ){
			res = res.data;
			var i = 0;
			for( i; i < res.length; i++ ){
				var interval = 75*i;
				//setTimeout( function(){
					addMarker( res[i] );
				//}, interval );
			}
		}

		function getRaces(){
			$.ajax({
				contentType: oOptions.contentType,
				url: '/api/races/status/1',
				type: 'GET',
				success: addRaces
			})
		}

		function init(){
			map = new google.maps.Map( doc.find( oOptions.mapCanvasClass )[0], mapOptions );
		}

		return {
			init: init,
			getRaces: getRaces,
			addMarker: addMarker,
			geocoder: new google.maps.Geocoder()
		};
	};
	func.prototype = AppGlobal.prototype;
	func.prototype.constructor = function Map(){ return false;};
	w.Map = func;
}( jQuery, window, AppGlobal ));
