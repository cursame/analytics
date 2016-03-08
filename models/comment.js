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

module.exports      = mongoose.model( 'Comment', CommentSchema );