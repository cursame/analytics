var express     = require( 'express' ),
    router      = express.Router(),
    Discussion  = require( '../models/discussion' ),
    Session     = require( '../lib/session' ),
    Utils       = require( '../lib/utils' );

router.get( '/', Session.validate, function ( req, res, next ) {
    var filters     = [ 'course', 'date', 'name', 'network', 'students', 'teacher' ],
        refs        = [
            {
                field   : 'course',
                select  : 'description end name start'
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

    Utils.paginate( Discussion, filters, refs, req, res, next );
});

router.post( '/', function ( req, res, next ) {
    Discussion.create({
        course      : req.body.course,
        date        : req.body.date,
        name        : req.body.name,
        network     : req.body.network,
        students    : req.body.students,
        teacher     : req.body.teacher
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