var async           = require( 'async' ),
    Chance          = require( 'chance' ),
    Course          = require( '../models/course' ),
    Discussion      = require( '../models/discussion' ),
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
    var discussions = [],
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
                    var date    = new Date( chance.hammertime() ),
                        start   = new Date( course.start );

                    date.setYear( start.getFullYear() );

                    callback( null, course, students, date );
                },
                function ( course, students, date, callback ) {
                    Discussion.create({
                        course      : course._id,
                        date        : date.toISOString(),
                        name        : chance.word({ syllables : 4 }),
                        network     : course.network,
                        students    : students,
                        teacher     : course.teacher
                    }, function ( err, discussion ) {
                        callback( null, discussion );
                    });
                }
            ], function ( err, result ) {
                if ( result ) {
                    discussions.push( result );
                }

                if ( ++iterated == total ) {
                    cb( discussions.length );
                }
            });
        }
    });
};