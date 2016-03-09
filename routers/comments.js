var express     = require( 'express' ),
    router      = express.Router(),
    Comment     = require( '../models/comment' ),
    Session     = require( '../lib/session' );

router.post( '/', function ( req, res, next ) {
    Comment.create({
        comment : req.body.comment,
        course  : req.body.course,
        date    : req.body.date,
        student : req.body.student
    }, function ( err, comment ) {
        if ( err || !comment ) {
            err         = new Error( 'Invalid comment data' );
            err.status  = 403;

            next( err );
        } else {
            res.json( comment );
        }
    });
});

router.delete( '/:id', Session.validate, function ( req, res, next ) {
    Comment.findById( req.params.id, function ( err, comment ) {
        if ( err || !comment ) {
            err         = new Error( 'Invalid comment id' );
            err.status  = 404;

            next( err );
        } else {
            comment.remove( function () {
                res.json( comment );
            });
        }
    });
});

module.exports  = router;