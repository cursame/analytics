var assert      = require( 'assert' ),
    should      = require( 'should' ),
    request     = require( 'supertest' ),
    server      = require( '../server' ),
    Auth        = require( './lib/auth' );

describe( 'Courses Resource', function () {
    var course      = {
            description : 'Unit test course',
            end         : ( new Date() ).toISOString(),
            name        : 'UnitTest',
            start       : ( new Date() ).toISOString(),
            students    : []
        },
        course_id   = '',
        student     = {
            email       : 'student@cursa.me',
            external_id : 'student_1',
            name        : 'John Doe',
            type        : 5
        },
        student_id  = '',
        teacher     = {
            email       : 'teacher@cursa.me',
            external_id : 'teacher_1',
            name        : 'Jane Doe',
            type        : 4
        },
        teacher_id  = '';

    it ( 'creates a teacher user in the system for the courses evaluation', function ( done ) {
        request( server )
            .post( '/users' )
            .send( Auth.sign( teacher ) )
            .end( function ( err, res ) {
                if ( err ) {
                    throw err;
                }

                teacher_id      = res.body._id;
                course.teacher  = res.body._id;
                done();
            });
    });

    it ( 'creates a student user in the system for the courses evaluation', function ( done ) {
        request( server )
            .post( '/users' )
            .send( Auth.sign( student ) )
            .end( function ( err, res ) {
                if ( err ) {
                    throw err;
                }

                student_id  = res.body._id;
                course.students.push( res.body._id );
                done();
            });
    });

    it ( 'get a 403 error when attempting to create an invalid course', function ( done ) {
        request( server )
            .post( '/courses' )
            .send( Auth.sign({ name : 'TestCourse', students : [ student_id ], teacher : teacher_id }) )
            .expect( 403, done );
    });

    it ( 'creates a course object in the application', function ( done ) {
        request( server )
            .post( '/courses' )
            .send( Auth.sign( course ) )
            .end( function ( err, res ) {
                if ( err ) {
                    throw err;
                }

                res.body.should.have.property( '_id' );
                res.body.should.have.property( 'description' );
                res.body.should.have.property( 'end' );
                res.body.should.have.property( 'name' );
                res.body.should.have.property( 'start' );
                res.body.should.have.property( 'students' );
                res.body.should.have.property( 'teacher' );

                course_id   = res.body._id;
                done();
            });
    });

    it ( 'get a 404 error when attempting to remove an unexisting course', function ( done ) {
        request( server )
            .delete( '/courses/14142' )
            .send( Auth.sign() )
            .expect( 404, done );
    });

    it ( 'removes the created course', function ( done ) {
        request( server )
            .delete( '/courses/' + course_id )
            .send( Auth.sign() )
            .expect( 200, done );
    });

    it ( 'removes the student user created', function ( done ) {
        request( server )
            .delete( '/users/' + student_id )
            .send( Auth.sign() )
            .expect( 200, done );
    });

    it ( 'removes the teacher user created', function ( done ) {
        request( server )
            .delete( '/users/' + teacher_id )
            .send( Auth.sign() )
            .expect( 200, done );
    });
});