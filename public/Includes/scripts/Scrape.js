(function ( $, w, AppGlobal ){
    "use strict";
    var func = new Function();

    func = function Scrape( oSettings ){
        var oOptions,
            clickEvt,
            scrollEvt,
            self = this,
            wdw = $(w),
            doc = $(document),
            site,
            endPoint,
            raceType = 0,
            page = 1,
            racesReturned = 0,
            racesUnique = 0,
            racesGeocoded = 0;
        self.oDefaults = {
            contentType: 'application/json; charset=utf-8',
            targetContentStart: 'ctl00_ContentPlaceHolder1_pnlResults',
            targetContentStop: 'ctl00_ContentPlaceHolder1_searchLoad',
            states: Array('AK','AL','AR','AS','AZ','CA','CO','CT','DC','DE','FL','GA','GU','HI','IA','ID','IL','IN','KS','KY','LA','MA','MD','ME','MH','MI','MN','MO','MS','MT','NC','ND','NE','NH','NJ','NM','NV','NY','OH','OK','OR','PA','PR','PW','RI','SC','SD','TN','TX','UT','VA','VI','VT','WA','WI','WV','WY'),
            months: Array('jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'),
            copy: {
                working: 'Working...',
                getDataBtn: 'Get Race Data'
            },
            watch: {
                endPointInputClass: '.endPoint',
                getDataBtnClass: '.getDataBtn',
                processDataBtnClass: '.processDataBtn',
                racesReturned: '.results .returned',
                racesUnique: '.results .unique',
                racesGeocoded: '.results .geocoded'
            }
        };


        //mix in the defaults and settings
        oOptions = $.extend( self.oDefaults, oSettings );
        //selector cache
        self.combinedSelectors = {};

        if( self.feature.test('orientation') ){
			clickEvt = 'touchend';
		}else{
			clickEvt = 'click';
		}


        //helpers
        function trimStr( str ){
            return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        }

        function monthStrToNum( m ){
            return oOptions.months.indexOf( m.toLowerCase() )+1;
        }

        function processData(){
            //get new data
            function updateRace( race ){
                var req = $.ajax({
                    contentType: oOptions.contentType,
                    url: '/api/race/'+race._id,
                    type: 'POST',
                    data: JSON.stringify( race ),
                    dataType: 'json',
                    success: function(){
                        //update count
                        racesGeocoded++;
                        $( oOptions.watch.racesGeocoded ).text( racesGeocoded );
                        //add race marker to map
                        c.m.addMarker( race );
                    }
                });
                req.done(function( msg ){
                    console.log( msg );
                });
            }

            function geocode( race ){
                c.m.geocoder.geocode( { address: race.location }, function( res, status ){
                    var coords;
                    if( status === google.maps.GeocoderStatus.OK ){
                        coords =  res[0].geometry.location;
                        race.coords[1] = coords.k;
                        race.coords[0] = coords.A;
                        race.status = 1;
                        updateRace( race );
                    }else{
                        coords =  -1;
                    }
                });
            }

            function getCoords( races ){
                races = races.data;
                console.log( races );
                var i = 0;
                for( i; i < races.length; i++ ){
                    var race = races[i];
                    geocode( race );

                }
            }

            $.ajax({
                contentType: oOptions.contentType,
                url: '/api/races/status/0',
                type: 'GET',
                success: getCoords
            });
        }

        function saveRace( item ){
            var req = $.ajax({
                contentType: oOptions.contentType,
                url: '/api/race',
                type: 'PUT',
                data: JSON.stringify( item ),
                dataType: 'json'
            });
            req.done(function( msg ){
                //console.log(msg)
            });
            req.fail(function( jqXHR, textStatus ) {
                console.log( "Request failed: " + textStatus );
            });
        }

        function checkUnique( item ){
            var req = $.ajax({
                contentType: oOptions.contentType,
                url: '/api/race/link/'+encodeURIComponent( item.link ),
                type: 'GET',
                success: function( res ){
                    if( res.data.length === 0 ){
                        saveRace( item );
                        //update unique count
                        racesUnique++;
                        $( oOptions.watch.racesUnique ).text( racesUnique );
                    }else{
                        //console.log( 'already in database' );
                    }
                }
            });
            req.done(function( msg ){
                //console.log( msg );
            });
            req.fail(function( jqXHR, textStatus ) {
                console.log( "Request failed: " + textStatus );
            });
        }

        function formatData( obj ){
            var items = obj.find('.searchResults .eventList .calItem'),
                i = 0, j = 0,
                month,
                day,
                year = 14,
                location,
                locArray = [],
                state,
                linkObj,
                link,
                name,
                item;

            //update count
            racesReturned = items.length;
            $( oOptions.watch.racesReturned ).text( racesReturned );

            for( i; i < items.length; i++ ){
                month = trimStr( $(items[i]).find('.month')[0].innerText );
                day = parseInt( trimStr( $(items[i]).find('.day')[0].innerText ), 10 );
                location = trimStr( $(items[i]).find('.eventInfo span')[0].innerText );
                linkObj = $(items[i]).find('.evtlink');
                if( linkObj.attr('href').indexOf('../../..') > -1 ){
                    link = linkObj.attr('href').replace('../../..', site);
                }else if( linkObj.attr('href').indexOf('../..') > -1 ){
                    link = linkObj.attr('href').replace('../..', site);
                }else{
                    link = linkObj.attr('href').replace('..', site);
                }

                name = linkObj.text();
                //var m = '<span\\b[^>]*>(?:\\D)(.*)</span>';

                //handle multiple locations
                locArray = location.split(', ');
                state = locArray[locArray.length-1];
                if( location.substring( 0, (location.indexOf(', '+state)-1) ).indexOf(',') > -1 ){
                    location = location.replace( ', '+state, '' );
                    locArray = location.split(',');
                    for( j = 0; j < locArray.length; j++ ){
                        locArray[j] = trimStr(locArray[j])+', '+state;
                    }
                    location = locArray;
                }
                if( typeof location === 'string' && location.substring( 0, (location.indexOf(', '+state)-1) ).indexOf('/') > -1 ){
                    location = location.replace( ', '+state, '' );
                    locArray = location.split('/');
                    for( j = 0; j < locArray.length; j++ ){
                        locArray[j] = trimStr(locArray[j])+', '+state;
                    }
                    location = locArray;
                }
                item = {}
                item.name = name;
                item.race_date = monthStrToNum(month)+'/'+day+'/'+year;
                item.location = location;
                item.link = link;
                item.race_type = $('.raceType').val();

                checkUnique( item );
                //saveRace( item );
            }

        }

        function getPage(){
            var url = 'http://'+w.location.hostname+':8001/Includes/scripts/proxy.php?url='+encodeURIComponent(site+endPoint);
            $.ajax({
                dataType: 'json',
                url: url,
                type: 'POST',
                data: $('#bikeregForm').serialize(),
                success: function(data){
                    var res = data.contents,
                        start = -1,
                        end = -1;
                    start = res.indexOf('<div id="'+oOptions.targetContentStart+'"');
                    end = res.indexOf('<div id="'+oOptions.targetContentStop+'"')
                    //start = res.match( '<div id=\\"ctl00_ContentPlaceHolder1_pnlResults\\" \\b[^>]*>' );
                    res = $(res.substring( start, end ));
                    console.log(res);
                    formatData( res );
                    //enable button
                    $( oOptions.watch.getDataBtnClass ).text( oOptions.copy.getDataBtn ).removeAttr('disabled');
                }
            })
            .fail( function( jqXHR, status, error ){
                console.log(jqXHR)
            });

            //update interface
            racesReturned = 0;
            racesUnique = 0;
            racesGeocoded = 0;
            $( oOptions.watch.racesReturned ).text( racesReturned );
            $( oOptions.watch.racesUnique ).text( racesUnique );
            $( oOptions.watch.racesGeocoded ).text( racesGeocoded );
        }

        function init( s ){
            site = s;
            //getPage();
        }

        doc.delegate( oOptions.watch.getDataBtnClass, clickEvt, function( e ){
            endPoint = $( oOptions.watch.endPointInputClass ).val();
            $('#ctl00_ContentPlaceHolder1_numMiles_ClientState').val( {'enabled': true, 'emptyMessage': 'miles', 'validationText': '"'+$('.miles').val()+'"', 'valueAsString': '"'+$('.miles').val()+'"','minValue':-70368744177664,'maxValue':70368744177664} )
            getPage();
            $( this ).text( oOptions.copy.working ).attr( 'disabled', 'disabled' );
            console.log( decodeURIComponent($('#bikeregForm').serialize()) );
        })
        .delegate( oOptions.watch.endPointInputClass, 'keydown', function( e ){
            if( e.keyCode === 13 ){
                endPoint = $( this ).val();
                getPage();
                $( oOptions.watch.getDataBtnClass ).text( oOptions.copy.working ).attr( 'disabled', 'disabled' );
            }
        })
        .delegate( oOptions.watch.processDataBtnClass, clickEvt, function( e ){
            processData();
        });

        return {
            init: init
        };
    };
    func.prototype = AppGlobal.prototype;
    func.prototype.constructor = function Scrape(){ return false;};
    w.Scrape = func;
}( jQuery, window, AppGlobal ));
