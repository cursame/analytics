var express         = require( 'express' ),
    bodyParser      = require( 'body-parser' ),
    logger          = require( 'morgan' );

exports.launch      = function ( app ) {
    app.use( logger( 'dev' ) );
    app.use( bodyParser.json() );
    app.use( bodyParser.urlencoded({ extended : false }) );
};