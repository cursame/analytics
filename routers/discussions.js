var express     = require( 'express' ),
    router      = express.Router(),
    Discussion  = require( '../models/discussion' ),
    Session     = require( '../lib/session' );

router.post( '/', function ( req, res, next ) {
    Discussion.create({
        course      : req.body.course,
        date        : req.body.date,
        name        : req.body.name,
        students    : req.body.students
    }, function ( err, discussion ) {
        if ( err || !discussion ) {
            err         = new Error( 'Invalid discussion data' );
            err.status  = 403;

            next( err );
        } else {
            res.json( discussion );
        }
    });
});

router.delete( '/:id', Session.validate, function ( req, res, next ) {
    Discussion.findById( req.params.id, function ( err, discussion ) {
        if ( err || !discussion ) {
            err         = new Error( 'Invalid discussion id' );
            err.status  = 404;

            next( err );
        } else {
            discussion.remove( function () {
                res.json( discussion );
            });
        }
    });
});

module.exports  = router;