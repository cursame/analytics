var express         = require( 'express' ),
    bodyParser      = require( 'body-parser' ),
    logger          = require( 'morgan' ),
    mongoose        = require( 'mongoose' ),
    db              = require( '../config/db' ),
    AuthHandler     = require( './auth' ),
    Utils           = require( './utils' );

exports.launch      = function ( app ) {
    var conn_str    = 'mongodb://';

    if ( db.user ) {
        conn_str    += db.user;
        if ( db.pass ) {
            conn_str    += ':' + db.pass;
        }

        conn_str    += '@';
    }
    conn_str        += db.host + ':' + db.port + '/' + db.database;

    mongoose.connect( conn_str );

    app.use( logger( 'dev' ) );
    app.use( bodyParser.json() );
    app.use( bodyParser.urlencoded({ extended : false }) );

    app.use( Utils.cors );

    app.use( AuthHandler.client );
    app.use( AuthHandler.permissions );
};