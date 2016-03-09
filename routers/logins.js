var express     = require( 'express' ),
    router      = express.Router(),
    Login       = require( '../models/login' ),
    Session     = require( '../lib/session' );

router.post( '/', function ( req, res, next ) {
    Login.create({
        date    : req.body.date,
        type    : req.body.type,
        user    : req.body.user
    }, function ( err, login ) {
        if ( err || !login ) {
            err         = new Error( 'Invalid login data' );
            err.status  = 403;

            next( err );
        } else {
            res.json( login );
        }
    });
});

router.delete( '/:id', Session.validate, function ( req, res, next ) {
    Login.findById( req.params.id, function ( err, login ) {
        if ( err || !login ) {
            err         = new Error( 'Invalid login id' );
            err.status  = 404;

            next( err );
        } else {
            login.remove( function () {
                res.json( login );
            });
        }
    });
});

module.exports  = router;