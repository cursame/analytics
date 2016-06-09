var async           = require( 'async' ),
    Chance          = require( 'chance' ),
    Network         = require( '../models/network' ),
    User            = require( '../models/user' ),
    chance          = new Chance(),
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
    };

exports.create  = function ( type, total, cb ) {
    var iterated    = 0,
        id          = 0,
        nonce       = chance.integer({
            min     : 1,
            max     : 4294967296
        }),
        users       = [];

    _getNetworks( function () {
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
                    User.create({
                        avatar      : chance.avatar({
                            fileExtension   : 'png',
                            protocol        : 'https'
                        }),
                        email       : chance.email(),
                        external_id : nonce + id++,
                        name        : chance.name(),
                        network     : network,
                        pass        : 'migration',
                        type        : type
                    }, function ( err, user ) {
                        callback( null, user );
                    });
                }
            ], function ( err, result ) {
                if ( result ) {
                    users.push( result );
                }

                if ( ++iterated == total ) {
                    cb( users.length );
                }
            });
        }
    });
};