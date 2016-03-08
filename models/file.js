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
        }
    });

module.exports      = mongoose.model( 'File', FileSchema );