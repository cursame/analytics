var async           = require( 'async' ),
    Chance          = require( 'chance' ),
    Course          = require( '../models/course' ),
    File            = require( '../models/file' ),
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
    var files       = [],
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
                    var date    = new Date( chance.hammertime() ),
                        start   = new Date( course.start );

                    date.setYear( start.getFullYear() );

                    callback( null, course, date );
                },
                function ( course, date, callback ) {
                    File.create({
                        course  : course._id,
                        date    : date.toISOString(),
                        file    : chance.word({ syllables : 3 }),
                        network : course.network,
                        teacher : course.teacher
                    }, function ( err, file ) {
                        callback( null, file );
                    });
                }
            ], function ( err, result ) {
                if ( result ) {
                    files.push( result );
                }

                if ( ++iterated == total ) {
                    cb( files.length );
                }
            });
        }
    });
};