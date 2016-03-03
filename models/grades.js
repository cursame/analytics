var mongoose    = require( 'mongoose' ),
    GradeSchema = new mongoose.Schema({
        course          : {
            type        : mongoose.Schema.Types.ObjectId,
            ref         : 'Course',
            required    : true
        },
        grade           : {
            type        : Number,
            required    : true
        },
        student         : {
            type        : mongoose.Schema.Types.ObjectId,
            ref         : 'User',
            required    : true
        }
    });

GradeSchema.pre( 'save', function ( next ) {
    if ( this.course && this.isModified( 'course' ) ) {
        this.course     = new mongoose.Types.ObjectId( this.course );
    }

    if ( this.student && this.isModified( 'student' ) ) {
        this.student    = new mongoose.Types.ObjectId( this.student );
    }

    next();
});

module.exports  = mongoose.model( 'Grade', GradeSchema );