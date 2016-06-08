var mongoose    = require( 'mongoose' ),
    FileSchema  = new mongoose.Schema({
        course          : {
            type        : mongoose.Schema.Types.ObjectId,
            ref         : 'Course',
            required    : true
        },
        date            : {
            type        : Date,
            required    : true
        },
        file            : {
            type        : String,
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
        }
    });

module.exports      = mongoose.model( 'File', FileSchema );