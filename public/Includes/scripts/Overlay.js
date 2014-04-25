(function ( $, w, AppGlobal ){
    "use strict";
    var func = new Function();

    func = function Overlay( oSettings ){
        var oOptions,
            clickEvt,
            self = this,
            doc = $(document),
            mobile = false;
        self.oDefaults = {
            overlaysClass: '.overlays',
            overlayLink: '.overlay-open',
            overlayCloseBtnClass: '.close',
            expandHitAreaClass: '.expand-hit-area'
        };
        //mix in the defaults and settings
        oOptions = $.extend( self.oDefaults, oSettings );
        //selector cache
        self.combinedSelectors = {};
        //caching commonly used elements
        self.combinedSelectors.overlays = doc.find( oOptions.overlaysClass );
        self.combinedSelectors.currentOverlay = $();
        self.combinedSelectors.overlayCloseBtn = $();
        self.combinedSelectors.expandHitAreas = $();
        self.combinedSelectors.expandedHitAreas = $();

        if( self.feature.test('orientation') ){
            clickEvt = 'touchend';
            mobile = true;
        }else{
            clickEvt = 'click';
        }
        //helper functions

        function trashCollection(){
            //unbind event listeners
            self.combinedSelectors.overlayCloseBtn.off( clickEvt, closeOverlay );

            self.combinedSelectors.overlayCloseBtn = $();
            self.combinedSelectors.expandHitAreas = $();
            self.combinedSelectors.expandedHitAreas = $();
        }

        function closeOverlay(){
            self.combinedSelectors.currentOverlay.hide();
            trashCollection();
        }

        function updateSelectorCache(){
            self.combinedSelectors.overlayCloseBtn = self.combinedSelectors.currentOverlay.find( oOptions.overlayCloseBtnClass );
            self.combinedSelectors.expandHitAreas = self.combinedSelectors.currentOverlay.find( oOptions.expandHitAreaClass );
        }

        function expandHitAreas(){
            var ha, haContainer, obj, evts, w, h, x, y, i = 0, margin;
            haContainer = $(document.createElement('div'));
            self.combinedSelectors.expandedHitAreas = haContainer;
            self.combinedSelectors.currentOverlay.append( self.combinedSelectors.expandedHitAreas );
            for( i; i < self.combinedSelectors.expandHitAreas.length; i++ ){
                obj = $(self.combinedSelectors.expandHitAreas[i]);
                if( obj.hasClass( 'prev' ) || obj.hasClass( 'next' ) || obj.hasClass( 'menu' ) || obj.hasClass( 'close' ) ){
                    w = obj.width();
                    h = obj.height();
                    x = obj.position().left;
                    y = obj.position().top;

                    ha = $(document.createElement('span'));
                    margin = parseInt(obj.css('margin-left'), 10);
                    ha.addClass( 'expanded' );

                    evts = $._data( obj[0], 'events' );
                    if( evts != undefined ){
                        obj.off( clickEvt, evts[clickEvt][0].handler.name );
                        ha.on( clickEvt, evts[clickEvt][0].handler );
                    }
                    haContainer.append( ha );

                    ha.width( w*2.5 );
                    ha.height( h*1.5);
                    ha.css({ 'margin-left': -(w*.75), 'margin-top': -(h*.5),
                        'padding-left': (w*.5), 'padding-top': (h*.5),
                        'left': x+margin, 'top': y });
                }
            }
        }

        function initOverlay( cOverlay ){
            self.combinedSelectors.currentOverlay = cOverlay;
            updateSelectorCache();

            //bind event listeners
            self.combinedSelectors.overlayCloseBtn.on( clickEvt, closeOverlay );

            //show overlay
            self.combinedSelectors.currentOverlay.show();

            //expand hit areas
            if( mobile ){
                setTimeout( function(){
                        expandHitAreas();
                }, 500);
            }
        }

        //click on overlay link
        doc.delegate( oOptions.overlayLink, clickEvt, function( e ){
            e.preventDefault();
            var oThis = $(this),
                name = '.'+oThis.data('overlay');
            initOverlay( self.combinedSelectors.overlays.find( name ) );
        });

        return {
            initOverlay: initOverlay,
            closeOverlay: closeOverlay
        }

    };
    func.prototype = AppGlobal.prototype;
    func.prototype.constructor = function Overlay(){ return false; };
    w.Overlay = func;
}( jQuery, window, AppGlobal ));
