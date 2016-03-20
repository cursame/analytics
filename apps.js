// Load the required libraries
var Encrypt     = require( './lib/encrypt' ),
    Utils       = require( './lib/utils' ),
    Application = require( './models/application' ),
    UnitTest    = false,
    WebClient   = false;

Utils.connectDB();

Application.create({
    description : 'Unit testing application',
    name        : 'UnitTest',
    permissions : [
        'applications_create',
        'applications_delete',
        'applications_update',
        'applications_read',
        'comments_create',
        'comments_delete',
        'comments_read',
        'courses_create',
        'courses_delete',
        'courses_read',
        'discussions_create',
        'discussions_delete',
        'discussions_read',
        'files_create',
        'files_delete',
        'files_read',
        'grades_create',
        'grades_delete',
        'grades_read',
        'logins_create',
        'logins_delete',
        'logins_read',
        'questionaries_create',
        'questionaries_delete',
        'questionaries_read',
        'grades_create',
        'grades_delete',
        'grades_read',
        'grades_create',
        'grades_delete',
        'grades_read',
        'users_create',
        'users_delete',
        'users_read',
        'users_update',
        'sessions_create',
        'sessions_delete'
    ]
}, function ( err, application ) {
    UnitTest    = true;
    console.log( '============= UnitTest ==============' );
    console.log( 'Application ID: ' + application.id );
    console.log( 'Application Secret: ' + Encrypt.decode( application.secret ) );

    if ( UnitTest && WebClient ) {
        process.exit();
    }
});

Application.create({
    description : 'Web client application',
    name        : 'NGAnalytics',
    permissions : [
        'applications_create',
        'applications_delete',
        'applications_update',
        'applications_read',
        'comments_delete',
        'comments_read',
        'courses_delete',
        'courses_read',
        'discussions_delete',
        'discussions_read',
        'files_delete',
        'files_read',
        'grades_delete',
        'grades_read',
        'logins_delete',
        'logins_read',
        'questionaries_delete',
        'questionaries_read',
        'grades_delete',
        'grades_read',
        'grades_delete',
        'grades_read',
        'users_create',
        'users_delete',
        'users_read',
        'users_update',
        'sessions_create',
        'sessions_delete'
    ]
}, function ( err, application ) {
    WebClient   = true;
    console.log( '============= WebClient ==============' );
    console.log( 'Application ID: ' + application.id );
    console.log( 'Application Secret: ' + Encrypt.decode( application.secret ) );

    if ( UnitTest && WebClient ) {
        process.exit();
    }
});