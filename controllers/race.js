var mongoose = require( 'mongoose' );
var Race = mongoose.model( 'Race' );
var Response = require( __dirname + '/../lib/Response' );

module.exports = {
    createRace: function( req, res ){
        var race = new Race( req.body );
        delete race.id;
        race.save( function( err, race ){
            res.json( Response.code( err, race ), Response.data( err, race ) );
        });
    },

    createRaces: function( req, res ){
        var races = req.body.data,
            i = 0;
        for( i; i < races.length; i++ ){
            var race = new Race( races[i] );
            race.save();
        }
    },

    readRace: function( req, res ){
        var id = decodeURIComponent( req.params.id );
        Race.findById( id ).exec( function( err, race ){
            res.json( Response.code( err, race ), Response.data( err, race ) );
        });
    },

    findRaceByLink: function( req, res ){
        var link = decodeURIComponent( req.params.link );
        /*Race.findRaceByLink( link ).exec( function( err, race ){
            res.json( Response.code( err, race ), Response.data( err, race ) );
        });*/
        Race.find( { 'link': link } ).exec( function( err, race ){
            res.json( Response.code( err, race ), Response.data( err, race ) );
        });
    },

    readRaces: function( req, res ){
        var page = decodeURIComponent( req.params.page );
        var limit = 20;
        var offset = ( page - 1 ) * limit;

        Race.find({ 'race_date': { '$gte': new Date() } })
            //.skip( offset )
            //.limit( limit )
            .exec( function( err, races ){
                res.json( Response.code( err, races ), Response.data( err, races ) );
            });
    },

    findRacesByStatus: function( req, res ){
        var status = decodeURIComponent( req.params.status );
        Race.find( { 'status': status } ).exec( function( err, race ){
            res.json( Response.code( err, race ), Response.data( err, race ) );
        });
    },

    findRacesByType: function( req, res ){
        var t = decodeURIComponent( req.params.type );
        Race.find( { 'race_type': t, 'race_date': { '$gte': new Date() } } )
            .exec( function( err, race ){
            res.json( Response.code( err, race ), Response.data( err, race ) );
        });
    },

    findRacesByDates: function( req, res ){
        var t = decodeURIComponent( req.params.type ),
            s = new Date(decodeURIComponent( req.params.start )),
            e = new Date(decodeURIComponent( req.params.end ));

            console.log(s, e)

        Race.find( { 'race_type': t, 'race_date': { '$gte': s, '$lt': e } } )
            .exec( function( err, race ){
            res.json( Response.code( err, race ), Response.data( err, race ) );
        });
    },

    updateRace: function( req, res ){
        var id = decodeURIComponent( req.params.id );
        var updates = {
            $set: {},
            $push: {}
        };
        var updateMap = {
            $set: ['name', 'race_type', 'race_date', 'reg_open_date',
                'reg_close_date', 'location', 'location_lat',
                'location_long', 'link', 'create_date', 'status']
        }

        for( var action in updateMap ){
            if( updateMap.hasOwnProperty( action ) ){
                updateMap[action].forEach( function( element, index, array ){
                    if( req.body[element] ){
                        updates[action][element] = req.body[element];
                    }
                });
            }
        }

        Race.findByIdAndUpdate( id, updates, function( err, race ){
            res.json( Response.code( err, race ), Response.data( err, race ) );
        });
    },

    deleteRace: function( req, res ){
        var id = decodeURIComponent( req.params.id );
        Race.findOneAndRemove( { _id: id }, function( err, race ){
            res.json( Response.code( err, race ), Response.data( err, race ) );
        });
    },

    deleteAllRaces: function( req, res ){
        Race.remove( {}, function( err, race ){
            res.json( Response.code( err, race ), Response.data( err, race ) );
        });
    }
};
