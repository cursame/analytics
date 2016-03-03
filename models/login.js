var mongoose    = require( 'mongoose' ),
    LoginSchema = new mongoose.Schema({
        date            : {
            type        : Date,
            required    : true
        },
        type            : {
            type        : Number,
            required    : true
        },
        user            : {
            type        : mongoose.Schema.Types.ObjectId,
            ref         : 'User',
            required    : true
        }
    });

LoginSchema.pre( 'save', function ( next ) {
    if ( this.user && this.isModified( 'user' ) ) {
        this.user   = new mongoose.Types.ObjectId( this.user );
    }

    next();
});

module.exports  = mongoose.model( 'Login', LoginSchema );