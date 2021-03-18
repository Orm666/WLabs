const mongoose = require('mongoose');
const User = require("./user").User
const argon = require("argon2")


async function addUserToDatabase(username, password) {

    const hashedPassword = await argon.hash(password);
    let userUpload = new User({
        username: username,
        password: hashedPassword
    });
    argon.verify(hashedPassword, password).then(() => {
        userUpload.save().then(() => {
            console.log("Добавлен новый пользователь");
        });
    }).catch((err) => {
        console.err(err + ' Введён неверный пароль!');
        userUpload = undefined;
    });
    return userUpload;
}


function initDatabase() {
    mongoose.connect("mongodb+srv://Orm666:13371488@cluster0.8t76q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true}).catch(e => {
      console.error(e)
    });
}

exports.initDatabase = initDatabase;
exports.uploadUserToDatabase = addUserToDatabase;

