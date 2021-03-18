const mongoose = require('mongoose');
const argon = require('argon2')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.methods.validatePassword = async function(password) {
    return await argon.verify(this.password,password);
}

const User = new mongoose.model("User", userSchema);

exports.User = User