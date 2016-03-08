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

describe( 'Sessions', function () {
    var invalid     = {
            email   : 'invalid@cursa.me',
            pass    : 'wrong'
        },
        user        = {
            email   : 'admin@cursa.me',
            pass    : 'admin'
        },
        session     = '';

    it ( 'should get a 403 error when attempting to start a session with invalid credentials', function ( done ) {
        request( server )
            .post( '/sessions' )
            .send( invalid )
            .expect( 403, done );
    });

    it ( 'should start a session in the system', function ( done ) {
        request( server )
            .post( '/sessions' )
            .send( user )
            .end( function ( err, res ) {
                if ( err ) {
                    throw err;
                }

                res.body.should.have.property( 'session' );

                session     = res.body.session;
                done();
            });
    });

    it ( 'should get a 404 error when attempting to delete an unexisting session', function ( done ) {
        request( server )
            .delete( '/sessions/56de11812a4bec800a2fefd8' )
            .expect( 404, done );
    });

    it ( 'should terminate the statrted session', function ( done ) {
        request( server )
            .delete( '/sessions/' + session )
            .expect( 200, done );
    });
});