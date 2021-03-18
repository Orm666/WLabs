const port = 3000;

const express = require("express");
const app = express()

app.listen(port, () => {
    console.log("SERVER STARTED AT %d PORT", port);
});

function getNoRepeat(text) {
    for(let l of text) {
        if(text.indexOf(l) === text.lastIndexOf(l)) {
            return l
        }
    }
    return undefined
}

app.get('/api/GachanAnton/lab1/func1',(req,res) => {
    if(!req.query.text) res.send("Incorrect data")

    let text= req.query.text
    let result = getNoRepeat(text)
    if(!result) result = "No repeat"

    res.send(result)
})

function getHex(isTransparent) {
    let color = ""
    if(isTransparent) {
        for(let i = 0; i < 4; i++) {
            color += Math.floor(Math.random() * 255).toString(16);
        }
    } else {
        for (let i = 0; i < 3; i++) {
            color += Math.floor(Math.random() * 255).toString(16);
        }
    }

    return `#${color}`;
}

app.get('/api/GachanAnton/lab1/func3',(req,res) => {
    if(req.query.type) {
        if(req.query.type === "rgb") {
            res.send(getHex(false))
        } else if(req.query.type === "rgba") {
            res.send(getHex(true))
        } else {
            res.send("Incorrect data")
        }
    } else {
        res.send("Incorrect data")
    }
})

function roundNum(num,n) {
    return num.toFixed(n)
}

app.get('/api/Gachan/lab1/func13',(req,res) => {
    if(!req.query.number || !req.query.n) {
        res.send("Incorrect data")
    }

    let number = Number(req.query.number)
    let n = Number(req.query.n)
    res.send(roundNum(number,n))
})