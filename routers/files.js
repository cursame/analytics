var express     = require( 'express' ),
    router      = express.Router(),
    File        = require( '../models/file' ),
    Session     = require( '../lib/session' );

router.post( '/', function ( req, res, next ) {
    File.create({
        course  : req.body.course,
        date    : req.body.date,
        file    : req.body.file
    }, function ( err, file ) {
        if ( err || !file ) {
            err         = new Error( 'Invalid file data' );
            err.status  = 403;

            next( err );
        } else {
            res.json( file );
        }
    });
});

router.delete( '/:id', Session.validate, function ( req, res, next ) {
    File.findById( req.params.id, function ( err, file ) {
        if ( err || !file ) {
            err         = new Error( 'Invalid file id' );
            err.status  = 404;

            next( err );
        } else {
            file.remove( function () {
                res.json( file );
            });
        }
    });
});

module.exports  = router;