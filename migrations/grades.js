var async           = require( 'async' ),
    Chance          = require( 'chance' ),
    Grade           = require( '../models/grade' ),
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
    var grades      = [],
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
                    Grade.create({
                        course  : course._id,
                        date    : date.toISOString(),
                        grade   : chance.floating({
                            fixed   : 2,
                            min     : 5,
                            max     : 10
                        }),
                        student : student
                    }, function ( err, grade ) {
                        callback( null, grade );
                    });
                }
            ], function ( err, result ) {
                if ( result ) {
                    grades.push( result );
                }

                if ( ++iterated == total ) {
                    cb( grades.length );
                }
            });
        }
    });
};