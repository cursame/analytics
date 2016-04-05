var express     = require( 'express' ),
    router      = express.Router(),
    Assignment  = require( '../models/assignment' ),
    Utils       = require( '../lib/utils' ),
    Session     = require( '../lib/session' );

router.get( '/', Session.validate, function ( req, res, next ) {
    var filters     = [ 'course', 'date', 'name', 'students', 'teacher' ],
        refs        = [
            {
                field   : 'course',
                select  : 'description name start students teacher'
            },
            {
                field   : 'students',
                select  : 'avatar email external_id name'
            },
            {
                field   : 'teacher',
                select  : 'avatar email external_id name'
            }
        ];

    Utils.paginate( Assignment, filters, refs, req, res, next );
});

router.post( '/', function ( req, res, next ) {
    Assignment.create({
        course      : req.body.course,
        date        : req.body.date,
        due_date    : req.body.due_date,
        name        : req.body.name,
        students    : req.body.students,
        teacher     : req.body.teacher
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