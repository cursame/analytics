var async               = require( 'async' ),
    Activities          = require( './activities' ),
    Assignments         = require( './assignments' ),
    Comments            = require( './comments' ),
    Courses             = require( './courses' ),
    Discussions         = require( './discussions' ),
    Files               = require( './files' ),
    Grades              = require( './grades' ),
    Logins              = require( './logins' ),
    Networks            = require( './networks' ),
    Questionaries       = require( './questionaries' ),
    Users               = require( './users' ),
    Utils               = require( '../lib/utils' );
    numberNetworks      = process.argv[2],
    numberStudents      = process.argv[3],
    numberTeachers      = process.argv[4],
    numberAdmins        = process.argv[5],
    numberCourses       = process.argv[6],
    numberAssignments   = process.argv[7],
    numberComments      = process.argv[8],
    numberDiscussions   = process.argv[9],
    numberFiles         = process.argv[10],
    numberGrades        = process.argv[11],
    numberLogins        = process.argv[12],
    numberQuestionaries = process.argv[13],
    numberActivities    = process.argv[14];

Utils.connectDB();

async.series([
    function ( callback ) {
        if ( numberNetworks !== undefined && numberNetworks > 0 ) {
            Networks.create( numberNetworks, function ( total ) {
                callback( null, total );
            });
        } else {
            callback( null, 0 );
        }
    },
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
        if ( numberAdmins !== undefined && numberAdmins > 0 ) {
            Users.create( 3, numberAdmins, function ( total ) {
                callback( null, total );
            });
        } else {
            callback( null, 0 );
        }
    },
    function ( callback ) {
        if ( numberCourses !== undefined && numberCourses > 0 ) {
            Courses.create( numberCourses, 2, function ( total ) {
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
    },
    function ( callback ) {
        if ( numberComments !== undefined && numberComments > 0 ) {
            Comments.create( numberComments, function ( total ) {
                callback( null, total );
            });
        } else {
            callback( null, 0 );
        }
    },
    function ( callback ) {
        if ( numberDiscussions !== undefined && numberDiscussions > 0 ) {
            Discussions.create( numberDiscussions, function ( total ) {
                callback( null, total );
            });
        } else {
            callback( null, 0 );
        }
    },
    function ( callback ) {
        if ( numberFiles !== undefined && numberFiles > 0 ) {
            Files.create( numberFiles, function ( total ) {
                callback( null, total );
            });
        } else {
            callback( null, 0 );
        }
    },
    function ( callback ) {
        if ( numberGrades !== undefined && numberGrades > 0 ) {
            Grades.create( numberGrades, function ( total ) {
                callback( null, total );
            });
        } else {
            callback( null, 0 );
        }
    },
    function ( callback ) {
        if ( numberLogins !== undefined && numberLogins > 0 ) {
            Logins.create( numberLogins, function ( total ) {
                callback( null, total );
            });
        } else {
            callback( null, 0 );
        }
    },
    function ( callback ) {
        if ( numberQuestionaries !== undefined && numberQuestionaries > 0 ) {
            Questionaries.create( numberQuestionaries, function ( total ) {
                callback( null, total );
            });
        } else {
            callback( null, 0 );
        }
    },
    function ( callback ) {
        if ( numberActivities !== undefined && numberActivities > 0 ) {
            Activities.create( numberActivities, function ( total ) {
                callback( null, total );
            });
        } else {
            callback( null, 0 );
        }
    }
], function ( err, results ) {
    console.log( 'Networks created: ' + results[0] );
    console.log( 'Students created: ' + results[1] );
    console.log( 'Teachers created: ' + results[2] );
    console.log( 'Admins created: ' + results[3] );
    console.log( 'Courses created: ' + results[4] );
    console.log( 'Assignments created: ' + results[5] );
    console.log( 'Comments created: ' + results[6] );
    console.log( 'Discussions created: ' + results[7] );
    console.log( 'Files created: ' + results[8] );
    console.log( 'Grades created: ' + results[9] );
    console.log( 'Logins created: ' + results[10] );
    console.log( 'Questionaries created: ' + results[11] );
    console.log( 'Activities created: ' + results[12] );
    process.exit();
});