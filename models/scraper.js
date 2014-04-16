var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;
var urlify = require( 'urlify' ).create({
    spaces: '-',
    toLower: true,
    nonPrintable: '-',
    trim: true
});

/*
 * Scraped data model Schema
 * @type {Schema}
 */
var ScrapedSchema = new Schema({
    raw_data: {type: String, default: '' },
    create_date: { type: Date, default: Date.now }
});

//turn off autoindexing. helps with performance in production
ScrapedSchema.set( 'autoIndex', false );

//allow getters to be run on all documents when converting to Objects & JSON
ScrapedSchema.set( 'toObject', { getters: true, virtuals: false } );
ScrapedSchema.set( 'toJSON', {getters: true, virtuals: false } );

//model instance methods
ScrapedSchema.methods = {
    findRawByDate: function( callback ){
        this.model( 'Scraped' ).find( { created_date: this.created_date } ).exec( callback );
    }
}

//model static methods
ScrapedSchema.statics = {
    findById: function( id, callback ){
        this.findOne( { '_id': id } ).exec( callback );
    }
}

mongoose.model( 'Scraper', ScrapedSchema );
