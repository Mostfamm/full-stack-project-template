const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const api = require('./server/routes/api')


mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/mydb', { useNewUrlParser: true })

const app = express()
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'dist')))
app.use(express.static(path.join(__dirname, 'node_modules')))


app.use('/', api)

const port = 8888

app.listen(process.env.PORT || port, function() {
    console.log(`Runnin runnin and runnin runnin on port ${port}`)
})



