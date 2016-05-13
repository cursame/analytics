// Load the required libraries
var Encrypt     = require( './lib/encrypt' ),
    Utils       = require( './lib/utils' ),
    Application = require( './models/application' );

Utils.connectDB();

Application.create({
    description : 'Application for the cursame platform integration',
    name        : 'CursameAPP',
    permissions : [
        'comments_create',
        'comments_read',
        'courses_create',
        'courses_read',
        'discussions_create',
        'discussions_read',
        'files_create',
        'files_read',
        'grades_create',
        'grades_read',
        'logins_create',
        'logins_read',
        'questionaries_create',
        'questionaries_read',
        'grades_create',
        'grades_read',
        'grades_create',
        'grades_read',
        'users_create',
        'users_read',
        'users_update',
        'sessions_create',
        'sessions_delete'
    ]
}, function ( err, application ) {
    console.log( '============= CursameAPP ==============' );
    console.log( 'Application ID: ' + application.id );
    console.log( 'Application Secret: ' + Encrypt.decode( application.secret ) );

    process.exit();
});