const fs = require('fs')

const port = 3000;

const hbs = require("hbs")
const express = require("express");
const app = express()

app.set('view engine', 'hbs');

hbs.registerPartials("./views/partials/");

app.listen(port, () => {
    console.log("СЕРВЕР СТАРТУЕТ НА %d ПОРТ", port);
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

function middlewareAuth(req, res, next) {
    const adminName = 'Admin'
    if (req.query.username) {
        if (req.query.username === adminName) {
            next()
        } else {
            next(new Error("Неверное имя пользователя"))
        }
    } else {
        next(new Error("Неверное имя пользователя"))
    }
}

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

app.get('/', (req, res) => {

    res.render("home.hbs");
})

app.get('/func1', (req, res) => {
    let options = {
        executePath: '/api/GachanAnton/lab1/func1'
    }
    res.render("textInput.hbs", options)
})

app.get('/func3', (req, res) => {
    let options = {
        executePath: '/api/GachanAnton/lab1/func3'
    }
    res.render("colorInput.hbs", options)
})

app.get('/func13', (req, res) => {
    let options = {
        executePath: '/api/GachanAnton/lab1/func13'
    }
    res.render("numberInput.hbs", options)
})

app.get('/api/GachanAnton/lab1/func3', (req, res) => {
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
            res.send("Неверные ")
        }
    } else {
        res.send("Неверные данные")
    }
})

function roundNum(num, n) {
    if(n > 100 || n < 0) return undefined
    return num.toFixed(n)
}

app.get('/api/GachanAnton/lab1/func13', middlewareAuth, (req, res) => {
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

app.get('/api/GachanAnton/lab1/func1', middlewareAuth, (req, res) => {
    if (!req.query.text) res.send("Неверные данные")

    let text = req.query.text
    let result = getNoRepeat(text)
    if (!result) result = "Все буквы повторяются"

    let options = {
        result: result
    }
    res.render("result.hbs", options)
})

app.use((err, req, res, next) => {
    logErrors(err)
    res.send(err.toString())
})
