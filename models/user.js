const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    }
});

//passport local mongoose as a plugin will add username, hash and salt field to store the username, the hashed password and the salt value automatically and we do not need to build it from scratch.
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);

