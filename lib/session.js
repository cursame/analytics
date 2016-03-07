var Encrypt         = require( '../lib/encrypt' ),
    Session         = require( '../models/session' ),
    User            = require( '../models/user' );

exports.login       = function ( req, cb ) {
    var start       = function ( user ) {
        if ( user && user.type == 0 ) {
            Session.create({
                access_level    : user.type,
                user_id         : user.id
            }, function( err, session ) {
                cb( session );
            });
        } else {
            cb( false );
        }
    };

    User.findOne({
        nick    : req.body.nick
    }, function ( err, user ) {
        if ( err || !user ) {
            return cb( false );
        } else {
            user.auth( req.body.pass, start );
        }
    });
};

exports.validate    = function ( req, res, next ) {
    var sess    = ( req.body.session ) ? Encrypt.decode( req.body.session ) : ( ( req.params.session ) ? Encrypt.decode( req.params.session ) : ( ( req.query.session ) ? Encrypt.decode( req.query.session ) : '' ) );

    // Check if we are testing the application
    if ( !sess && req.testing ) {
        next();
    } else {
        Session.findById( sess, function ( err, session ) {
            if ( err || !session ) {
                var err     = new Error( 'Invalid session id' );
                err.status  = 401;
                return next( err );
            }

            session.last_activity   = new Date().getTime();
            session.save( function( err ) {
                req.session = session;
                next();
            });
        });
    }
};