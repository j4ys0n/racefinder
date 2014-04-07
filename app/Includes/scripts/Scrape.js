(function ( $, w, AppGlobal ){
    "use strict";
    var func = new Function();

    func = function Scrape( oSettings ){
        var oOptions,
            clickEvt,
            scrollEvt,
            self = this,
            wdw = $(w),
            site,
            page = 1;
        self.oDefaults = {
            targetContentStart: 'ctl00_ContentPlaceHolder1_pnlResults',
            targetContentStop: 'ctl00_ContentPlaceHolder1_searchLoad',
            states: Array('AK','AL','AR','AS','AZ','CA','CO','CT','DC','DE','FL','GA','GU','HI','IA','ID','IL','IN','KS','KY','LA','MA','MD','ME','MH','MI','MN','MO','MS','MT','NC','ND','NE','NH','NJ','NM','NV','NY','OH','OK','OR','PA','PR','PW','RI','SC','SD','TN','TX','UT','VA','VI','VT','WA','WI','WV','WY')
        };


        //mix in the defaults and settings
        oOptions = $.extend( self.oDefaults, oSettings );
        //selector cache
        self.combinedSelectors = {};



        //helpers
        function trimStr( str ){
            return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        }

        function formatData( obj ){
            var items = obj.find('.searchResults .eventList .calItem'),
                i = 0, j = 0,
                month,
                day,
                location,
                locArray = [],
                state,
                link;

            for( i; i < items.length; i++ ){
                month = trimStr( $(items[i]).find('.month')[0].innerText );
                day = parseInt( trimStr( $(items[i]).find('.day')[0].innerText ), 10 );
                location = trimStr( $(items[i]).find('.eventInfo span')[0].innerText );
                link = $(items[i]).find('.evtlink').attr('href').replace('../..', site);
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
                console.log(month, day, location, link);
            }

        }

        function getPage(){
            var url = '/Includes/scripts/proxy.php?url='+site+'/events/Road-Races/';
            $.getJSON( url, function(data){
                var res = data.contents,
                    start = -1,
                    end = -1;
                start = res.indexOf('<div id="'+oOptions.targetContentStart+'"');
                end = res.indexOf('<div id="'+oOptions.targetContentStop+'"')
                //start = res.match( '<div id=\\"ctl00_ContentPlaceHolder1_pnlResults\\" \\b[^>]*>' );
                res = $(res.substring( start, end ));
                formatData( res );
            } );
        }

        function init( s ){
            site = s;
            getPage();
        }

        return {
            init: init
        };
    };
    func.prototype = AppGlobal.prototype;
    func.prototype.constructor = function Scrape(){ return false;};
    w.Scrape = func;
}( jQuery, window, AppGlobal ));
