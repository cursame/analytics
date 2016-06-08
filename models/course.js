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
        network         : {
            type        : mongoose.Schema.Types.ObjectId,
            ref         : 'Network',
            required    : true
        },
        start           : {
            type        : Date,
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

module.exports      = mongoose.model( 'Course', CourseSchema );