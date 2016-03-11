var express     = require( 'express' ),
    router      = express.Router(),
    Questionary = require( '../models/questionary' ),
    Session     = require( '../lib/session' ),
    Utils       = require( '../lib/utils' );

router.get( '/', Session.validate, function ( req, res, next ) {
    var filters     = [ 'course', 'date', 'name' ],
        refs        = [
            {
                field   : 'course',
                select  : 'description name start teacher'
            },
            {
                field   : 'students',
                select  : 'avatar name email external_id'
            }
        ];

    Utils.paginate( Questionary, filters, refs, req, res, next );
});

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