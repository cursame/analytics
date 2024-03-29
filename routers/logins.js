var express     = require( 'express' ),
    router      = express.Router(),
    Login       = require( '../models/login' ),
    Session     = require( '../lib/session' ),
    Utils       = require( '../lib/utils' );

router.get( '/', Session.validate, function ( req, res, next ) {
    var filters     = [ 'date', 'network', 'type', 'user' ],
        refs        = [
            {
                field   : 'user',
                select  : 'avatar name email external_id'
            }
        ];

    Utils.paginate( Login, filters, refs, req, res, next );
});

router.post( '/', function ( req, res, next ) {
    Login.create({
        date    : req.body.date,
        network : req.body.network,
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