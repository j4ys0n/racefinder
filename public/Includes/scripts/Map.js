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
			markers = [],
			svgMarker1 = 'M-12.548-82.031c2.269,1.805,3.865,4.41,4.367,7.389h5.091l-6.073-13.539L-12.548-82.031zM-16.616-74.643h4.354c-0.383-1.479-1.176-2.791-2.256-3.811L-16.616-74.643zM-20.086-70.648c-0.077-0.003-0.151-0.011-0.227-0.023c-0.061-0.01-0.119-0.021-0.178-0.036c-0.064-0.017-0.126-0.036-0.189-0.06c-0.066-0.022-0.131-0.051-0.195-0.082c-0.029-0.016-0.059-0.022-0.088-0.039c-0.025-0.014-0.047-0.033-0.07-0.049c-0.061-0.035-0.117-0.076-0.174-0.119c-0.05-0.039-0.099-0.078-0.146-0.121c-0.047-0.043-0.09-0.09-0.133-0.137c-0.043-0.048-0.086-0.099-0.125-0.152c-0.038-0.051-0.071-0.103-0.102-0.157c-0.033-0.058-0.065-0.111-0.092-0.171c-0.027-0.059-0.051-0.118-0.072-0.182c-0.022-0.061-0.041-0.121-0.057-0.184c-0.015-0.061-0.025-0.121-0.035-0.184c-0.009-0.07-0.017-0.142-0.021-0.213c-0.002-0.027-0.008-0.056-0.008-0.084c0-0.031,0.008-0.063,0.01-0.095c0.001-0.071,0.009-0.144,0.021-0.215c0.01-0.065,0.021-0.125,0.037-0.187c0.016-0.062,0.036-0.125,0.059-0.186c0.023-0.068,0.051-0.132,0.082-0.195c0.016-0.029,0.023-0.061,0.039-0.09l3.73-6.777c-0.635-0.162-1.295-0.258-1.979-0.258c-4.412,0-8,3.59-8,8c0,4.412,3.588,8,8,8c3.719,0,6.844-2.555,7.737-5.998h-7.736C-20.029-70.641-20.057-70.648-20.086-70.648zM20.002-80.643c-0.684,0-1.346,0.096-1.979,0.258l3.729,6.776c0.533,0.97,0.181,2.187-0.786,2.718c-0.308,0.17-0.638,0.248-0.964,0.248c-0.706,0-1.391-0.373-1.754-1.035l-3.729-6.775C12.972-76.994,12-74.932,12-72.643c0,4.412,3.589,8,8,8c4.41,0,8-3.588,8.002-8C28.002-77.053,24.412-80.643,20.002-80.643zM0.183,-77.12 6.617,-88.808 -5.06,-88.808zM0-116.28c-21.286,0-38.542,17.256-38.542,38.542S-14.931-21.835,0-1.002c14.931-22.222,38.542-55.451,38.542-76.736S21.286-116.28,0-116.28z M20-60.641c-6.617,0-12-5.383-12-12c0-3.801,1.781-7.189,4.549-9.389L10-86.66L1.752-71.676c-0.008,0.011-0.018,0.019-0.023,0.03c-0.018,0.031-0.035,0.062-0.053,0.093c-0.033,0.051-0.074,0.096-0.111,0.145c-0.041,0.052-0.08,0.105-0.127,0.154c-0.008,0.007-0.014,0.017-0.02,0.022c-0.039,0.04-0.084,0.069-0.125,0.104C1.244-71.084,1.195-71.039,1.141-71c-0.031,0.021-0.064,0.039-0.096,0.059C1.008-70.92,0.969-70.9,0.932-70.881c-0.039,0.021-0.072,0.047-0.113,0.066c-0.006,0.002-0.014,0.002-0.02,0.006c-0.066,0.029-0.137,0.047-0.205,0.068c-0.041,0.012-0.078,0.027-0.117,0.037c-0.023,0.005-0.047,0.015-0.07,0.021c-0.045,0.01-0.097,0.01-0.146,0.016C0.175-70.655,0.087-70.639,0-70.639c-0.002,0-0.004-0.002-0.006-0.002h-8.175c-0.955,5.666-5.884,10-11.818,10c-6.617,0-12-5.384-12-12c0-6.617,5.383-12,12-12c1.384,0,2.709,0.248,3.947,0.682l4.301-7.813c0.16-0.291,0.392-0.523,0.662-0.699l-1.123-2.502h-4.955c-1.104,0-2-0.896-2-2c0-1.105,0.896-2,2-2h6.203c0.002,0,0.006,0,0.008,0h6.289c1.105,0,2,0.895,2,2c0,1.104-0.895,2-2,2h-3.16l0.973,2.166H8v-3.5c0-1.104,0.896-2,2-2h6.832c0.205,0,0.398,0.039,0.586,0.098c2.392,0.451,4.207,2.548,4.207,5.068c0,2.85-2.317,5.168-5.168,5.168c-1.104,0-2-0.896-2-2c0-1.105,0.896-2,2-2c0.646,0,1.168-0.523,1.168-1.168c0-0.643-0.522-1.166-1.168-1.166H12v2.986l4.052,7.361c1.239-0.434,2.563-0.682,3.948-0.682c6.617,0,12,5.384,12,12.001S26.617-60.641,20-60.641z';
		self.oDefaults = {
			contentType: 'application/json; charset=utf-8',
			mapCanvasClass: '.map-canvas'
		};

		mapOptions = {
			center: new google.maps.LatLng(40.7195235,-73.9981957),
			zoom: 5
		};

		//mix in the defaults and settings
		oOptions = $.extend( self.oDefaults, oSettings );
		//selector cache
		self.combinedSelectors = {};
		self.combinedSelectors.mapCanvas = $();

		if( self.feature.test('touchend') ){
			clickEvt = 'touchend';
			scrollEvt = 'touchmove';
		} else {
			clickEvt = 'click';
			scrollEvt = 'scroll';
		}

		//helpers
		function removeMarkers(){
			var i = 0;
			for( i; i < markers.length; i++ ){
				markers[i].setMap( null );
				$(markers[i]).remove();
			}
			markers = [];
			google.maps.event.clearInstanceListeners( window) ;
			google.maps.event.clearInstanceListeners( document );
			google.maps.event.clearInstanceListeners( self.combinedSelectors.mapCanvas );
		}

		function addMarker( x ){
			var draggable = true;
			var updateGeo = false;
			var icon = {
				path: svgMarker1,
				fillColor: '#ff6700',
				fillOpacity: .75,
				scale: .35
			}

			var marker = new google.maps.Marker({
				map: map,
				draggable: draggable,
    			//animation: google.maps.Animation.DROP,
				position: new google.maps.LatLng( x.location_lat, x.location_long ),
				title: x.name,
				icon: icon
				//icon: '/public/Includes/images/flag-icon.png'
			});
			var dt = new Date(x.race_date);
			var markerInfo = '<div class="markerInfo"><a href="'+x.link+'" target="_blank">'+x.name+'</a><br/>'
								+'<h3 style="display: inline-block;">'+(dt.getMonth()+1)+'/'+dt.getDate()+'/'+dt.getUTCFullYear()+'</h3>&nbsp;&nbsp;'
								+'<h4 style="display: inline-block;">'+x.location+'</h4></div>';
			var infowindow = new google.maps.InfoWindow({
			    content: markerInfo
			});
			google.maps.event.addListener( marker, 'click', function() {
				infowindow.open( map, marker );
			});
			if( draggable && updateGeo ){
				google.maps.event.addListener( marker, 'dragend', function( e ){
					//console.log( e.latLng.lat(), e.latLng.lng() );
					$.ajax({
						contentType: oOptions.contentType,
						url: '/api/race/'+x._id,
						type: 'POST',
						data: JSON.stringify({'location_lat': e.latLng.lat(), 'location_long': e.latLng.lng() }),
						success: function( e ){
							console.log('success', e );
						}
					})
				})
			}
			markers.push( marker );
		}

		function addRaces( res ){
			res = res.data;
			var i = 0;
			for( i; i < res.length; i++ ){
				//var interval = 75*i;
				//setTimeout( function(){
					addMarker( res[i] );
				//}, interval );
			}
		}

		function getRaces( url ){
			$.ajax({
				contentType: oOptions.contentType,
				url: url,
				type: 'GET',
				success: addRaces
			})
		}

		function updateSelectorCache() {
			self.combinedSelectors.mapCanvas = doc.find( oOptions.mapCanvasClass );
		}

		function init(){
			updateSelectorCache();

			map = new google.maps.Map( doc.find( self.combinedSelectors.mapCanvas )[0], mapOptions );
		}

		return {
			init: init,
			getRaces: getRaces,
			addMarker: addMarker,
			removeMarkers: removeMarkers,
			geocoder: new google.maps.Geocoder()
		};
	};
	func.prototype = AppGlobal.prototype;
	func.prototype.constructor = function Map(){ return false;};
	w.Map = func;
}( jQuery, window, AppGlobal ));
