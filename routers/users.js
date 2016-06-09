var express     = require( 'express' ),
    router      = express.Router(),
    User        = require( '../models/user' ),
    Session     = require( '../lib/session' ),
    Utils       = require( '../lib/utils' ),
    findUser    = function ( id, cb ) {
        User.findById( id, function ( err, user ) {
            if ( err || !user ) {
                cb( err );
            } else {
                cb( null, user );
            }
        });
    };

router.get( '/', Session.validate, function ( req, res, next ) {
    var filters     = [ '_id', 'creation_date', 'email', 'external_id', 'name', 'network', 'type' ],
        refs        = [
            {
                field   : 'network',
                select  : 'name'
            }
        ];

    Utils.paginate( User, filters, refs, req, res, next );
});

router.get( '/:id', Session.validate, function ( req, res, next ) {
    User.findById( req.params.id, function ( err, user ) {
        if ( err || !user ) {
            err         = new Error( 'Invalid user id' );
            err.status  = 404;

            next( err );
        } else {
            if ( req.session.user_id == user._id.toString() && req.session.access_level != 0 ) {
                err         = new Error( 'Permission denied' );
                err.status  = 403;

                next( err );
            } else {
                res.json( user );
            }
        }
    });
});

router.post( '/', function ( req, res, next ) {
    User.create({
        avatar      : req.body.avatar,
        email       : req.body.email,
        external_id : req.body.external_id,
        name        : req.body.name,
        network     : req.body.network,
        pass        : req.body.pass,
        type        : req.body.type
    }, function ( err, user ) {
        if ( err || !user ) {
            var error       = new Error( 'Invalid user data' );
            error.status    = 403;

            return next( error );
        } else {
            res.json( user );
        }
    });
});

router.put( '/:id', function ( req, res, next ) {
    var updated = function ( err, user ) {
        if ( err ) {
            err         = new Error( 'Invalid user data' );
            err.status  = 403;
            return next( err );
        }

        res.json( user );
    };

    findUser( req.params.id, function ( err, user ) {
        if ( err ) {
            err         = new Error( 'Invalid user id' );
            err.status  = 404;

            return next( err );
        } else {
            for ( var key in req.body ) {
                if ( key == "pass" ) continue;

                user[key]   = req.body[key];
            }

            user.save( updated );
        }
    });
});

router.delete( '/:id', Session.validate, function ( req, res, next ) {
    findUser( req.params.id, function ( err, user ) {
        if ( err ) {
            var error       = new Error( 'Invalid user id' );
            error.status    = 404;

            next( error );
        } else {
            user.remove( function () {
                res.json( user );
            });
        }
    });
});

module.exports  = router;