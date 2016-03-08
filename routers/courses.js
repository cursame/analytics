var express     = require( 'express' ),
    router      = express.Router(),
    Course      = require( '../models/course' ),
    Session     = require( '../lib/session' );

router.post( '/', function ( req, res, next ) {
    Course.create({
        description : req.body.description,
        end         : req.body.end,
        name        : req.body.name,
        start       : req.body.start,
        students    : req.body.students,
        teacher     : req.body.teacher
    }, function ( err, course ) {
        if ( err || !course ) {
            err         = new Error( 'Invalid course data' );
            err.status  = 403;

            next( err );
        } else {
            res.json( course );
        }
    });
});

router.delete( '/:id', Session.validate, function ( req, res, next ) {
    Course.findById( req.params.id, function ( err, course ) {
        if ( err || !course ) {
            err         = new Error( 'Invalid course id' );
            err.status  = 404;

            next( err );
        } else {
            course.remove( function () {
                res.json( course );
            });
        }
    });
});

module.exports  = router;