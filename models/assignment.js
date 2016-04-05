var mongoose            = require( 'mongoose' ),
    AssignmentSchema    = new mongoose.Schema({
        course          : {
            type        : mongoose.Schema.Types.ObjectId,
            ref         : 'Course',
            required    : true
        },
        date            : {
            type        : Date,
            required    : true
        },
        due_date        : {
            type        : Date,
            required    : false
        },
        name            : {
            type        : String,
            required    : true
        },
        students        : [{
            type        : mongoose.Schema.Types.ObjectId,
            ref         : 'User',
            required    : false
        }],
        teacher         : {
            type        : mongoose.Schema.Types.ObjectId,
            ref         : 'User',
            required    : false
        }
    });

module.exports          = mongoose.model( 'Assignment', AssignmentSchema );