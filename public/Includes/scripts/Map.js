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
			mobile = false,
			apiKey = 'AIzaSyAuS_AXBjFep-g23GTsUeFkNEeloKzAvmU',
			geocoder = new google.maps.Geocoder(),
			initMapCallback = function(){return false;},
			nativeGeo = false,
			userLat = 40.7195235,
			userLng = -73.9981957,
			mapOptions,
			map,
			races,
			raceType = 0,
			markers = [],
			svgMarker1 = 'M-12.548-82.031c2.269,1.805,3.865,4.41,4.367,7.389h5.091l-6.073-13.539L-12.548-82.031zM-16.616-74.643h4.354c-0.383-1.479-1.176-2.791-2.256-3.811L-16.616-74.643zM-20.086-70.648c-0.077-0.003-0.151-0.011-0.227-0.023c-0.061-0.01-0.119-0.021-0.178-0.036c-0.064-0.017-0.126-0.036-0.189-0.06c-0.066-0.022-0.131-0.051-0.195-0.082c-0.029-0.016-0.059-0.022-0.088-0.039c-0.025-0.014-0.047-0.033-0.07-0.049c-0.061-0.035-0.117-0.076-0.174-0.119c-0.05-0.039-0.099-0.078-0.146-0.121c-0.047-0.043-0.09-0.09-0.133-0.137c-0.043-0.048-0.086-0.099-0.125-0.152c-0.038-0.051-0.071-0.103-0.102-0.157c-0.033-0.058-0.065-0.111-0.092-0.171c-0.027-0.059-0.051-0.118-0.072-0.182c-0.022-0.061-0.041-0.121-0.057-0.184c-0.015-0.061-0.025-0.121-0.035-0.184c-0.009-0.07-0.017-0.142-0.021-0.213c-0.002-0.027-0.008-0.056-0.008-0.084c0-0.031,0.008-0.063,0.01-0.095c0.001-0.071,0.009-0.144,0.021-0.215c0.01-0.065,0.021-0.125,0.037-0.187c0.016-0.062,0.036-0.125,0.059-0.186c0.023-0.068,0.051-0.132,0.082-0.195c0.016-0.029,0.023-0.061,0.039-0.09l3.73-6.777c-0.635-0.162-1.295-0.258-1.979-0.258c-4.412,0-8,3.59-8,8c0,4.412,3.588,8,8,8c3.719,0,6.844-2.555,7.737-5.998h-7.736C-20.029-70.641-20.057-70.648-20.086-70.648zM20.002-80.643c-0.684,0-1.346,0.096-1.979,0.258l3.729,6.776c0.533,0.97,0.181,2.187-0.786,2.718c-0.308,0.17-0.638,0.248-0.964,0.248c-0.706,0-1.391-0.373-1.754-1.035l-3.729-6.775C12.972-76.994,12-74.932,12-72.643c0,4.412,3.589,8,8,8c4.41,0,8-3.588,8.002-8C28.002-77.053,24.412-80.643,20.002-80.643zM0.183,-77.12 6.617,-88.808 -5.06,-88.808zM0-116.28c-21.286,0-38.542,17.256-38.542,38.542S-14.931-21.835,0-1.002c14.931-22.222,38.542-55.451,38.542-76.736S21.286-116.28,0-116.28z M20-60.641c-6.617,0-12-5.383-12-12c0-3.801,1.781-7.189,4.549-9.389L10-86.66L1.752-71.676c-0.008,0.011-0.018,0.019-0.023,0.03c-0.018,0.031-0.035,0.062-0.053,0.093c-0.033,0.051-0.074,0.096-0.111,0.145c-0.041,0.052-0.08,0.105-0.127,0.154c-0.008,0.007-0.014,0.017-0.02,0.022c-0.039,0.04-0.084,0.069-0.125,0.104C1.244-71.084,1.195-71.039,1.141-71c-0.031,0.021-0.064,0.039-0.096,0.059C1.008-70.92,0.969-70.9,0.932-70.881c-0.039,0.021-0.072,0.047-0.113,0.066c-0.006,0.002-0.014,0.002-0.02,0.006c-0.066,0.029-0.137,0.047-0.205,0.068c-0.041,0.012-0.078,0.027-0.117,0.037c-0.023,0.005-0.047,0.015-0.07,0.021c-0.045,0.01-0.097,0.01-0.146,0.016C0.175-70.655,0.087-70.639,0-70.639c-0.002,0-0.004-0.002-0.006-0.002h-8.175c-0.955,5.666-5.884,10-11.818,10c-6.617,0-12-5.384-12-12c0-6.617,5.383-12,12-12c1.384,0,2.709,0.248,3.947,0.682l4.301-7.813c0.16-0.291,0.392-0.523,0.662-0.699l-1.123-2.502h-4.955c-1.104,0-2-0.896-2-2c0-1.105,0.896-2,2-2h6.203c0.002,0,0.006,0,0.008,0h6.289c1.105,0,2,0.895,2,2c0,1.104-0.895,2-2,2h-3.16l0.973,2.166H8v-3.5c0-1.104,0.896-2,2-2h6.832c0.205,0,0.398,0.039,0.586,0.098c2.392,0.451,4.207,2.548,4.207,5.068c0,2.85-2.317,5.168-5.168,5.168c-1.104,0-2-0.896-2-2c0-1.105,0.896-2,2-2c0.646,0,1.168-0.523,1.168-1.168c0-0.643-0.522-1.166-1.168-1.166H12v2.986l4.052,7.361c1.239-0.434,2.563-0.682,3.948-0.682c6.617,0,12,5.384,12,12.001S26.617-60.641,20-60.641z',
			svgMarker2 = 'M14.61-73.682c-3.428,2.291-4.389,6.248-8.491,8.495c-1.516,0.455-3.033,0.911-4.549,1.366h-4.246c-1.226,0.428-2.055,1.836-2.123,3.489c1.272,3.19,6.319,3.052,10.008,1.972c4.902-1.436,14.583-7.725,12.889-14.26C17.09-73.393,16.586-73.731,14.61-73.682zM-2.828-68.979c1.567,0.766,1.813-1.152,3.64-0.455c0.521,0.198,0.324,1.026,1.516,0.758c1.13-0.254,0.817-1.244,1.517-1.82c0.832-0.686,1.562,0.079,2.275-0.456c0.101-0.101,0.202-0.202,0.303-0.303c0.252-0.252,0.505-0.505,0.758-0.759c-0.171-0.636-0.233-0.702-0.152-1.365c0.838-0.891,1.598-1.153,2.124-2.427c-0.208-0.948-1.168-1.331-0.758-2.731c0.194-0.662,0.76-0.526,0.606-1.365c-0.257-1.503-1.2-1.025-1.819-1.973c-0.878-1.342,0.191-2.045-1.365-3.185c-0.404,0.101-0.809,0.202-1.213,0.303c-1.082-0.968-1.364-1.979-3.184-2.275c-0.405,0.304-0.809,0.607-1.213,0.911C-0.996-86.291-1-86.782-2.07-87.032c-1.089,0.718-1.566,1.581-2.578,2.275c-0.455-0.101-0.91-0.202-1.365-0.303c-0.404,0.404-0.809,0.809-1.213,1.213c0.322,2.696-1.585,2.028-1.971,4.551c1.245,1.298,0.375,2.059,0,3.49c1.01,1.506,2.353,1.885,1.971,3.944c0.405,0.405,0.809,0.809,1.213,1.214C-3.732-70.934-4.346-69.916-2.828-68.979zM-11.168-89.155c-0.556-0.506-1.112-1.012-1.667-1.518c-0.557-0.05-1.112-0.101-1.668-0.151c-6.309,4.134-6.83,16.325-2.729,23.058c0.954,1.566,1.42,2.862,3.791,3.035c1.118-0.426,1.836-0.869,2.274-1.973c0.918-3.44-2.154-5.985-2.729-9.253C-15.006-82.256-10.242-84.155-11.168-89.155zM-1.16-97.954c-0.758,0.202-1.517,0.404-2.274,0.607c-0.705,0.904-1.31,1.247-1.365,2.882c1.589,3.8,6.797,2.216,10.463,3.792c3.81,1.638,4.808,4.649,7.278,7.585c0.964,1.145,2.523,1.331,4.246,0.91c0.354-0.455,0.707-0.91,1.062-1.365C20.252-90.883,6.563-98.05-1.16-97.954zM0-115.278c-21.286,0-38.542,17.256-38.542,38.542S-14.931-20.833,0,0c14.931-22.222,38.542-55.451,38.542-76.736S21.286-115.278,0-115.278zM24.315-71.71c0.657,0.607,1.314,1.214,1.971,1.82c-0.303,0.961-0.606,1.921-0.909,2.882c-2.807-0.188-4.596,0.448-4.55,3.489c0.405,0.657,0.81,1.314,1.213,1.972c-0.392,1.09-1.265,1.792-1.971,2.579c-1.357-0.425-2.234-0.869-3.943-0.455c-0.505,0.708-1.011,1.416-1.516,2.124c-0.525,2.186,1.664,3.463-2.426,3.945c-0.707-0.993-1.561-1.578-3.185-1.669c-2.103,1.26-1.84,1.726-2.88,4.096c-1.112,0.162-2.011,0.615-3.185,0.303c-0.182-1.718-1.422-2.74-3.336-2.73c-1.534,0.581-2.301,1.189-2.729,2.882c-0.96-0.152-1.921-0.303-2.881-0.455c-0.468-1.444-0.379-2.925-1.971-3.641c-2.381-0.731-3.182,1.323-4.549,1.214c-0.985-0.202-1.898-0.837-2.426-1.517c0.512-2.175,0.257-3.931-1.668-4.551c-1.53-0.637-2.565,0.522-3.639,0.455c-0.557-0.708-1.112-1.416-1.668-2.124c0.432-1.405,1.308-2.039,0.909-4.096c-1.897-2.588-4.732-0.43-5.307-4.551c1.098-0.883,1.705-1.414,2.274-2.882c-0.167-2.318-1.37-3.111-3.487-3.489c0.05-1.112,0.101-2.225,0.152-3.337c2.271-0.075,3.283-1.329,3.185-3.793c-0.525-1.158-1.08-1.655-2.124-2.275c0.006-1.206,0.429-2.576,1.213-3.035c1.602-0.373,5.129-0.142,4.246-3.641c-0.404-0.758-0.809-1.517-1.213-2.275c0.657-0.708,1.314-1.416,1.971-2.124c4.174,1.173,5.549,0.513,5.004-4.4c0.809-0.455,1.618-0.91,2.426-1.365c1.583,0.534,1.556,1.634,3.942,1.668c2.52-1.273,1.969-3.723,2.578-4.096c0.758-0.152,1.516-0.304,2.274-0.456c1.385,0.498,1.454,2.105,2.881,2.731c2.963,0.848,3.159-1.599,4.549-2.731c0.859,0.202,1.718,0.405,2.578,0.607c0.016,2.327,1.501,4.798,4.094,3.792c0.556-0.505,1.112-1.011,1.668-1.517c1.077-0.405,2.413,1.032,3.033,1.365c-0.187,1.122-0.635,1.953-0.151,3.034c0.991,2.61,3.091,1.623,5.307,1.214c0.607,0.759,1.213,1.517,1.819,2.275c-0.696,1.938-2.134,4.237,0.607,5.461c0.9,0.395,2.338-0.088,2.881,0.607c1.97,3.25-1.748,3.028-1.062,6.979c0.821,1.144,2.133,1.15,3.033,2.123c0.372,0.807,0.157,2.576-0.152,3.186C25.16-76.113,23.205-74.103,24.315-71.71z',
			svgMarker3 = 'M-8.613-89.109c-0.481,1.052-2.282,3.789-1.758,4.826c0.428,1.025,1.726,2.453,2.812,2.739c1.289-5.216,2.579-10.434,3.867-15.65c0.341-1.215,1.889-4.66,1.406-5.869C-4.858-98.853-6.491-93.754-8.613-89.109zM0-115.278c-21.286,0-38.542,17.256-38.542,38.542S-14.931-20.833,0,0c14.931-22.222,38.542-55.451,38.542-76.736S21.286-115.278,0-115.278zM2.871-67.59v-0.131c2.93-7.042,5.86-14.085,8.79-21.127C6.934-82.11,2.207-75.371-2.52-68.633c-1.797-0.304-3.594-0.609-5.39-0.913c-4.072-0.819-8.404-0.481-12.891-0.521c1.522-5.303,3.047-10.607,4.57-15.911c-4.499,3.899-6.859,17.396-13.36,18.258v-0.391c4.609-7.042,9.22-14.086,13.828-21.127h0.469c0.976,1,1.953,2,2.93,2.999h0.234c3.515-7.215,7.032-14.434,10.546-21.649h0.352c3.242,5.651,6.485,11.303,9.727,16.954C5.098-85.11,1.699-79.284-1.699-73.458c0.078-0.043,0.156-0.087,0.234-0.131c4.726-6.693,9.453-13.39,14.18-20.084c0.117,0.043,0.234,0.087,0.352,0.13c0.732,2.504,2.987,4.657,4.336,6.651c4.062,6.085,8.125,12.173,12.188,18.258C24.854-64.366,9.22-65.338,2.871-67.59z';
		self.oDefaults = {
			contentType: 'application/json; charset=utf-8',
			mapCanvasClass: '.map-canvas',
			locCookieName: 'loc',
			latCookieName: 'lat',
			lngCookieName: 'lng',
			locCookieDays: 30,
			latCookieDays: 30,
			lngCookieDays: 30,
			locationInputClass: '.overlay.location .input-location',
			locationInputBtnClass: '.overlay.location .btn',
			locationLabelClass: '.controls .locationStack .location',
			markerSize: 100,
			markerScale: 0.35,
			markerScaleCluster: 0.5,
			markerOpacity: 0.8
		};

		mapOptions = {
			center: new google.maps.LatLng( userLat, userLng ),
			zoom: 8
		};

		//mix in the defaults and settings
		oOptions = $.extend( self.oDefaults, oSettings );
		//selector cache
		self.combinedSelectors = {};
		self.combinedSelectors.mapCanvas = $();

		if( self.feature.test('orientation') ){
			clickEvt = 'touchend';
			scrollEvt = 'touchmove';
			mobile = true;
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

		function newMarker( lat, lng, name, cluster ){
			var draggable = false;
			var updateGeo = false;
			var icon = {
				path: svgMarker1,
				fillColor: '#ff6700',
				fillOpacity: oOptions.markerOpacity,
				scale: ( cluster ) ? oOptions.markerScaleCluster : oOptions.markerScale
			}

			if( raceType === 2 ){
				icon.path = svgMarker2;
				icon.fillColor = '#029ded';
			}else if( raceType === 3 ){
				icon.path = svgMarker3;
				icon.fillColor = '#008d11';
			}

			var marker = new google.maps.Marker({
				map: map,
				draggable: draggable,
				//animation: google.maps.Animation.DROP,
				position: new google.maps.LatLng( lat, lng ),
				title: name,
				icon: icon
			});
			/*
			if( draggable && updateGeo ){
				google.maps.event.addListener( marker, 'dragend', function( e ){
					$.ajax({
						contentType: oOptions.contentType,
						url: '/api/race/'+x._id,
						type: 'POST',
						data: JSON.stringify({
							'coords':[ e.latLng.lng(), e.latLng.lat() ]
						}),
						success: function( e ){
							console.log('success', e );
						}
					});
				});
			}*/

			return marker;
		}

		function addMarker( x ){
			var marker = newMarker( x.coords[1], x.coords[0], x.name, false ),
				dt = new Date(x.race_date),
				markerInfo = '<div class="markerInfo"><a href="'+x.link+'" target="_blank">'+x.name+'</a><br/>'
								+'<h3 style="display: inline-block;">'+(dt.getMonth()+1)+'/'+dt.getDate()+'/'+dt.getUTCFullYear()+'</h3>&nbsp;&nbsp;'
								+'<h4 style="display: inline-block;">'+x.location+'</h4></div>',
				infowindow = new google.maps.InfoWindow({
					content: markerInfo
				});
			google.maps.event.addListener( marker, 'click', function() {
				infowindow.open( map, marker );
			});
			markers.push( marker );
		}

		function spreadCluster( x ){
			var rndmLat, rndmLng, i = 0;
			for( i; i < x.length; i++ ){
				rndmLat = Math.random()/1000;
				rndmLng = Math.random()/1000;
				x[i].coords[1] += rndmLat;
				x[i].coords[0] += rndmLng;
				addMarker( x[i] );
			}
		}

		function addClusterMarker( x ){
			if( map.getZoom() > 14 && x.length > 2 ){
				spreadCluster( x );
				return false;
			}
			var name = String(x.length)+' races near this location',
				markerInfo = '',
				dt,
				avgLat = 0,
				avgLng = 0,
				i = 0;
			for( i; i < x.length; i++ ){
				avgLat += x[i].coords[1];
				avgLng += x[i].coords[0];
				dt = new Date(x[i].race_date);
				if( i < 2 ){
					markerInfo += '<div class="markerInfo" style="margin-bottom: 5px;"><a href="'+x[i].link+'" target="_blank">'+x[i].name+'</a><br/>'
									+'<h3 style="display: inline-block;">'+(dt.getMonth()+1)+'/'+dt.getDate()+'/'+dt.getUTCFullYear()+'</h3>&nbsp;&nbsp;'
									+'<h4 style="display: inline-block;">'+x[i].location+'</h4></div>'
				}
			}
			if( x.length > 2 ){
				markerInfo += '<div><h4 style="display: inline-block;">'+String(x.length)+' races near here. Zoom for more</h4></div>';
			}
			avgLat = avgLat/x.length;
			avgLng = avgLng/x.length;

			var marker = newMarker( avgLat, avgLng, name, true );
			var infowindow = new google.maps.InfoWindow({
				content: markerInfo
			});
			google.maps.event.addListener( marker, 'click', function() {
				infowindow.open( map, marker );
			});
			markers.push( marker );
		}

		function addRaces( clusters ){
			var i = 0;
			for( i; i < races.length; i++ ){
				if( races[i].clustered === false ){
					addMarker( races[i] );
				}
			}
			for( i = 0; i < clusters.length; i++ ){
				addClusterMarker( clusters[i] );
			}
		}

		function toRad( d ){
			return d * ( Math.PI / 180 );
		}

		function distanceBetween( latLng1, latLng2 ){
			//haversine distance formula
			var earthRadiusKm = 6371,
				kmToMi = 0.621371,
				latd = toRad( latLng2.lat() - latLng1.lat() ),
				lngd = toRad( latLng2.lng() - latLng1.lng() ),
				a = Math.sin( latd / 2 ) * Math.sin( latd / 2 ) + Math.cos( toRad( latLng1.lat() ) ) * Math.cos( toRad( latLng2.lat() ) ) * Math.sin( lngd / 2 ) * Math.sin( lngd / 2 ),
				c = 2 * Math.atan2( Math.sqrt( a ) , Math.sqrt( 1 - a ) ),
				k = earthRadiusKm * c,
				m = k * kmToMi;
			return m;
		}

		function currentMapInfo(){
			var bounds = map.getBounds(),
				ne = bounds.getNorthEast(),
				sw = bounds.getSouthWest(),
				nw = new google.maps.LatLng( ne.lat(), sw.lng() ),
				se = new google.maps.LatLng( sw.lat(), ne.lng() ),
				latDist = distanceBetween( nw, ne ),
				lngDist = distanceBetween( nw, sw ),
				pixelsPerMile = self.combinedSelectors.mapCanvas.width() / latDist;
			return { 'nw': nw, 'sw': sw, 'ne': ne, 'se': se, 'latDistance': latDist, 'lngDistance': lngDist, 'pixelsPerMile': pixelsPerMile };
		}

		function pointNearby( latLng1, latLng2, distance ){
			var d = distanceBetween( latLng1, latLng2 );
			if( d > distance ){
				return false;
			}else{
				return true;
			}
		}

		function refreshMarkers(){
			removeMarkers();

			var mapInfo = currentMapInfo(),
				milesPerMarker = ( oOptions.markerSize * oOptions.markerScaleCluster ) / mapInfo.pixelsPerMile,
				clusters = [],
				i = 0;
			for( i; i < races.length; i++ ){
				if( races[i].clustered === undefined || races[i].clustered === false ){
					var cluster = [],
						m = races[i],
						j = i+1;
					for( j; j < races.length; j++ ){
						if( races[j].clustered === undefined || races[j].clustered === false ){
							var p1 = new google.maps.LatLng( m.coords[1], m.coords[0] ),
								p2 = new google.maps.LatLng( races[j].coords[1], races[j].coords[0] ),
								d = distanceBetween( p1, p2 );
							if( d < milesPerMarker ){
								races[j].clustered = true;
								cluster.push( races[j] );
							}else{
								races[j].clustered = false;
							}
						}
					}
					if( cluster.length > 0 ){
						m.clustered = true;
						cluster.push( m );
						clusters.push( cluster );
					}else{
						races[i].clustered = false;
					}
				}
			}
			addRaces( clusters );

		}

		function markerHandler( res ){
			races = res.data;
			google.maps.event.addListenerOnce( map, 'idle', function(){
				var center = map.getCenter();
				userLat = center.lat();
				userLng = center.lng();
				var s = encodeURIComponent($('.dateStart').val()),
					e = encodeURIComponent($('.dateEnd').val());
				getRaces( '/api/races/date/'+raceType+'/'+s+'/'+e, raceType );
			} );
			refreshMarkers();
		}

		function getRaces( url, t ){
			var mapInfo = currentMapInfo();
			//console.log( mapInfo );
			raceType = parseInt( t, 10 );
			var d;
			if( mapInfo.latDistance > mapInfo.lngDistance ){
				d = Math.ceil( mapInfo.latDistance/2 );
			}else{
				d = Math.ceil( mapInfo.lngDistance/2 );
			}
			d = Math.ceil( parseInt( d, 10 ) * 1609.34 );

			if( nativeGeo ){
				url = url.replace('date', 'dist');
				url += '/'+d+'/'+userLat+'/'+userLng;
			}

			$.ajax({
				contentType: oOptions.contentType,
				url: url,
				type: 'GET',
				success: markerHandler
			})
		}

		function initMap( callback ){
			var delay = 750;
			if( mobile ){
				delay = 3000;
			}
			mapOptions.center = new google.maps.LatLng( userLat, userLng );
			map = new google.maps.Map( self.combinedSelectors.mapCanvas[0], mapOptions );
			setTimeout(function(){
				callback();
			}, delay);
		}

		function geocode( loc, callback ){
			geocoder.geocode( { address: loc }, function( res, status ){
				var coords;
				if( status === google.maps.GeocoderStatus.OK ){
					coords =  res[0].geometry.location;
					userLng = coords.A;
					userLat = coords.k;
					//store values
					self.setCookie( oOptions.latCookieName, userLat, oOptions.latCookieDays );
					self.setCookie( oOptions.lngCookieName, userLng, oOptions.lngCookieDays );
					self.setCookie( oOptions.locCookieName, loc, oOptions.locCookieDays );
					doc.find( oOptions.locationLabelClass ).text(loc);
					callback();
					c.o.closeOverlay();
				}else{
					//geocode failed, notify user to try again
					console.log('geocode failed');
				}
			});
		}

		function askForLocation(){
			//show location input overlay
			c.o.initOverlay( doc.find('.overlay.location') );
		}

		function getLocation(){
			//check cookie
			var loc = self.getCookie( oOptions.locCookieName ),
				lat = self.getCookie( oOptions.latCookieName ),
				lng = self.getCookie( oOptions.lngCookieName );
			console.log(loc);
			if( lat === undefined || lng === undefined ){
				if( loc === undefined ){
					askForLocation();
				}else{
					geocode( loc );
				}
			}else{
				userLng = lng;
				userLat = lat;
				doc.find( oOptions.locationLabelClass ).text(loc);
				initMap( initMapCallback );
			}

		}

		function updateSelectorCache() {
			self.combinedSelectors.mapCanvas = doc.find( oOptions.mapCanvasClass );
		}

		function init( callback ){
			updateSelectorCache();
			initMapCallback = callback;

			nativeGeo = true;
			if( 'geolocation' in navigator ){
				navigator.geolocation.getCurrentPosition(
					function( pos ){
						console.log(pos);
						userLat = pos.coords.latitude;
						userLng = pos.coords.longitude;
						initMap( initMapCallback );
						//nativeGeo = true;
					},
					function( error ){
						//initMap( callback );
						console.log('location permission denied');
						getLocation();
					});
			}else {
				//initMap( callback );
				console.log('browser does not support geolocation');
				getLocation();
			}
		}

		doc.delegate( oOptions.locationInputBtnClass, clickEvt, function( e ){
			var loc = doc.find( oOptions.locationInputClass ).val();
			function callback(){
				initMap( initMapCallback );
			}
			//nativeGeo = true;
			geocode( loc, callback );
		});

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
