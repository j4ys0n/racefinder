//temp - for IE 7,8
(function ( $, w ){
	"use strict";
	var proto = {
		//helper
		/*
		 * @func qSelectors: query for a list of jQuery objects defined in @param array.
		 * @param name: the name you want to save the query as.
		 * @param array: an array of selectors you want to query.
		 * @param optional format: the format you want the function to return immeidately.
		 */
		qSelectors: function( name, array, format ){
			var firstItem = $(array[ (array.length-1) ]),
				i;
			for( i = (array.length-1); i >= 0; i -= 1 ){
				firstItem = firstItem.add( array[i] );
			}
			//saving the results of the query in string and jQuery Object
			this.combinedSelectors[ name ] = {
				s: array.join(', '),
				j: firstItem
			};
			if( format === 's' ){
				//if we want a string
				return this.combinedSelectors[ name ].s;
			}
			return this.combinedSelectors[ name ].j;
		},
		/*
		 * @func createMarkup: creates mark up based on parameter.
		 * @param { string } type: the element type
		 * @param { obj } parent: the parent element that the result item will be appended to.
		 * @param { object } oAttr: an object that contains all the attributes of the element. oAttr takes key/value pairs ( className: 'classname'). data attributes, use the following key: object syntax. ( ex. dataset: { test: 'testvalue' } creates data-test="testvalue" ). Do not user oAttr to apply style, use CSS to do that.
		 * @param { boolean } returnObject: if set to true, the new element will be returned.
		 * @param { boolean } manualAppend: if set to true and parent is not defined, the new element will not be appended to the parent.
		 */
		createMarkup: function( oParam ){
			var newEl = document.createElement( oParam.el ),
				oParent = oParam.parent,
				manualAppend = oParam.manualAppend || false,
				item,
				data;
			//if parent is an $ obj, get the el from the array
			if( oParam.parent instanceof jQuery ){
				oParent = oParam.parent[ 0 ];
			}
			if( oParam.oAttr ){
				for( item in oParam.oAttr ){
					if( oParam.oAttr.hasOwnProperty( item ) ){
						//we will deal with "style" later
						if( item !== 'style' || item !== 'dataset' ){
							//copy over the attr
							newEl[ item ] = oParam.oAttr[ item ];
						}
					}
				}
				//handle style
				for( data in oParam.oAttr.dataset ){
					if( oParam.oAttr.dataset.hasOwnProperty( data ) ){
						newEl.setAttribute( 'data-page', oParam.oAttr.dataset[ data ] );
					}
				}
			}
			//if a parent is defined OR if manualAppend is set to false ( default )
			if( oParent || !manualAppend ){
				oParent.appendChild( newEl );
			}

			if( oParam.returnObject ){
				return newEl;
			}
		},
		getElementType: function( obj ){
			if( obj instanceof $ ){
				return obj[0].tagName.toLowerCase();
			}
			return obj.nodeName.toLowerCase();
		},
		feature: {
			test: function( feature ){
				if( w[feature] === undefined ){
					return false;
				}
				return true;
			}
		},
		setCookie: function( cookieName, cookieVal, lifespanInDays, validDomain ){
			var domainStr = validDomain ? ("; domain=" + validDomain) : '' ;
			document.cookie = cookieName + "=" + encodeURIComponent( cookieVal ) + "; max-age=" + ( 60 * 60 * 24 * parseInt( lifespanInDays, 10 ) ) + "; path=/" + domainStr ;
		},
		getCookie: function( cookieName ){
			var cookieStr = document.cookie;

			if (cookieStr.length != 0) {
				var cookieVal = cookieStr.match( '(^|;)[\\s]*' + cookieName + '=([^;]*)' );
				if( cookieVal !== null ){
					return decodeURIComponent( cookieVal[2] );
				}else{
					return undefined;
				}
			}
			return undefined;
		}
	};
	function AppGlobal( oOptions ){
		var RACEFINDER  = {},
			oDefaults = {
				modules: []
			},
			oSettings = $.extend( oDefaults, oOptions ),
			modName = [],
			modInst = [],
			oReturn = {},
			self = this,
			doc = $(document),
			actMod,
			instantiateDeferred,
			i, j, k;
		/*
		 * @func askServer: an ajax wrapper to request information from server.
		 * @param num interval (optional): this is the window where we wait for the ahax to respond, if the interval expires and ajax call is still incomplete, we will send an error.
		 * @param all $.ajax param apply.
		 */
		function ajaxWrapper( oSettings ){
			var oAjaxDefaults = {
				url: '',
				type: 'GET',
				timeout: 45000,
				data: {},
				beforeSend: function(){ },
				success: function(){ return false; },
				error: function(){ return false; },
				complete: function(){ return false; }
			},
			oAjaxOptions = $.extend( oAjaxDefaults, oSettings );
			//if there is a continue, disable it until the request is complete
			$.ajax({
				dataType: oAjaxOptions.dataType,
				url: oAjaxOptions.url,
				type: oAjaxOptions.type,
				timeout: oAjaxOptions.timeout,
				data: oAjaxOptions.data,
				beforeSend: oAjaxOptions.beforeSend,
				success: oAjaxOptions.success,
				error: oAjaxOptions.error,
				complete: oAjaxOptions.complete,
				cache: false,
				async: true
			});
		}
		//@func getModInfo: get module name and store it for later use.
		function getModInfo( obj ){
			var item;
			for( item in obj ){
				if( obj.hasOwnProperty( item ) ){
					modName.push(  item  );
					modInst.push( obj[ item ] );
				}
			}
		}
		//@func checkModType: check to see if included module exist. if it is not instantiated, it will instantiate it.
		function checkModType(){
			instantiateDeferred = $.Deferred();

			for( i = modInst.length-1; i >= 0; i -= 1 ){
				if( modInst[ i ] instanceof Function ){
					actMod[ modName[i] ] = new modInst[ i ]();
				}
				else if ( typeof modInst[ i ] === 'object' ){
					actMod[ modName[i] ] = new modInst[ i ].constructor( modInst[ i ].settings );
				}
			}
			instantiateDeferred.resolve( true );
			return instantiateDeferred.promise();
		}
		//@func core: iterate through valid plugins and run init functions
		function core(){
			for( j = actMod.length-1; j >= 0; j -= 1 ){
				if( actMod[ j ].init instanceof Function ){
					actMod[ j ].init();
				}
			}
		}
		this.actionChannals = {
			processAjax: function( param ){
				//helper
				/*
				 * @func generateCallback: generates a callback based on the supplied param in the markup before feeding it into our ajax wrapper.
				 */
				function generateCallback( callBackType ){
					var actionType,
						action,
						augRes; //augmented
					if( typeof param[ callBackType ] !== 'string'){
						return false;
					}
					actionType = param[ callBackType ].split('>')[0];
					action = param[ callBackType ].split('>')[1];
						if( actionType === 'event' ){
						param[ callBackType ] = function( res ){
							augRes = $.extend( res, { triggeredBy: param.triggeredBy });
							self.actionChannals[ action ]( augRes );
						};
					}
					else if( actionType === 'redirect' ){
						param[ callBackType ] = function(){
							window.location = 'http://'+action;
						};
					}
				}
				//only generate callbacks when members as such is set in the param.
				if( param.success || param.error || param.beforeSend || param.complete ){
					generateCallback( 'success' );
					generateCallback( 'error' );
					generateCallback( 'beforeSend' );
					generateCallback( 'complete' );
				}
				ajaxWrapper( param );
			}
		};
		this.oDefaults = {
			RACEFINDER: RACEFINDER
		};

		this.oDefaults.RACEFINDER.actMod = this.oDefaults.RACEFINDER.actMod || {};
		actMod = this.oDefaults.RACEFINDER.actMod;

		//decorating $ elements so that it has its native callAction. That way we don't have to do "oThis.data('action')" for all the events.
		$.prototype.callAction = function(){
			var q = this.data('action').split('(') || this.parent().data('action').split('('),
				act = q[0],
				param = (function(){
					var temp;
					//if there are more than 1 members in the array, it means that the action has param.
					if( q.length > 1 ){
						//we extract the content of the param here.
						temp = q[1].split(')')[0];
						//we test to see if it is an object param by detecting the existance of '{';
						if( q[1].match(/\{/i) ){
							temp = temp.replace(/\s/g,'');
							temp = temp.replace(/(,|\:)/g, '\"$1\"');
							temp = temp.replace(/(\{)/g, '$1\"');
							temp = temp.replace(/(\})/g, '\"$1');
							//at this point, we have successfully created a JSON obj, which we will return to param;
							return JSON.parse( temp );
						}
						return temp;
					}
					return {};
				}());
				//to cater to forms and buttons, we detect to see if the clicked item is a button, if so, we add a 'form' member to the param so that actionChannals() is aware that it will run the resulting action as form.submit();
				if( this.attr('type') === 'button' ){
					param.form = this.parents('form');
				}
				param.triggeredBy = this;
				if( !this.hasClass('btn-disabled') ){
					//after getting the function/action and the paramter, we run the action form the action chain.
					self.actionChannals[ act ].apply( this, [param] );
				}
			return this;
		};

		//iterate through modules to see if things have been instantiated. If they are not, we will instantiate them and store it in attribute.modules.
		for( k = oSettings.modules.length-1; k >= 0; k -= 1 ){
			getModInfo( oSettings.modules[ k ] );
		}
		checkModType().then(function( res ){
			if( res ){
				core();
			}
		});
		//adding two private functions to the return object.
		oReturn = $.extend( actMod, {
			addAction: function( act, func, param ){
				self.actionChannals[ act ] = function( param ){
					doc.on( act, func.apply( this, [ param ] ) );
				};
				return this;
			},
			/*
			 * @func askServer: this is the ask server that is exposed so that users can run askServer in the channal manually. For example, if you wish to apply a layer of logic before asking the server, you could add a new action to the channel, run the logic and then use this function to run the server.
			 */
			askServer: function( param ){
				self.actionChannals.processAjax.apply( this, [param] );
				return this;
			},
			getElementType: this.getElementType,
			featureTest: this.feature.test
		});

		return oReturn;

	}
	AppGlobal.prototype = proto;
	w.AppGlobal = AppGlobal;

}( jQuery, window ));
