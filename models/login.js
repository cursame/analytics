var mongoose    = require( 'mongoose' ),
    LoginSchema = new mongoose.Schema({
        date            : {
            type        : Date,
            required    : true
        },
        network         : {
            type        : mongoose.Schema.Types.ObjectId,
            ref         : 'Network',
            required    : true
        },
        type            : {
            type        : Number,
            required    : true
        },
        user            : {
            type        : mongoose.Schema.Types.ObjectId,
            ref         : 'User',
            required    : true
        }
    });

module.exports  = mongoose.model( 'Login', LoginSchema );