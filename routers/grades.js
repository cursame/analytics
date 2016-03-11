var express     = require( 'express' ),
    router      = express.Router(),
    Grade       = require( '../models/grade' ),
    Session     = require( '../lib/session' ),
    Utils       = require( '../lib/utils' );

router.get( '/', Session.validate, function ( req, res, next ) {
    var filters     = [ 'course', 'date', 'student' ],
        refs        = [
            {
                field   : 'course',
                select  : 'description end name start'
            },
            {
                field   : 'student',
                select  : 'avatar name email external_id'
            }
        ];

    Utils.paginate( Grade, filters, refs, req, res, next );
});

router.post( '/', function ( req, res, next ) {
    Grade.create({
        course  : req.body.course,
        date    : req.body.date,
        grade   : req.body.grade,
        student : req.body.student
    }, function ( err, grade ) {
        if ( err || !grade ) {
            err         = new Error( 'Invalid grade data' );
            err.status  = 403;

            next( err );
        } else {
            res.json( grade );
        }
    });
});

router.delete( '/:id', Session.validate, function ( req, res, next ) {
    Grade.findById( req.params.id, function ( err, grade ) {
        if ( err || !grade ) {
            err         = new Error( 'Invalid grade id' );
            err.status  = 404;

            next( err );
        } else {
            grade.remove( function () {
                res.json( grade );
            });
        }
    });
});

module.exports  = router;