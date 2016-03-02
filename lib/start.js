var express         = require( 'express' ),
    bodyParser      = require( 'body-parser' ),
    logger          = require( 'morgan' ),
    mongoose        = require( 'mongoose' ),
    db              = require( '../config/db' );

exports.launch      = function ( app ) {
    mongoose.connect( 'mongodb://' + db.user + ':' + db.pass + '@' + db.host + ':' + db.port + '/' + db.database );

    app.use( logger( 'dev' ) );
    app.use( bodyParser.json() );
    app.use( bodyParser.urlencoded({ extended : false }) );
};