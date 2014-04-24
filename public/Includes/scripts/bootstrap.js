(function( w, $, Scrape, Map ){
	"use strict";
	var c = new AppGlobal({
		modules: [
			{ 's': Scrape },
			{ 'm': Map }
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

	c.addAction( 'getRaceRSS', function( param ){

		//c.s.init( 'http://bikereg.com' );

		//console.log( 'http://www.bikereg.com/events/rssfeed.asp?et=1&rg=0&ns=&ne=50&pid=&states=' );
		/*c.askServer({
			trigger: param.triggeredBy,
			url: '/Includes/scripts/proxy.php?url=http://www.bikereg.com/events/rssfeed.asp?et=1&rg=0&ns=&ne=50&pid=&states=',
			success: function( res, textStatus, xhr ){
				console.log( res );
			},
			error: function( xhr, textStatus, errorThrown ){
				throw( xhr );
			}
		});*/

		/* RSS Feed removed from bikereg.com
		var url = '/Includes/scripts/proxy.php?url=http://www.bikereg.com/events/rssfeed.asp?et=1&rg=0&ns=&ne=50&pid=&states=NY';
		$.getJSON( url, function(data){
			var res = $.parseXML( data.contents );
			//$data = $( res );
			//console.log( $(res).find('item'));
			$(res).find('item').each( function(){
				var str = $(this).find('title')[0].innerHTML;
				//console.log( str );
				var n = str.lastIndexOf('-');
				var sub = str.substring(n+2);
				console.log(sub);
				setTimeout(function(){
					c.m.addMarker(sub);
				}, 1000);

			} )
		} );*/
	} );

	c.addAction( 'getRaces', function( params ){
		//c.m.getRaces(params.url);
	})

	doc.ready(function(){
		c.m.init( updateRaces );
		c.s.init( 'http://bikereg.com' )

	})

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
		var dt = new Date()
		$('.dateStart').val( (dt.getMonth()+1)+'/'+dt.getDate()+'/'+(dt.getYear()+1900)  );
		$('.dateEnd').val( (dt.getMonth()+2)+'/'+dt.getDate()+'/'+(dt.getYear()+1900) );
		$('.datePicker').datepicker();

		//updateRaces();

		$('.dateStart, .dateEnd').on('change', function( e ){
			updateRaces();
		});
		$('#radio-road, #radio-cx, #radio-mtb, #radio-track').on('click', function( e ){
			updateRaces();
		})

	});

	w.c = c;


}( window, jQuery, Scrape, Map ));
