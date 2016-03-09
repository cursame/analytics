var express     = require( 'express' ),
    router      = express.Router(),
    Questionary = require( '../models/questionary' ),
    Session     = require( '../lib/session' );

router.post( '/', function ( req, res, next ) {
    Questionary.create({
        course      : req.body.course,
        date        : req.body.date,
        name        : req.body.name,
        students    : req.body.students
    }, function ( err, questionary ) {
        if ( err || !questionary ) {
            err         = new Error( 'Invalid questionary data' );
            err.status  = 403;

            next( err );
        } else {
            res.json( questionary );
        }
    });
});

router.delete( '/:id', Session.validate, function ( req, res, next ) {
    Questionary.findById( req.params.id, function ( err, questionary ) {
        if ( err || !questionary ) {
            err         = new Error( 'Invalid questionary id' );
            err.status  = 404;

            next( err );
        } else {
            questionary.remove( function () {
                res.json( questionary );
            });
        }
    });
});

module.exports  = router;