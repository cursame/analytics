var crypto          = require( 'crypto' ),
    config          = require( '../config/app' ),
    Application     = require( '../models/application' ),
    Encrypt         = require( './encrypt' );

exports.client      = function( req, res, next ) {
    var consumer    = ( req.body.consumer ) ? req.body.consumer : ( req.query.consumer ) ? req.query.consumer : null,
        timestamp   = ( req.body.timestamp ) ? req.body.timestamp : ( req.query.timestamp ) ? req.query.timestamp : null,
        signature   = ( req.body.signature ) ? req.body.signature : ( req.query.signature ) ? req.query.signature : null,
        shasum      = crypto.createHash( 'sha1' );

    Application.findById( consumer, function ( err, application ) {
        if ( err || !application ) {
            var err     = new Error( 'Invalid consumer' );
            err.status  = 401;

            return next( err );
        }

        // The application exists validate the timestamp and signature
        var now     = new Date().getTime(),
            elapsed = now - timestamp;

        if ( !timestamp || elapsed > config.request_lifespan ) {
            var err     = new Error( 'Expired request' );
            err.status  = 401;

            return next( err );
        }

        var secret  = Encrypt.decode( application.secret );
        shasum.update( timestamp + secret );
        if ( !signature || ( signature != shasum.digest( 'hex' ) ) ) {
            var err     = new Error( 'Invalid signature' );
            err.status  = 401;

            return next( err );
        }

        // The request is valid set the permissions in the request to verify throughout the app
        req.permissions = application.permissions;

        if ( consumer == config.test_app_id ) {
            req.testing = true;
        } else {
            req.testing = false;
        }

        next();
    });
};

exports.permissions = function( req, res, next ) {
    var path        = req.path.split( '/' )[1],
        permission  = '';

    if ( path != 'activities' &&  path != 'applications' && path != 'assignments' && path != 'comments' && path != 'courses' && path != 'discussions' && path != 'files'
        && path != 'grades' && path != 'logins' && path != 'questionaries' && path != 'sessions' && path != 'users' ) {
        var err     = new Error( 'Invalid request' );
        err.status  = 403;

        return next( err );
    }

    if ( req.method == 'GET' ) {
        permission  = path + '_read';
    } else if ( req.method == 'DELETE' ) {
        permission  = path + '_delete';
    } else if ( req.method == 'POST' ) {
        permission  = path + '_create';
    } else if ( req.method == 'PUT' ) {
        permission  = path + '_update';
    }

    if ( req.permissions.indexOf( permission ) != -1 ) {
        next();
    } else {
        var err     = new Error( 'Permission denied' );
        err.status  = 401;

        return next( err );
    }
};