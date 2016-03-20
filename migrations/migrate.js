var Users           = require( './users' ),
    Utils           = require( '../lib/utils' );
    numberStudents  = process.argv[2];

Utils.connectDB();

Users.create( 2, numberStudents, function ( total ) {
    console.log( 'Students created: ' + numberStudents );
    process.exit();
});