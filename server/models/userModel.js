var mongoose = require('mongoose'),
    uniqueValidator = require('mongoose-unique-validator'),
    autoIncrement = require('mongoose-auto-increment'),
    passportLocalMongoose = require('passport-local-mongoose'),
    Schema = mongoose.Schema;

var userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    account: { type: Number, ref: 'Account' }
});

userSchema.plugin(uniqueValidator);
userSchema.plugin(autoIncrement.plugin, {
    model: 'User',
    startAt: 1
});
userSchema.plugin(passportLocalMongoose, { populateFields: 'account' });


module.exports = mongoose.model('User', userSchema);
