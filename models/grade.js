var mongoose    = require( 'mongoose' ),
    GradeSchema = new mongoose.Schema({
        course          : {
            type        : mongoose.Schema.Types.ObjectId,
            ref         : 'Course',
            required    : true
        },
        date            : {
            type        : Date,
            required    : true,
            default     : Date.now
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

module.exports  = mongoose.model( 'Grade', GradeSchema );