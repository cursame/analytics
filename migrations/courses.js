var async           = require( 'async' ),
    Chance          = require( 'chance' ),
    Course          = require( '../models/course' ),
    Network         = require( '../models/network' ),
    User            = require( '../models/user' ),
    chance          = new Chance(),
    totalStudents   = null,
    totalTeachers   = null,
    totalNetworks   = null,
    _getNetworks    = function ( cb ) {
        if ( totalNetworks === null ) {
            Network.count( function ( err, count ) {
                totalNetworks   = count;
                cb();
            });
        } else {
            cb();
        }
    },
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

    _getNetworks( function () {
        _getUsers( function () {
            for ( var i = 0; i < total; i++ ) {
                async.waterfall([
                    function ( callback ) {
                        var skip        = chance.integer({
                                min     : 0,
                                max     : totalNetworks - 1
                            });

                        Network.findOne().skip( skip ).exec( function ( err, network ) {
                            callback( null, network._id );
                        });
                    },
                    function ( network, callback ) {
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

                            callback( null, network, result );
                        });
                    },
                    function ( network, students, callback ) {
                        var skip    = chance.integer({
                                min : 0,
                                max : totalTeachers - 1
                            });

                        User.findOne({
                            type    : 1
                        }).select( '_id' ).skip( skip ).exec( function ( err, teacher ) {
                            callback( null, network, students, teacher._id );
                        });
                    },
                    function ( network, students, teacher, callback ) {
                        var year        = new Date().getFullYear(),
                            start       = new Date( chance.hammertime() ),
                            end         = new Date( chance.hammertime() );

                        start.setYear( year );
                        end.setYear( year + 1 );

                        callback( null, network, students, teacher, start, end );
                    },
                    function ( network, students, teacher, start, end, callback ) {
                        Course.create({
                            description : chance.sentence({ words : 10 }),
                            name        : chance.word({ syllables : 4 }),
                            network     : network,
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
    });
};