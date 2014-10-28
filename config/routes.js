
// controllers

var race = require( __dirname + '/../controllers/race' );
//var scraper = require( process.cwd() + '/controllers/scraper');
//var user = require(process.cwd() + '/controllers/user');
//var stubs = require(process.cwd() + '/controllers/stubs');

module.exports = function(app) {
  app.get( '/letter-to-crca', function( req, res ){
     res.render( 'crca' ); 
  });
  //app.put( '/api/race', race.createRace );
  //app.put( '/api/races', race.createRaces );
  app.get( '/api/race/link/:link', race.findRaceByLink );
  app.get( '/api/race/:id', race.readRace );
  //app.post( '/api/race/:id', race.updateRace );
  //app.del( '/api/race/:id', race.deleteRace );
  app.get( '/api/races/status/:status', race.findRacesByStatus );
  app.get( '/api/races/type/:type', race.findRacesByType );
  app.get( '/api/races/date/:type/:start/:end', race.findRacesByDates );
  app.get( '/api/races/dist/:type/:start/:end/:dist/:lat/:lng', race.findRacesByDistance );
  app.get( '/api/races/ds/:status/:dist/:lat/:lng', race.findRacesByDistanceAndStatus );
  app.get( '/api/races', race.readRaces );
  //app.del( '/api/races/status/:status', race.deleteRacesByStatus );
  //app.del( '/api/races', race.deleteAllRaces );

  //special
  //app.post( '/api/special/addloc', race.addLoc );


 // app.get( '/scraper/races', scraper.getRaces );

  // app.get( '/admin', function( req, res ){
  //     res.render( 'admin' );
  // });
  app.get( '/', function( req, res ){
      res.render( 'index' );
  });

  // app.put('/user', user.createUser);
  // app.get('/user/:id', user.readOneUser);
  // app.post('/user/:id', user.updateUser);
  // app.del('/user/:id', user.deleteUser);
  // app.get('/users/:page', user.readManyUsers);

  // app.get('/stubs', stubs.populate);
};
