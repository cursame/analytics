var express     = require( 'express' ),
    router      = express.Router(),
    Comment     = require( '../models/comment' ),
    Utils       = require( '../lib/utils' ),
    Session     = require( '../lib/session' );

router.get( '/', Session.validate, function ( req, res, next ) {
    var filters     = [ 'course', 'date', 'student' ],
        refs        = [
            {
                field   : 'course',
                select  : 'description name start teacher'
            },
            {
                field   : 'student',
                select  : 'avatar email external_id name'
            }
        ];

    Utils.paginate( Comment, filters, refs, req, res, next );
});

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