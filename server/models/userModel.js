var mongoose = require('mongoose'),
    uniqueValidator = require('mongoose-unique-validator'),
    autoIncrement = require('mongoose-auto-increment'),
    Schema = mongoose.Schema;

var userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    account: { type: Number, ref: 'Account' }
});

userSchema.plugin(uniqueValidator);
userSchema.plugin(autoIncrement.plugin, {
    model: 'User',
    startAt: 1
});

module.exports = mongoose.model('User', userSchema);