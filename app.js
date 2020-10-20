const express = require('express')
const app = express()
const path = require('path')
let ejs = require('ejs')
app.set('view engine', 'ejs')

app.use('/static', express.static(path.join(__dirname, 'public')))

app.get("/", (request, response) => {
    response.render('index')
})

app.get("/search", (request, response) => {
    let mainCategories = request.params.cats || []
    let mainCategoriesExcluded = request.params.noCats || []
    let tags = request.params.tags || []
    let tagsExcluded = request.params.noTags || []
    let searchForName = request.params.name || 0
    let searchForDescription = request.params.description || 0
    let searchForAuthor = request.params.author || 0
    
    console.log({mainCategories, mainCategoriesExcluded, tags, tagsExcluded, searchForName, searchForDescription, searchForAuthor})
    response.send('asd')
})

app.listen(9090, () => {
    console.log("Started")
})