var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;
var urlify = require( 'urlify' ).create({
    spaces: '-',
    toLower: true,
    nonPritable: '-',
    trim: true
});

/**
 * Race model Schema
 * @type {Schema}
 */
var RaceSchema = new Schema({
    name: { type: String, default: '' },
    race_type: { type: Number, default: 0 },
    race_date: { type: Date },
    reg_open_date: { type: Date },
    reg_close_date: { type: Date },
    location: { type: String, default: '' },
    location_lat: { type: Number, default: 0 },
    location_long: { type: Number, default: 0 },
    link: { type: String, default: '' },
    create_date: { type: Date, default: Date.now },
    status: { type: Number, default: 0 }
});

//turn off autoindexing. helps with performance in production
RaceSchema.set( 'autoIndex', false );

//allow getters to be run on all documents when converting to Objects & JSON
RaceSchema.set( 'toObject', { getters: true, virtuals: false } );
RaceSchema.set( 'toJSON', { getters: true, virtuals: false } );

//model instance methods
RaceSchema.methods = {
    findRaceByDate : function( callback ){
        this.model( 'Races' ).find( { race_date: this.race_date } ).exec( callback );
    },
    findRaceByLocation : function( callback ){
        this.model( 'Races' ).find( { location: this.location } ).exec( callback );
    },
    findRaceByStatus : function( callback ){
        this.model( 'Races' ).find( { status: this.status } ).exec( callback );
    }
};

//model static methods
RaceSchema.statics = {
    findById : function( id, callback ){
        this.findOne( { '_id': id } ).exec( callback );
    },
    findRaceByLink : function( link, callback ){
        this.findOne( { 'link': link } ).exec( callback );
    }
}

mongoose.model( 'Race', RaceSchema );
