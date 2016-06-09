var express     = require( 'express' ),
    Network     = require( '../models/network' ),
    Session     = require( '../lib/session' ),
    Utils       = require( '../lib/utils' ),
    router      = express.Router();

router.get( '/', Session.validate, function ( req, res, next ) {
    var supported   = [ 'name' ];

    Utils.paginate( Network, supported, [], req, res, next );
});

router.post( '/', function ( req, res, next ) {
    Network.create({
        name    : req.body.name,
    }, function ( err, name ) {
        if ( err || !name ) {
            err         = new Error( 'Invalid name data' );
            err.status  = 403;

            next( err );
        } else {
            res.json( name );
        }
    });
});

router.delete( '/:id', Session.validate, function ( req, res, next ) {
    Network.findById( req.params.id, function ( err, network ) {
        if ( err || !network ) {
            err         = new Error( 'Invalid network id' );
            err.status  = 404;

            next( err );
        } else {
            network.remove( function () {
                res.json( network );
            });
        }
    });
});

module.exports  = router;