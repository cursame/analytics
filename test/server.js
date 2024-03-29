var assert      = require( 'assert' ),
    crypto      = require( 'crypto' ),
    should      = require( 'should' ),
    request     = require( 'supertest' ),
    server      = require( '../server' ),
    Auth        = require( './lib/auth' );

describe( 'AnalyticsAPI', function () {
    it ( 'return a 401 for an unsigned request', function ( done ) {
        request( server )
            .post( '/sessions' )
            .expect( 401, done );
    });

    it ( 'return a 403 error for an invalid resource request', function ( done ) {
        request( server )
            .get( '/invalid' )
            .send( Auth.sign() )
            .expect( 403, done );
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
            .send( Auth.sign( invalid ) )
            .expect( 403, done );
    });

    it ( 'should start a session in the system', function ( done ) {
        request( server )
            .post( '/sessions' )
            .send( Auth.sign( user ) )
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
            .delete( '/sessions/4b61cce1e9de32f6c2c77d702b2286ff0058d9011ad69cadb39149f99cafd48b' )
            .send( Auth.sign() )
            .expect( 404, done );
    });

    it ( 'should terminate the statrted session', function ( done ) {
        request( server )
            .delete( '/sessions/' + session )
            .send( Auth.sign() )
            .expect( 200, done );
    });
});

describe( 'Applications', function () {
    var application     = {
            name        : 'UnitTestApplication',
            description : 'Application created from the unit test environment to verify the applications resource.',
            permissions : [ 'sessions_write', 'users_write', 'users_read', 'rooms_write', 'rooms_read', 'hotels_write', 'hotels_read', 'reports_write', 'reports_read', 'complains_write', 'complains_read', 'clients_write', 'clients_read', 'products_write', 'products_read', 'sells_write', 'sells_read', 'purchases_write', 'purchases_read', 'payments_write', 'payments_read', 'shifts_write', 'shifts_read', 'applications_write', 'applications_read' ]
        },
        incomplete      = {
            name        : 'IncompleteUnitTestApplication',
            description : 'Application created from the unit test environment without full permissions to check the client authentication.',
            permissions : [ 'sessions_write', 'users_write', 'users_read', 'rooms_write', 'rooms_read', 'hotels_write', 'hotels_read', 'reports_write', 'reports_read', 'complains_write', 'complains_read', 'clients_write', 'clients_read', 'products_write', 'products_read', 'sells_write', 'sells_read', 'purchases_write', 'purchases_read', 'payments_write', 'payments_read' ]
        },
        creation        = "",
        secret          = "",
        incomplete_id   = "",
        inc_secret      = "";

    it ( 'create a new application in the system', function ( done ) {
        request( server )
            .post( '/applications' )
            .send( Auth.sign( application ) )
            .end( function ( err, res ) {
                if ( err ) {
                    throw err;
                }

                res.body.should.have.property( '_id' );
                res.body.should.have.property( 'name' );
                res.body.should.have.property( 'creation_date' );
                res.body.should.have.property( 'description' );
                res.body.should.have.property( 'permissions' );
                res.body.should.have.property( 'secret' );

                app         = res.body._id;
                secret      = res.body.secret;
                creation    = res.body.creation_date;

                done();
            });
    });

    it ( 'get a 403 error when attempting to create an invalid application', function ( done ) {
        request( server )
            .post( '/applications' )
            .send( Auth.sign() )
            .expect( 403, done );
    });

    it ( 'update the previously created application without modifying the creation date', function ( done ) {
        request( server )
            .put( '/applications/' + app )
            .send( Auth.sign( { name : 'UnitTestApp', creation_date : Date.now() }) )
            .end( function ( err, res ) {
                if ( err ) {
                    throw err;
                }

                res.body.should.have.property( '_id' );
                res.body.should.have.property( 'name' );
                res.body.should.have.property( 'creation_date' );
                res.body.should.have.property( 'description' );
                res.body.should.have.property( 'permissions' );
                res.body.should.have.property( 'secret' );

                assert.equal( 'UnitTestApp', res.body.name );
                assert.equal( secret, res.body.secret );
                assert.equal( creation, res.body.creation_date );

                done();
            });
    });

    it ( 'get a 404 error when attempting to update an invalid application', function ( done ) {
        request( server )
            .put( '/applications/not_there' )
            .send( Auth.sign() )
            .expect( 404, done );
    });

    it ( 'create a new application in the system', function ( done ) {
        request( server )
            .post( '/applications' )
            .send( Auth.sign( incomplete ) )
            .end( function ( err, res ) {
                if ( err ) {
                    throw err;
                }

                incomplete_id   = res.body._id;
                inc_secret      = res.body.secret;
                done();
            });
    });

    it ( 'get a 401 error when attempting to access an unauthorized resource', function ( done ) {
        var time        = new Date().getTime(),
            hash        = crypto.createHash( 'sha1' );
        hash.update( time + inc_secret );

        var signature   = {
                consumer    : incomplete_id,
                timestamp   : time,
                signature   : hash.digest( 'hex' )
            };

        request( server )
            .get( '/applications' )
            .send( signature )
            .expect( 401, done );
    });

    it ( 'remove the previously created application', function ( done ) {
        request( server )
            .delete( '/applications/' + incomplete_id )
            .send( Auth.sign() )
            .expect( 200, done );
    });
});

