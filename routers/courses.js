var express     = require( 'express' ),
    router      = express.Router(),
    Course      = require( '../models/course' ),
    Session     = require( '../lib/session' ),
    Utils       = require( '../lib/utils' );

router.get( '/', Session.validate, function ( req, res, next ) {
    var filters     = [ 'end', 'name', 'network', 'start', 'students', 'teacher' ],
        refs        = [
            {
                field   : 'students',
                select  : 'avatar email external_id name'
            },
            {
                field   : 'teacher',
                select  : 'avatar email external_id name'
            }
        ];

    Utils.paginate( Course, filters, refs, req, res, next );
});

router.post( '/', function ( req, res, next ) {
    Course.create({
        description : req.body.description,
        end         : req.body.end,
        name        : req.body.name,
        network     : req.body.network,
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