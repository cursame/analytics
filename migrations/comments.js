var async           = require( 'async' ),
    Chance          = require( 'chance' ),
    Comment         = require( '../models/comment' ),
    Course          = require( '../models/course' ),
    chance          = new Chance(),
    totalCourses    = null,
    _getCourses     = function ( cb ) {
        if ( totalCourses === null ) {
            Course.count( function ( err, count ) {
                totalCourses    = count;
                cb();
            });
        } else {
            cb();
        }
    };

exports.create      = function ( total, cb ) {
    var comments    = [],
        iterated    = 0;

    _getCourses( function () {
        for ( var i = 0; i < total; i++ ) {
            async.waterfall([
                function ( callback ) {
                    var skip        = chance.integer({
                            min     : 0,
                            max     : totalCourses - 1
                        });

                    Course.findOne().skip( skip ).exec( function ( err, course ) {
                        callback( null, course );
                    });
                },
                function ( course, callback ) {
                    var index   = chance.integer({
                        min     : 0,
                        max     : course.students.length - 1
                    });

                    callback( null, course, course.students[index] );
                },
                function ( course, student, callback ) {
                    var date    = new Date( chance.hammertime() ),
                        start   = new Date( course.start );

                    date.setYear( start.getFullYear() );

                    callback( null, course, student, date );
                },
                function ( course, student, date, callback ) {
                    Comment.create({
                        comment : chance.sentence(),
                        course  : course._id,
                        date    : date.toISOString(),
                        student : student,
                        teacher : course.teacher
                    }, function ( err, comment ) {
                        callback( null, comment );
                    });
                }
            ], function ( err, result ) {
                if ( result ) {
                    comments.push( result );
                }

                if ( ++iterated == total ) {
                    cb( comments.length );
                }
            });
        }
    });
};