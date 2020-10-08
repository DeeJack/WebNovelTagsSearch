const express = require('express')
const app = express()
const path = require('path')
let ejs = require('ejs')
app.set('view engine', 'ejs')

app.use('/static', express.static(path.join(__dirname, 'public')))

app.get("/", (request, response) => {
    response.render('index');
})

app.listen(9090, () => {
    console.log("Started")
})