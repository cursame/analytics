var async           = require( 'async' ),
    Chance          = require( 'chance' ),
    Assignment      = require( '../models/assignment' ),
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
    var assignments = [],
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
                    var number      = chance.integer({
                            min     : 0,
                            max     : course.students.length
                        }),
                        index       = chance.integer({
                            min     : 0,
                            max     : course.students.length
                        }),
                        students    = [];

                    for ( var j = 0; j < number; j++ ) {
                        if ( index >= course.students.length ) {
                            index   = 0;
                        }

                        students.push( course.students[index++] );
                    }

                    callback( null, course, students );
                },
                function ( course, students, callback ) {
                    var courseStart = new Date( course.start ),
                        date        = new Date( chance.hammertime() );

                    date.setYear( courseStart.getFullYear() );

                    callback( null, course, students, date.toISOString() );
                },
                function ( course, students, date, callback ) {
                    Assignment.create({
                        course      : course._id,
                        date        : date,
                        name        : chance.word({ syllables : 3 }),
                        students    : students,
                        teacher     : course.teacher
                    }, function ( err, assignment ) {
                        callback( null, assignment );
                    });
                }
            ], function ( err, result ) {
                if ( result ) {
                    assignments.push( result );
                }

                if ( ++iterated == total ) {
                    cb( assignments.length );
                }
            });
        }
    });
};