var Students        = require( './students' ),
    Utils           = require( '../lib/utils' );
    numberStudents  = process.argv[2];

Utils.connectDB();

Students.create( numberStudents, function ( total ) {
    console.log( 'Students created: ' + numberStudents );
    process.exit();
});