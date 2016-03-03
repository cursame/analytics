var mongoose        = require( 'mongoose' ),
    CommentSchema   = new mongoose.Schema({
        comment         : {
            type        : String,
            required    : true
        },
        course          : {
            type        : mongoose.Schema.Types.ObjectId,
            ref         : 'Course',
            required    : true
        },
        date            : {
            type        : Date,
            required    : true
        },
        student         : {
            type        : mongoose.Schema.Types.ObjectId,
            ref         : 'User',
            required    : true
        }
    });

CommentSchema.pre( 'save', function ( next ) {
    if ( this.course && this.isModified( 'course' ) ) {
        this.course     = new mongoose.Types.ObjectId( this.course );
    }

    if ( this.student && this.isModified( 'student' ) ) {
        this.student    = new mongoose.Types.ObjectId( this.student );
    }

    next();
});

module.exports      = mongoose.model( 'Comment', CommentSchema );