var mongoose        = require( 'mongoose' ),
    TeacherSchema   = new mongoose.Schema({
        avatar          : {
            type        : String,
            required    : false
        },
        creation_date   : {
            type        : Date,
            required    : true,
            default     : Date.now
        },
        email           : {
            type        : String,
            required    : true,
            index       : {
                unique  : true
            }
        },
        external_id     : {
            type        : String,
            required    : true,
            index       : {
                unique  : true
            }
        },
        last_access     : {
            type        : Date,
            required    : false
        },
        name            : {
            type        : String,
            required    : true
        }
    });

module.exports      = mongoose.model( 'Teacher', TeacherSchema );