var mongoose = require( 'mongoose' );
var Scraper = mongoose.model( 'Scraper' );
var Response = require( process.cwd() + '/lib/response' );

module.exports = {
    self: {},
    site: 'http://bikereg.com',
    page: 1,
    oDefaults: {
        targetContentStart: 'ctl00_ContentPlaceHolder1_pnlResults',
        targetContentStop: 'ctl00_ContentPlaceHolder1_searchLoad',
        states: Array('AK','AL','AR','AS','AZ','CA','CO','CT','DC','DE','FL','GA','GU','HI','IA','ID','IL','IN','KS','KY','LA','MA','MD','ME','MH','MI','MN','MO','MS','MT','NC','ND','NE','NH','NJ','NM','NV','NY','OH','OK','OR','PA','PR','PW','RI','SC','SD','TN','TX','UT','VA','VI','VT','WA','WI','WV','WY')
    },
    trimStr: function( str ){
        return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    },
    formatData: function( req, res ){

    },
    getPage: function( s ){

    },
    getRaces: function( req, res ){
        self = module.exports;
        //self.getPage( self.site );
    
    }
};
