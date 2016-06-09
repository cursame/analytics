var async           = require( 'async' ),
    Chance          = require( 'chance' ),
    Network         = require( '../models/network' ),
    chance          = new Chance();

exports.create      = function ( total, cb ) {
    var networks    = [],
        iterated    = 0;

    for ( var i = 0; i < total; i++ ) {
        async.waterfall([
            function ( callback ) {
                Network.create({
                    name    : chance.word({ syllables : 3 })
                }, function ( err, network ) {
                    callback( null, network );
                });
            }
        ], function ( err, result ) {
            if ( result ) {
                networks.push( result );
            }

            if ( ++iterated == total ) {
                cb( networks.length );
            }
        });
    }
};