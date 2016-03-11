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
        students        : [{
            type        : mongoose.Schema.Types.ObjectId,
            ref         : 'User',
            required    : true
        }]
    });

module.exports          = mongoose.model( 'Discussion', DiscussionSchema );