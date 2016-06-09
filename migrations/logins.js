var async           = require( 'async' ),
    Chance          = require( 'chance' ),
    Login           = require( '../models/login' ),
    User            = require( '../models/user' ),
    chance          = new Chance(),
    totalUsers      = null,
    _getUsers       = function ( cb ) {
        if ( totalUsers === null ) {
            User.count({
                $or     : [
                    {
                        type    : 1
                    },
                    {
                        type    : 2
                    },
                    {
                        type    : 3
                    }
                ]
            }, function ( err, users ) {
                totalUsers  = users;
                cb();
            });
        } else {
            cb();
        }
    };

exports.create      = function ( total, cb ) {
    var logins      = [],
        iterated    = 0;

    _getUsers( function () {
        for ( var i = 0; i < total; i++ ) {
            async.waterfall([
                function ( callback ) {
                    var skip    = chance.integer({
                            min : 0,
                            max : totalUsers - 1
                        });

                    User.findOne({
                        $or     : [
                            {
                                type    : 1
                            },
                            {
                                type    : 2
                            },
                            {
                                type    : 3
                            }
                        ]
                    }).select( '_id network type' ).skip( skip ).exec( function ( err, user ) {
                        callback( null, user );
                    });
                },
                function ( user, callback ) {
                    var year    = new Date().getFullYear(),
                        date    = new Date( chance.hammertime() );

                    date.setYear( year );

                    callback( null, user, date );
                },
                function ( user, date, callback ) {
                    Login.create({
                        date    : date.toISOString(),
                        network : user.network,
                        type    : user.type,
                        user    : user._id
                    }, function ( err, login ) {
                        callback( null, login );
                    });
                }
            ], function ( err, result ) {
                if ( result ) {
                    logins.push( result );
                }

                if ( ++iterated == total ) {
                    cb( logins.length );
                }
            });
        }
    });
};