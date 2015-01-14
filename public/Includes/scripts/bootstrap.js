(function( w, $, Scrape, Map, Overlay ){
	"use strict";
	var c = new AppGlobal({
		modules: [
			{ 's': Scrape },
			{ 'm': Map },
			{ 'o': Overlay }
		]
	}),
	doc = $(document);
	//helper functions
	/*
	 * @func ajaxError: a default, universal error function that is used in ajax calls.
	 */
	function ajaxError( xhr, textStatus, errorThrown ){
		throw(xhr.statusText);
	}

	function updateRaces(){
		var s = encodeURIComponent($('.dateStart').val()),
			e = encodeURIComponent($('.dateEnd').val()),
			t = $('ul.race-type input[type="radio"]:checked').val();

		c.m.removeMarkers();
		c.m.getRaces( '/api/races/date/'+t+'/'+s+'/'+e, t );
	}

	c.addAction( 'getRaces', function( params ){
		//c.m.getRaces(params.url);
	});

	doc.ready(function(){
		c.m.init( updateRaces );

		if( String( window.location.href ).indexOf( 'admin' ) > -1 ){
			//c.s.init( 'http://bikereg.com' );
			c.s.init( 'http://'+doc.find( '.providerSelect option:selected' ).text() );
			console.log( 'http://'+doc.find( '.providerSelect option:selected' ).text() );
			console.log( c.s.site );
			doc.find( '.providerSelect' ).on( 'change', function( e ){
				c.s.init( 'http://'+doc.find( '.providerSelect option:selected' ).text() );
				console.log( 'http://'+doc.find( '.providerSelect option:selected' ).text() );
				console.log( c.s.site );
			});
		}

		var dt = new Date();
		doc.find('.dateStart').val( (dt.getMonth()+1)+'/'+dt.getDate()+'/'+(dt.getYear()+1900)  );
		doc.find('.dateEnd').val( (dt.getMonth()+3)+'/'+dt.getDate()+'/'+(dt.getYear()+1900) );
		doc.find('.datePicker').datepicker();

		doc.find('.dateStart, .dateEnd').on('change', function( e ){
			updateRaces();
		});
		doc.find('#radio-road, #radio-cx, #radio-mtb, #radio-track').on('click', function( e ){
			updateRaces();
		});
		doc.find('.distance').on('keydown', function( e ){
			if( e.keyCode === 13 ){
				updateRaces();
			}
		});
	});

	//listening
	//things that are clicked
	$('.ask-server').on('click', function( e ){
		e.preventDefault();
		$(this).callAction();
	});
	//things that loads and request ajax immediately on page load.
	$(window).on('load', function(){
		var onLoadClass = $('.on-load-ask-server');
		if( onLoadClass.length ){
			$( this.document.body ).callAction();
		}
	});

	w.c = c;


}( window, jQuery, Scrape, Map, Overlay ));
