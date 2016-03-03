var mongoose        = require( 'mongoose' ),
    CourseSchema    = new mongoose.Schema({
        description     : {
            type        : String,
            required    : true
        },
        end             : {
            type        : Date,
            required    : true
        },
        name            : {
            type        : String,
            required    : true
        },
        start           : {
            type        : Date,
            required    : true
        },
        students        : {
            type        : [ mongoose.Schema.Types.ObjectId ],
            ref         : 'User',
            required    : true
        }
        teacher         : {
            type        : mongoose.Schema.Types.ObjectId,
            ref         : 'User',
            required    : true
        }
    });

CourseSchema.pre( 'save', function ( next ) {
    if ( this.students && this.isModified( 'students' ) ) {
        for ( var i = 0; i < this.students.length; i++ ) {
            if ( !( this.students[i] instanceof mongoose.Types.ObjectId ) ) {
                this.students[i]    = new mongoose.Types.ObjectId( this.students[i] );
            }
        }
    }

    if ( this.teacher && this.isModified( 'teacher' ) ) {
        this.teacher    = new mongoose.Types.ObjectId( this.teacher );
    }

    next();
});

module.exports      = mongoose.model( 'Course', CourseSchema );