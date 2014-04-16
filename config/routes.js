
// controllers

var race = require(process.cwd() + '/controllers/race');
//var scraper = require( process.cwd() + '/controllers/scraper');
//var user = require(process.cwd() + '/controllers/user');
//var stubs = require(process.cwd() + '/controllers/stubs');

module.exports = function(app) {
  app.put( '/api/race', race.createRace );
  app.get( '/api/race/link/:link', race.findRaceByLink );
  app.get( '/api/race/:id', race.readRace );
  app.post( '/api/race/:id', race.updateRace );
  app.del( '/api/race/:id', race.deleteRace );
  app.get( '/api/races/status/:status', race.findRacesByStatus );
  app.get( '/api/races', race.readRaces );
  app.del( '/api/races', race.deleteAllRaces );

 // app.get( '/scraper/races', scraper.getRaces );

  app.get( '/admin', function( req, res ){
      res.render( 'admin' );
  });
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
