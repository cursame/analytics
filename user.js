var mongoose    = require( 'mongoose' ),
    db          = require( './config/db' ),
    User        = require( './models/user' ),
    name        = process.argv[2],
    email       = process.argv[3],
    pass        = process.argv[4],
    type        = process.argv[5],
    conn_str    = 'mongodb://';

if ( db.user ) {
    conn_str    += db.user;
    if ( db.pass ) {
        conn_str    += ':' + db.pass;
    }

    conn_str    += '@';
}
conn_str        += db.host + ':' + db.port + '/' + db.database;

mongoose.connect( conn_str );

User.create({
    email   : email,
    name    : name,
    pass    : pass,
    type    : type
}, function ( err, user ) {
    if ( err || !user ) {
        console.log( '============= ERROR ==============' );
    } else {
        console.log( '============= USER ==============' );
        console.log( 'Name - ' + user.name );
        console.log( 'Email - ' + user.email );
        console.log( 'Pass - ' + pass );
        console.log( 'Type - ' + user.type );
    }

    process.exit();
});