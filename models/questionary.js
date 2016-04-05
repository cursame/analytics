var mongoose            = require( 'mongoose' ),
    QuestionarySchema   = new mongoose.Schema({
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
        }],
        teacher         : {
            type        : mongoose.Schema.Types.ObjectId,
            ref         : 'User',
            required    : true
        }
    });

module.exports          = mongoose.model( 'Questionary', QuestionarySchema );