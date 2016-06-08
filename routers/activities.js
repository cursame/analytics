var express     = require( 'express' ),
    router      = express.Router(),
    Activity    = require( '../models/activity' ),
    Session     = require( '../lib/session' ),
    Utils       = require( '../lib/utils' );

router.get( '/', Session.validate, function ( req, res, next ) {
    var filters     = [ 'activity', 'course', 'date', 'network', 'teacher', 'user' ],
        refs        = [
            {
                field   : 'course',
                select  : 'description end name start'
            },
            {
                field   : 'teacher',
                select  : 'avatar email external_id name'
            },
            {
                field   : 'user',
                select  : 'avatar email external_id name'
            }
        ];

    Utils.paginate( Activity, filters, refs, req, res, next );
});

router.post( '/', function ( req, res, next ) {
    Activity.create({
        activity    : req.body.activity,
        course      : req.body.course,
        date        : req.body.date,
        network     : req.body.network,
        teacher     : req.body.teacher,
        user        : req.body.user
    }, function ( err, file ) {
        if ( err || !file ) {
            err         = new Error( 'Invalid activity data' );
            err.status  = 403;

            next( err );
        } else {
            res.json( file );
        }
    });
});

router.delete( '/:id', Session.validate, function ( req, res, next ) {
    Activity.findById( req.params.id, function ( err, activity ) {
        if ( err || !activity ) {
            err         = new Error( 'Invalid activity id' );
            err.status  = 404;

            next( err );
        } else {
            activity.remove( function () {
                res.json( activity );
            });
        }
    });
});

module.exports  = router;