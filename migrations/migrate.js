var async               = require( 'async' ),
    Assignments         = require( './assignments' ),
    Courses             = require( './courses' ),
    Users               = require( './users' ),
    Utils               = require( '../lib/utils' );
    numberStudents      = process.argv[2],
    numberTeachers      = process.argv[3],
    numberCourses       = process.argv[4],
    numberAssignments   = process.argv[5];

Utils.connectDB();

async.series([
    function ( callback ) {
        if ( numberStudents !== undefined && numberStudents > 0 ) {
            Users.create( 2, numberStudents, function ( total ) {
                callback( null, total );
            });
        } else {
            callback( null, 0 );
        }
    },
    function ( callback ) {
        if ( numberTeachers !== undefined && numberTeachers > 0 ) {
            Users.create( 1, numberTeachers, function ( total ) {
                callback( null, total );
            });
        } else {
            callback( null, 0 );
        }
    },
    function ( callback ) {
        if ( numberCourses !== undefined && numberCourses > 0 ) {
            Courses.create( numberCourses, 15, function ( total ) {
                callback( null, total );
            });
        } else {
            callback( null, 0 );
        }
    },
    function ( callback ) {
        if ( numberAssignments !== undefined && numberAssignments > 0 ) {
            Assignments.create( numberAssignments, function ( total ) {
                callback( null, total );
            });
        } else {
            callback( null, 0 );
        }
    }
], function ( err, results ) {
    console.log( 'Students created: ' + results[0] );
    console.log( 'Teachers created: ' + results[1] );
    console.log( 'Courses created: ' + results[2] );
    console.log( 'Assignments created: ' + results[3] );
    process.exit();
});