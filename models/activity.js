var mongoose        = require( 'mongoose' ),
    ActivitySchema  = new mongoose.Schema({
        activity        : {
            type        : String,
            required    : true
        },
        course          : {
            type        : mongoose.Schema.Types.ObjectId,
            ref         : 'Course',
            required    : true
        },
        date            : {
            default     : Date.now,
            type        : Date,
            required    : true
        },
        network         : {
            type        : mongoose.Schema.Types.ObjectId,
            ref         : 'Network',
            required    : true
        },
        teacher         : {
            type        : mongoose.Schema.Types.ObjectId,
            ref         : 'User',
            required    : true
        },
        user            : {
            type        : mongoose.Schema.Types.ObjectId,
            ref         : 'User',
            required    : true
        }
    });

module.exports      = mongoose.model( 'Activity', ActivitySchema );