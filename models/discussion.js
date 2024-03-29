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
        network         : {
            type        : mongoose.Schema.Types.ObjectId,
            ref         : 'Network',
            required    : true
        },
        students        : [{
            type        : mongoose.Schema.Types.ObjectId,
            ref         : 'User',
            required    : true
        }],
        teacher         : {
            type        : mongoose.Schema.Types.ObjectId,
            ref         : 'User',
            required    : false
        }
    });

module.exports          = mongoose.model( 'Discussion', DiscussionSchema );