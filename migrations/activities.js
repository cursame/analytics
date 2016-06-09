var async           = require( 'async' ),
    Chance          = require( 'chance' ),
    Activity        = require( '../models/activity' ),
    Course          = require( '../models/course' ),
    chance          = new Chance(),
    avActivities    = [
        'LIKE',
        'COMMENT',
        'HOMEWORK',
        'FILE'
    ],
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
    var activities  = [],
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
                function ( course, user, callback ) {
                    var date    = new Date( chance.hammertime() ),
                        start   = new Date( course.start );

                    date.setYear( start.getFullYear() );

                    callback( null, course, user, date );
                },
                function ( course, user, date, callback ) {
                    var index   = chance.integer({
                        min     : 0,
                        max     : avActivities.length - 1
                    });

                    Activity.create({
                        activity    : avActivities[index],
                        course      : course._id,
                        date        : date.toISOString(),
                        network     : course.network,
                        user        : user,
                        teacher     : course.teacher
                    }, function ( err, activity ) {
                        callback( null, activity );
                    });
                }
            ], function ( err, result ) {
                if ( result ) {
                    activities.push( result );
                }

                if ( ++iterated == total ) {
                    cb( activities.length );
                }
            });
        }
    });
};