var Chance      = require( 'chance' ),
    User        = require( '../models/user' ),
    chance      = new Chance(),
    nonce       = chance.integer({
        min     : 1,
        max     : 4294967296
    }),
    created     = 0,
    iterated    = 0;

exports.create  = function ( type, total, cb ) {
    for ( var i = 0; i < total; i++ ) {
        User.create({
            avatar      : chance.avatar({
                fileExtension   : 'png',
                protocol        : 'https'
            }),
            email       : chance.email(),
            external_id : nonce + i,
            name        : chance.name(),
            pass        : 'migration',
            type        : type
        }, function ( err, user ) {
            if ( !err && user ) {
                created++;
            }

            if ( ++iterated == total ) {
                cb( created );
            }
        });
    }
};