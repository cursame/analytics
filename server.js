var express         = require( 'express' ),
    app             = express(),
    debug           = require( 'debug' )( 'app' ),
    error           = require( './lib/error' ),
    start           = require( './lib/start' );

// Set the PORT and ENV variables and start the server
app.set( 'port', process.env.PORT || 3000 );
app.set( 'env', process.env.ENV || 'development' );

start.launch( app );

var applications    = require( './routers/applications' ),
    assignments     = require( './routers/assignments' ),
    comments        = require( './routers/comments' ),
    discussions     = require( './routers/discussions' ),
    courses         = require( './routers/courses' ),
    sessions        = require( './routers/sessions' ),
    users           = require( './routers/users' );

app.use( '/applications', applications );
app.use( '/assignments', assignments );
app.use( '/comments', comments );
app.use( '/discussions', discussions );
app.use( '/courses', courses );
app.use( '/sessions', sessions );
app.use( '/users', users );

app.use( error.notFound );
app.use( error.handler );

var server  = app.listen( app.get('port'), function() {
    debug( 'Express server listening on port ' + server.address().port );
});

module.exports      = app;