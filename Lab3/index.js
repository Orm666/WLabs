const fs = require('fs')
const bodyParser = require('body-parser');
const passport = require('./pass').passport;
const initDatabase = require('./db').initDatabase;
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');


const port = 3000;

const hbs = require("hbs")
const express = require("express");
const app = express()

app.use(cookieSession({
    name: 'session',
    keys: ["SECRET"],
    maxAge: 1440000,
    secure: false,
    signed: true
}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'hbs');

hbs.registerPartials("./views/partials/");

app.listen(port, () => {
    console.log("СЕРВЕР СТАРТУЕТ НА %d ПОРТ", port);
    initDatabase();
});

function logMiddleware(req, res, next) {
    console.log(req.method + ' : ' + req.url)
    next()
}

function logErrors(e) {

    const logFile = 'log.txt'

    fs.appendFile(logFile, e.toString(), function (err) {
        if (err) throw (err);
        console.log("Ошибка была записана в лог");
    })
}


app.use(logMiddleware)


function getHex(isTransparent) {
    let color = ""
    if (isTransparent) {
        for (let i = 0; i < 4; i++) {
            color += Math.floor(Math.random() * 255).toString(16);
        }
    } else {
        for (let i = 0; i < 3; i++) {
            color += Math.floor(Math.random() * 255).toString(16);
        }
    }

    return `#${color}`;
}

app.get(`/`, (req, res) => {
    let options = {
        username: req.user ? req.user.username : 'Незарегистрированный пользователь'
    }
    res.render("home.hbs",options);
})

app.get('/func1',passport.authenticate('cookie'), (req, res) => {
    let options = {
        executePath: '/api/GachanAnton/lab1/func1'
    }
    res.render("textInput.hbs", options)
})

app.get('/func3',passport.authenticate('cookie'), (req, res) => {
    let options = {
        executePath: '/api/GachanAnton/lab1/func3'
    }
    res.render("colorInput.hbs", options)
})

app.get('/func13',passport.authenticate('cookie'), (req, res) => {
    let options = {
        executePath: '/api/GachanAnton/lab1/func13'
    }
    res.render("numberInput.hbs", options)
})

app.get('/api/GachanAnton/lab1/func3',passport.authenticate('cookie'), (req, res) => {
    if (req.query.type) {
        if (req.query.type === "rgb") {
            let options = {
                result: getHex(false)
            }
            res.render("result.hbs", options)
        } else if (req.query.type === "rgba") {
            let options = {
                result: getHex(true)
            }
            res.render("result.hbs", options)
        } else {
            res.send("Неверные данные")
        }
    } else {
        res.send("Неверные данные")
    }
})

function roundNum(num, n) {
    if(n > 100 || n < 0) return undefined
    return num.toFixed(n)
}

app.get('/api/GachanAnton/lab1/func13', passport.authenticate('cookie'), (req, res) => {
    if (!req.query.number || !req.query.n) {
        res.send("Неверные данные")
    }

    let number = Number(req.query.number)
    let n = Number(req.query.n)

    let r = roundNum(number, n)
    if(r === undefined) r = "Неверное значение"
    let options = {
        result: r
    }
    res.render("result.hbs", options)

})

function getNoRepeat(text) {
    for (let l of text) {
        if (text.indexOf(l) === text.lastIndexOf(l)) {
            return l
        }
    }
    return undefined
}

app.get('/api/GachanAnton/lab1/func1', passport.authenticate('cookie'), (req, res) => {
    if (!req.query.text) res.send("Неверные данные")

    let text = req.query.text
    let result = getNoRepeat(text)
    if (!result) result = "Все буквы повторяются"

    let options = {
        result: result
    }
    res.render("result.hbs", options)
})

app.get('/login',(req,res) => {
    let options=  {
        path: '/login',
        buttonName:'Логин'
    }
    res.render('login.hbs',options)
})
app.post('/login', passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

app.get('/register',(req,res) => {
    let options=  {
        path: '/register',
        buttonName:'Регистрация'
    }
    res.render('login.hbs',options)
})
app.post('/register', passport.authenticate('register', {
    successRedirect: '/',
    failureRedirect: '/register'
}));


app.use((err, req, res, next) => {
    logErrors(err)
    res.send(err.toString())
})
