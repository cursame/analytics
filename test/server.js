var assert      = require( 'assert' ),
    should      = require( 'should' ),
    request     = require( 'supertest' ),
    server      = require( '../server' );

describe( 'AnalyticsAPI', function () {
    it ( 'return a 404 error for an invalid resource request', function ( done ) {
        request( server )
            .get( '/invalid' )
            .expect( 404, done );
    });

    it ( 'return a 200 status code for an options request', function ( done ) {
        request( server )
            .options( '/' )
            .expect( 200, done );
    });
});