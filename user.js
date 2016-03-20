var Utils       = require( './lib/utils' ),
    User        = require( './models/user' ),
    name        = process.argv[2],
    email       = process.argv[3],
    ext_id      = process.argv[4],
    pass        = process.argv[5],
    type        = process.argv[6];

Utils.connectDB();

User.create({
    email       : email,
    external_id : ext_id,
    name        : name,
    pass        : pass,
    type        : type
}, function ( err, user ) {
    if ( err || !user ) {
        console.log( '============= ERROR ==============' );
        console.log( err );
    } else {
        console.log( '============= USER ==============' );
        console.log( 'Name - ' + user.name );
        console.log( 'Email - ' + user.email );
        console.log( 'External ID - ' + user.external_id );
        console.log( 'Pass - ' + pass );
        console.log( 'Type - ' + user.type );
    }

    process.exit();
});