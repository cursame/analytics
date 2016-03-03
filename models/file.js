var mongoose    = require( 'mongoose' ),
    FileSchema  = new mongoose.Schema({
        course          : {
            type        : mongoose.Schema.Types.ObjectId,
            ref         : 'Course',
            required    : true
        },
        date            : {
            type        : Date,
            required    : true
        },
        file            : {
            type        : String,
            required    : true
        }
    });

FileSchema.pre( 'save', function ( next ) {
    if ( this.course && this.isModified( 'course' ) ) {
        this.course     = new mongoose.Types.ObjectId( this.course );
    }

    next();
});

module.exports      = mongoose.model( 'File', FileSchema );