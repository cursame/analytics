var mongoose            = require( 'mongoose' ),
    DiscussionSchema    = new mongoose.Schema({
        course          : {
            type        : mongoose.Schema.Types.ObjectId,
            ref         : 'Course',
            required    : true
        },
        date            : {
            type        : Date,
            required    : true
        },
        name            : {
            type        : String,
            required    : true
        },
        students        : {
            type        : [ mongoose.Schema.Types.ObjectId ],
            ref         : 'User',
            required    : true
        }
    });

DiscussionSchema.pre( 'save', function ( next ) {
    if ( this.course && this.isModified( 'course' ) ) {
        this.course     = new mongoose.Types.ObjectId( this.course );
    }

    if ( this.students && this.isModified( 'students' ) ) {
        for ( var i = 0; i < this.students.length; i++ ) {
            if ( !( this.students[i] instanceof mongoose.Types.ObjectId ) ) {
                this.students[i]    = new mongoose.Types.ObjectId( this.students[i] );
            }
        }
    }

    next();
});

module.exports          = mongoose.model( 'Discussion', DiscussionSchema );