var assert  = require( 'assert' ),
    should  = require( 'should' ),
    request = require( 'supertest' ),
    server  = require( '../server' ),
    Auth    = require( './lib/auth' );

describe( 'Courses Resource', function () {
    var assignment      = {
            date        : ( new Date() ).toISOString(),
            due_date    : ( new Date() ).toISOString(),
            name        : 'Test Assignment',
            students    : []
        },
        assignment_id   = '',
        comment         = {
            comment     : 'Test comment',
            date        : ( new Date() ).toISOString()
        },
        comment_id      = '',
        course          = {
            description : 'Unit test course',
            end         : ( new Date() ).toISOString(),
            name        : 'UnitTest',
            start       : ( new Date() ).toISOString(),
            students    : []
        },
        course_id       = '',
        discussion      = {
            date        : ( new Date() ).toISOString(),
            name        : 'Test Discussion',
            students    : []
        },
        discussion_id   = '',
        file            = {
            date        : ( new Date() ).toISOString(),
            file        : 'TestFile.jpg'
        },
        file_id         = '',
        grade           = {
            date        : ( new Date() ).toISOString(),
            grade       : 9.5
        },
        grade_id        = '',
        login           = {
            date        : ( new Date() ).toISOString()
        },
        login_id        = '',
        questionary     = {
            date        : ( new Date() ).toISOString(),
            name        : 'Test Questionary',
            students    : []
        },
        questionary_id  = '',
        student         = {
            email       : 'student@cursa.me',
            external_id : 'student_1',
            name        : 'John Doe',
            type        : 5
        },
        student_id      = '',
        teacher         = {
            email       : 'teacher@cursa.me',
            external_id : 'teacher_1',
            name        : 'Jane Doe',
            type        : 4
        },
        teacher_id      = '';

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

                student_id          = res.body._id;
                comment.student     = res.body._id;
                grade.student       = res.body._id;
                login.user          = res.body._id;

                login.type          = res.body.type;

                course.students.push( res.body._id );
                assignment.students.push( res.body._id );
                discussion.students.push( res.body._id );
                questionary.students.push( res.body._id );
                done();
            });
    });

    it ( 'gets a 403 error when attempting to create an invalid course', function ( done ) {
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

                course_id           = res.body._id;
                assignment.course   = res.body._id;
                comment.course      = res.body._id;
                discussion.course   = res.body._id;
                file.course         = res.body._id;
                grade.course        = res.body._id;
                questionary.course  = res.body._id;
                done();
            });
    });

    it ( 'gets a list of courses from the system setting the course name and teacher as optional filters', function ( done ) {
        request( server )
            .get( '/courses?$or={"name":"' + course.name + '"}&$or={"teacher":"' + teacher_id + '"}' )
            .send( Auth.sign() )
            .end( function ( err, res ) {
                if ( err ) {
                    throw err;
                }

                res.body.should.have.property( 'pagination' );
                res.body.should.have.property( 'results' );
                res.body.pagination.should.have.property( 'total' );
                res.body.pagination.should.have.property( 'page' );
                res.body.pagination.should.have.property( 'per_page' );

                res.body.results[0].should.have.property( 'description' );
                res.body.results[0].should.have.property( 'end' );
                res.body.results[0].should.have.property( 'name' );
                res.body.results[0].should.have.property( 'start' );
                res.body.results[0].should.have.property( 'students' );
                res.body.results[0].should.have.property( 'teacher' );

                assert.equal( 'string', typeof res.body.results[0].students[0] );
                assert.equal( 'string', typeof res.body.results[0].teacher );
                assert.equal( true, Array.isArray( res.body.results ) );
                done();
            });
    });

    it ( 'gets an expanded list of courses from the system', function ( done ) {
        request( server )
            .get( '/courses?expanded=true' )
            .send( Auth.sign() )
            .end( function ( err, res ) {
                if ( err ) {
                    throw err;
                }

                res.body.should.have.property( 'pagination' );
                res.body.should.have.property( 'results' );
                res.body.pagination.should.have.property( 'total' );
                res.body.pagination.should.have.property( 'page' );
                res.body.pagination.should.have.property( 'per_page' );

                res.body.results[0].should.have.property( 'description' );
                res.body.results[0].should.have.property( 'end' );
                res.body.results[0].should.have.property( 'name' );
                res.body.results[0].should.have.property( 'start' );
                res.body.results[0].should.have.property( 'students' );
                res.body.results[0].should.have.property( 'teacher' );

                assert.equal( 'object', typeof res.body.results[0].students[0] );
                assert.equal( 'object', typeof res.body.results[0].teacher );
                assert.equal( true, Array.isArray( res.body.results ) );
                done();
            });
    });

    it ( 'gets a 403 error when attempting to create an invalid assignment object', function ( done ) {
        request( server )
            .post( '/assignments' )
            .send( Auth.sign({ students : assignment.students, date : assignment.date }) )
            .expect( 403, done );
    });

    it ( 'creates an assignment record in the system', function ( done ) {
        request( server )
            .post( '/assignments' )
            .send( Auth.sign( assignment ) )
            .end( function ( err, res ) {
                if ( err ) {
                    throw err;
                }

                res.body.should.have.property( '_id' );
                res.body.should.have.property( 'course' );
                res.body.should.have.property( 'date' );
                res.body.should.have.property( 'due_date' );
                res.body.should.have.property( 'students' );

                assert.equal( true, Array.isArray( res.body.students ) );
                assignment_id   = res.body._id;
                done();
            });
    });

    it ( 'gets a list of assignments from the system', function ( done ) {
        request( server )
            .get( '/assignments' )
            .send( Auth.sign() )
            .end( function ( err, res ) {
                if ( err ) {
                    throw err;
                }

                res.body.should.have.property( 'pagination' );
                res.body.should.have.property( 'results' );
                res.body.pagination.should.have.property( 'total' );
                res.body.pagination.should.have.property( 'page' );
                res.body.pagination.should.have.property( 'per_page' );

                res.body.results[0].should.have.property( 'course' );
                res.body.results[0].should.have.property( 'date' );
                res.body.results[0].should.have.property( 'name' );
                res.body.results[0].should.have.property( 'students' );

                assert.equal( 'string', typeof res.body.results[0].course );
                assert.equal( 'string', typeof res.body.results[0].students[0] );
                assert.equal( true, Array.isArray( res.body.results ) );
                done();
            });
    });

    it ( 'gets an extended list of assignments filtered by course, setting the select fields of the query', function ( done ) {
        request( server )
            .get( '/assignments?course=' + course_id + '&expanded=true&page=1&per_page=10&sort=course&order=DESC&select=course+name+students' )
            .send( Auth.sign() )
            .end( function ( err, res ) {
                if ( err ) {
                    throw err;
                }

                res.body.should.have.property( 'pagination' );
                res.body.should.have.property( 'results' );
                res.body.pagination.should.have.property( 'total' );
                res.body.pagination.should.have.property( 'page' );
                res.body.pagination.should.have.property( 'per_page' );

                res.body.results[0].should.have.property( 'course' );
                res.body.results[0].should.have.property( 'name' );
                res.body.results[0].should.have.property( 'students' );
                res.body.results[0].should.not.have.property( 'date' );

                assert.equal( 'object', typeof res.body.results[0].course );
                assert.equal( 'object', typeof res.body.results[0].students[0] );
                assert.equal( true, Array.isArray( res.body.results ) );
                done();
            });
    });

    it ( 'gets an aggregated list of courses by course', function ( done ) {
        request( server )
            .get( '/assignments?aggregate=course&course=' + course_id )
            .send( Auth.sign() )
            .end( function ( err, res ) {
                if ( err ) {
                    throw err;
                }

                res.body.should.have.property( 'pagination' );
                res.body.should.have.property( 'results' );
                res.body.pagination.should.have.property( 'total' );
                res.body.pagination.should.have.property( 'page' );
                res.body.pagination.should.have.property( 'per_page' );

                res.body.results[0].should.have.property( '_id' );
                res.body.results[0].should.have.property( 'count' );

                done();
            });
    });

    it ( 'gets a 404 error when attempting to remove an unexisting assignment', function ( done ) {
        request( server )
            .delete( '/assignments/1241225' )
            .send( Auth.sign() )
            .expect( 404, done );
    });

    it ( 'removes the created assignment record', function ( done ) {
        request( server )
            .delete( '/assignments/' + assignment_id )
            .send( Auth.sign() )
            .expect( 200, done );
    });

    it ( 'gets a 403 error when attempting to create an invalid comment object', function ( done ) {
        request( server )
            .post( '/comments' )
            .send( Auth.sign({ student : comment.students, date : comment.date }) )
            .expect( 403, done );
    });

    it ( 'creates an comment record in the system', function ( done ) {
        request( server )
            .post( '/comments' )
            .send( Auth.sign( comment ) )
            .end( function ( err, res ) {
                if ( err ) {
                    throw err;
                }

                res.body.should.have.property( '_id' );
                res.body.should.have.property( 'comment' );
                res.body.should.have.property( 'course' );
                res.body.should.have.property( 'date' );
                res.body.should.have.property( 'student' );

                comment_id   = res.body._id;
                done();
            });
    });

    it ( 'gets a list of comments from the system setting the course and student as inclusive filters', function ( done ) {
        request( server )
            .get( '/comments?$and={"course":"' + course_id + '"}&$and={"student":"' + student_id + '"}' )
            .send( Auth.sign() )
            .end( function ( err, res ) {
                if ( err ) {
                    throw err;
                }

                res.body.should.have.property( 'pagination' );
                res.body.should.have.property( 'results' );
                res.body.pagination.should.have.property( 'total' );
                res.body.pagination.should.have.property( 'page' );
                res.body.pagination.should.have.property( 'per_page' );

                res.body.results[0].should.have.property( 'comment' );
                res.body.results[0].should.have.property( 'course' );
                res.body.results[0].should.have.property( 'date' );
                res.body.results[0].should.have.property( 'student' );

                assert.equal( 'string', typeof res.body.results[0].course );
                assert.equal( 'string', typeof res.body.results[0].student );
                assert.equal( true, Array.isArray( res.body.results ) );
                done();
            });
    });

    it ( 'gets a 404 error when attempting to remove an unexisting comment', function ( done ) {
        request( server )
            .delete( '/comments/1241225' )
            .send( Auth.sign() )
            .expect( 404, done );
    });

    it ( 'removes the created comment record', function ( done ) {
        request( server )
            .delete( '/comments/' + comment_id )
            .send( Auth.sign() )
            .expect( 200, done );
    });

    it ( 'gets a 403 error when attempting to create an invalid discussion object', function ( done ) {
        request( server )
            .post( '/discussions' )
            .send( Auth.sign({ students : discussion.students, date : discussion.date }) )
            .expect( 403, done );
    });

    it ( 'creates an discussion record in the system', function ( done ) {
        request( server )
            .post( '/discussions' )
            .send( Auth.sign( discussion ) )
            .end( function ( err, res ) {
                if ( err ) {
                    throw err;
                }

                res.body.should.have.property( '_id' );
                res.body.should.have.property( 'course' );
                res.body.should.have.property( 'date' );
                res.body.should.have.property( 'name' );
                res.body.should.have.property( 'students' );

                assert.equal( true, Array.isArray( res.body.students ) );
                discussion_id   = res.body._id;
                done();
            });
    });

    it ( 'gets a list of discussions from the system filtered by date', function ( done ) {
        request( server )
            .get( '/discussions?date=' + discussion.date )
            .send( Auth.sign() )
            .end( function ( err, res ) {
                if ( err ) {
                    throw err;
                }

                res.body.should.have.property( 'pagination' );
                res.body.should.have.property( 'results' );
                res.body.pagination.should.have.property( 'total' );
                res.body.pagination.should.have.property( 'page' );
                res.body.pagination.should.have.property( 'per_page' );

                res.body.results[0].should.have.property( 'course' );
                res.body.results[0].should.have.property( 'date' );
                res.body.results[0].should.have.property( 'name' );
                res.body.results[0].should.have.property( 'students' );

                assert.equal( 'string', typeof res.body.results[0].course );
                assert.equal( 'string', typeof res.body.results[0].students[0] );
                assert.equal( true, Array.isArray( res.body.results ) );
                done();
            });
    });

    it ( 'gets a 404 error when attempting to remove an unexisting discussion', function ( done ) {
        request( server )
            .delete( '/discussions/1241225' )
            .send( Auth.sign() )
            .expect( 404, done );
    });

    it ( 'removes the created discussion record', function ( done ) {
        request( server )
            .delete( '/discussions/' + discussion_id )
            .send( Auth.sign() )
            .expect( 200, done );
    });

    it ( 'gets a 403 error when attempting to create an invalid file object', function ( done ) {
        request( server )
            .post( '/files' )
            .send( Auth.sign({ date : file.date, file : file.file }) )
            .expect( 403, done );
    });

    it ( 'creates an file record in the system', function ( done ) {
        request( server )
            .post( '/files' )
            .send( Auth.sign( file ) )
            .end( function ( err, res ) {
                if ( err ) {
                    throw err;
                }

                res.body.should.have.property( '_id' );
                res.body.should.have.property( 'course' );
                res.body.should.have.property( 'date' );
                res.body.should.have.property( 'file' );

                file_id   = res.body._id;
                done();
            });
    });

    it ( 'gets a list of files from the system', function ( done ) {
        request( server )
            .get( '/files' )
            .send( Auth.sign() )
            .end( function ( err, res ) {
                if ( err ) {
                    throw err;
                }

                res.body.should.have.property( 'pagination' );
                res.body.should.have.property( 'results' );
                res.body.pagination.should.have.property( 'total' );
                res.body.pagination.should.have.property( 'page' );
                res.body.pagination.should.have.property( 'per_page' );

                res.body.results[0].should.have.property( 'course' );
                res.body.results[0].should.have.property( 'date' );
                res.body.results[0].should.have.property( 'file' );

                assert.equal( 'string', typeof res.body.results[0].course );
                assert.equal( true, Array.isArray( res.body.results ) );
                done();
            });
    });

    it ( 'gets a 404 error when attempting to remove an unexisting file', function ( done ) {
        request( server )
            .delete( '/files/1241225' )
            .send( Auth.sign() )
            .expect( 404, done );
    });

    it ( 'removes the created file record', function ( done ) {
        request( server )
            .delete( '/files/' + file_id )
            .send( Auth.sign() )
            .expect( 200, done );
    });

    it ( 'gets a 403 error when attempting to create an invalid grade object', function ( done ) {
        request( server )
            .post( '/grades' )
            .send( Auth.sign({ student : grade.student, date : grade.date }) )
            .expect( 403, done );
    });

    it ( 'creates an grade record in the system', function ( done ) {
        request( server )
            .post( '/grades' )
            .send( Auth.sign( grade ) )
            .end( function ( err, res ) {
                if ( err ) {
                    throw err;
                }

                res.body.should.have.property( '_id' );
                res.body.should.have.property( 'course' );
                res.body.should.have.property( 'date' );
                res.body.should.have.property( 'grade' );
                res.body.should.have.property( 'student' );

                grade_id   = res.body._id;
                done();
            });
    });

    it ( 'gets a list of grades from the system', function ( done ) {
        request( server )
            .get( '/grades' )
            .send( Auth.sign() )
            .end( function ( err, res ) {
                if ( err ) {
                    throw err;
                }

                res.body.should.have.property( 'pagination' );
                res.body.should.have.property( 'results' );
                res.body.pagination.should.have.property( 'total' );
                res.body.pagination.should.have.property( 'page' );
                res.body.pagination.should.have.property( 'per_page' );

                res.body.results[0].should.have.property( 'course' );
                res.body.results[0].should.have.property( 'date' );
                res.body.results[0].should.have.property( 'grade' );
                res.body.results[0].should.have.property( 'student' );

                assert.equal( 'string', typeof res.body.results[0].course );
                assert.equal( 'string', typeof res.body.results[0].student );
                assert.equal( true, Array.isArray( res.body.results ) );
                done();
            });
    });

    it ( 'gets a 404 error when attempting to remove an unexisting grade', function ( done ) {
        request( server )
            .delete( '/grades/1241225' )
            .send( Auth.sign() )
            .expect( 404, done );
    });

    it ( 'removes the created grade record', function ( done ) {
        request( server )
            .delete( '/grades/' + grade_id )
            .send( Auth.sign() )
            .expect( 200, done );
    });

    it ( 'gets a 403 error when attempting to create an invalid login object', function ( done ) {
        request( server )
            .post( '/logins' )
            .send( Auth.sign({ user : login.user, date : login.date }) )
            .expect( 403, done );
    });

    it ( 'creates an login record in the system', function ( done ) {
        request( server )
            .post( '/logins' )
            .send( Auth.sign( login ) )
            .end( function ( err, res ) {
                if ( err ) {
                    throw err;
                }

                res.body.should.have.property( '_id' );
                res.body.should.have.property( 'date' );
                res.body.should.have.property( 'type' );
                res.body.should.have.property( 'user' );

                login_id   = res.body._id;
                done();
            });
    });

    it ( 'gets a list of logins from the system', function ( done ) {
        request( server )
            .get( '/logins' )
            .send( Auth.sign() )
            .end( function ( err, res ) {
                if ( err ) {
                    throw err;
                }

                res.body.should.have.property( 'pagination' );
                res.body.should.have.property( 'results' );
                res.body.pagination.should.have.property( 'total' );
                res.body.pagination.should.have.property( 'page' );
                res.body.pagination.should.have.property( 'per_page' );

                res.body.results[0].should.have.property( 'date' );
                res.body.results[0].should.have.property( 'type' );
                res.body.results[0].should.have.property( 'user' );

                assert.equal( 'string', typeof res.body.results[0].user );
                assert.equal( true, Array.isArray( res.body.results ) );
                done();
            });
    });

    it ( 'gets a 404 error when attempting to remove an unexisting login', function ( done ) {
        request( server )
            .delete( '/logins/1241225' )
            .send( Auth.sign() )
            .expect( 404, done );
    });

    it ( 'removes the created login record', function ( done ) {
        request( server )
            .delete( '/logins/' + login_id )
            .send( Auth.sign() )
            .expect( 200, done );
    });

    it ( 'gets a 403 error when attempting to create an invalid questionary object', function ( done ) {
        request( server )
            .post( '/questionaries' )
            .send( Auth.sign({ students : questionary.students, date : questionary.date }) )
            .expect( 403, done );
    });

    it ( 'creates an questionary record in the system', function ( done ) {
        request( server )
            .post( '/questionaries' )
            .send( Auth.sign( questionary ) )
            .end( function ( err, res ) {
                if ( err ) {
                    throw err;
                }

                res.body.should.have.property( '_id' );
                res.body.should.have.property( 'course' );
                res.body.should.have.property( 'date' );
                res.body.should.have.property( 'name' );
                res.body.should.have.property( 'students' );

                assert.equal( true, Array.isArray( res.body.students ) );
                questionary_id   = res.body._id;
                done();
            });
    });

    it ( 'gets a list of questionaries from the system', function ( done ) {
        request( server )
            .get( '/questionaries' )
            .send( Auth.sign() )
            .end( function ( err, res ) {
                if ( err ) {
                    throw err;
                }

                res.body.should.have.property( 'pagination' );
                res.body.should.have.property( 'results' );
                res.body.pagination.should.have.property( 'total' );
                res.body.pagination.should.have.property( 'page' );
                res.body.pagination.should.have.property( 'per_page' );

                res.body.results[0].should.have.property( 'course' );
                res.body.results[0].should.have.property( 'date' );
                res.body.results[0].should.have.property( 'name' );
                res.body.results[0].should.have.property( 'students' );

                assert.equal( 'string', typeof res.body.results[0].course );
                assert.equal( 'string', typeof res.body.results[0].students[0] );
                assert.equal( true, Array.isArray( res.body.results ) );
                done();
            });
    });

    it ( 'gets a 404 error when attempting to remove an unexisting questionary', function ( done ) {
        request( server )
            .delete( '/questionaries/1241225' )
            .send( Auth.sign() )
            .expect( 404, done );
    });

    it ( 'removes the created questionary record', function ( done ) {
        request( server )
            .delete( '/questionaries/' + questionary_id )
            .send( Auth.sign() )
            .expect( 200, done );
    });

    it ( 'gets a 404 error when attempting to remove an unexisting course', function ( done ) {
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