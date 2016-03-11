var express     = require( 'express' ),
    router      = express.Router(),
    Assignment  = require( '../models/assignment' ),
    Session     = require( '../lib/session' );

router.post( '/', function ( req, res, next ) {
    Assignment.create({
        course      : req.body.course,
        date        : req.body.date,
        due_date    : req.body.due_date,
        name        : req.body.name,
        students    : req.body.students
    }, function ( err, assignment ) {
        if ( err || !assignment ) {
            err         = new Error( 'Invalid assignment data' );
            err.status  = 403;

            next( err );
        } else {
            res.json( assignment );
        }
    });
});

router.delete( '/:id', Session.validate, function ( req, res, next ) {
    Assignment.findById( req.params.id, function ( err, assignment ) {
        if ( err || !assignment ) {
            err         = new Error( 'Invalid assignment id' );
            err.status  = 404;

            next( err );
        } else {
            assignment.remove( function () {
                res.json( assignment );
            });
        }
    });
});

module.exports  = router;