describe( 'Applications Removal', function () {
    it ( 'remove the previously created application', function ( done ) {
        request( server )
            .delete( '/applications/' + app )
            .send( Auth.sign() )
            .expect( 200, done );
    });

    it ( 'get a 404 error when attempting to remove an invalid application', function ( done ) {
        request( server )
            .delete( '/applications/not_there' )
            .send( Auth.sign() )
            .expect( 404, done );
    });
});

describe( 'Users', function () {
    var user        = {
            email       : 'testing@cursa.me',
            external_id : -1415364,
            name        : 'UnitTesting',
            network     : '5758b12dd9000d670eb7bb33',
            pass        : 'unittest',
            type        : 0
        },
        user_id     = '',
        hashed_pass = '';

    it ( 'get a 403 error when attempting to create an user with invalid data', function ( done ) {
        request( server )
            .post( '/users' )
            .send( Auth.sign({ email : user.email }) )
            .expect( 403, done );
    });

    it ( 'create a user in the system', function ( done ) {
        request( server )
            .post( '/users' )
            .send( Auth.sign( user ) )
            .end( function ( err, res ) {
                if ( err ) {
                    throw err;
                }

                res.body.should.have.property( '_id' );
                res.body.should.have.property( 'email' );
                res.body.should.have.property( 'external_id' );
                res.body.should.have.property( 'name' );
                res.body.should.have.property( 'pass' );
                res.body.should.have.property( 'type' );

                user_id     = res.body._id;
                hashed_pass = res.body.pass;
                done();
            });
    });

    it ( 'get a 404 error when attempting to update an unexisting user', function ( done ) {
        request( server )
            .put( '/users/125253' )
            .send( Auth.sign({ name : 'UnitTestingUser' }) )
            .expect( 404, done );
    });

    it ( 'update the created user without changing the password', function ( done ) {
        request( server )
            .put( '/users/' + user_id )
            .send( Auth.sign({ name : 'UnitTestingUser', pass : 'mod_pass' }) )
            .end( function ( err, res ) {
                if ( err ) {
                    throw err;
                }

                res.body.should.have.property( 'name' );

                assert.equal( 'UnitTestingUser', res.body.name );
                assert.equal( hashed_pass, res.body.pass );
                done();
            });
    });

    it ( 'get a 404 error when attempting to remove an unexisting user', function ( done ) {
        request( server )
            .delete( '/users/131553' )
            .send( Auth.sign() )
            .expect( 404, done );
    });

    it ( 'removes the user created for testing purposes', function ( done ) {
        request( server )
            .delete( '/users/' + user_id )
            .send( Auth.sign() )
            .expect( 200, done );
    });
});