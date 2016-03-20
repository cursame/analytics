var async           = require( 'async' ),
    Chance          = require( 'chance' ),
    Course          = require( '../models/course' ),
    User            = require( '../models/user' ),
    chance          = new Chance(),
    totalStudents   = null,
    totalTeachers   = null,
    _getUsers       = function ( cb ) {
        var check   = function () {
            if ( totalStudents !== null && totalTeachers !== null ) {
                cb();
            }
        };

        if ( totalStudents === null ) {
            User.count({
                type    : 2
            }, function ( err, students ) {
                totalStudents   = students;
                check();
            });
        }

        if ( totalTeachers === null ) {
            User.count({
                type    : 1
            }, function ( err, teachers ) {
                totalTeachers   = teachers;
                check();
            });
        }

        check();
    };

exports.create      = function ( total, maxStudents, cb ) {
    var courses     = [],
        iterated    = 0;

    _getUsers( function () {
        for ( var i = 0; i < total; i++ ) {
            async.waterfall([
                function ( callback ) {
                    var skip    = chance.integer({
                            min : 0,
                            max : totalStudents - maxStudents
                        }),
                        result  = [];

                    User.find({
                        type    : 2
                    }).select( '_id' ).skip( skip ).limit( maxStudents ).exec( function ( err, students ) {
                        for ( var j = 0; j < students.length; j++ ) {
                            result.push( students[j]._id );
                        }

                        callback( null, result );
                    });
                },
                function ( students, callback ) {
                    var skip    = chance.integer({
                            min : 0,
                            max : totalTeachers - 1
                        });

                    User.findOne({
                        type    : 1
                    }).select( '_id' ).skip( skip ).exec( function ( err, teacher ) {
                        callback( null, students, teacher._id );
                    });
                },
                function ( students, teacher, callback ) {
                    var year        = new Date().getFullYear(),
                        startYear   = parseInt( chance.year({
                            min     : year - 10,
                            max     : year
                        }) ),
                        start       = new Date( chance.hammertime() ),
                        end         = new Date( chance.hammertime() );

                    start.setYear( startYear );
                    end.setYear( startYear + 1 );

                    callback( null, students, teacher, start, end );
                },
                function ( students, teacher, start, end, callback ) {
                    Course.create({
                        description : chance.sentence({ words : 10 }),
                        name        : chance.word({ syllables : 4 }),
                        end         : end,
                        start       : start,
                        students    : students,
                        teacher     : teacher
                    }, function ( err, course ) {
                        callback( null, course );
                    });
                }
            ], function ( err, result ) {
                if ( result ) {
                    courses.push( result );
                }

                if ( ++iterated == total ) {
                    cb( courses.length );
                }
            });
        }
    });
};