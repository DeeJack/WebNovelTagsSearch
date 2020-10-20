/**
 * @type {Novel[]}
 */
let novels;
let page = 1;
let scrollListener;
let sortListener;
const ELEMENTS_FOR_PAGE = 10;

let keywordSearchFilters = [(novel, keyword) => novel.name.toLowerCase().includes(keyword), 
    (novel, keyword) => novel.description.toLowerCase().includes(keyword),
    (novel, keyword) => novel.author.toLowerCase().includes(keyword),
    (novel, keyword) => novel.tags.some((tag => tag.name.toLowerCase().includes(keyword)))]

document.addEventListener('DOMContentLoaded', async () => {
    let response = await fetch('/static/documents/webnovels.json')
    if (response.status !== 200) {
        console.error('Response: ' + response.status)
        return
    }
    novels = await response.json()
})

/**
 * 
 * @param {Array} selectedCategories 
 * @param {Array} excludedCategories 
 * @param {Array} selectedTags 
 * @param {Array} excludedTags 
 * @param {Array} tags 
 */
function loadList(selectedCategories, excludedCategories, selectedTags, excludedTags, tags) {
    let keyword = document.querySelector('#keyword').value.toLowerCase()
    let selectedKeyboardSearches = [
        document.querySelector('#chkTitle').checked,
        document.querySelector('#chkDescription').checked,
        document.querySelector('#chkAuthor').checked,
        document.querySelector('#chkTag').checked
    ]
    let keywordSearchType = document.querySelector('#swcKeywordAnd').checked

    // fare filter.every/some anche per cats e tags
    let found = novels
        .filter(novel => selectedCategories.length == 0 || selectedCategories.map(cat => cat.id).includes(novel.mainCategoryId))
        .filter(novel => excludedCategories.length == 0 || !excludedCategories.map(cat => cat.id).includes(novel.mainCategoryId))
        .filter(novel => selectedTags.length == 0 ||
            selectedTags.map(tag => tag.ids).some(ids => novel.tags.map(tag => tag.ids[0]).some(tagId => ids.includes(tagId))) ||
            selectedTags.map(tag => tag.name).some(name => novel.tags.map(tag => tag.name).some(tagName => tagName.toLowerCase() == name.toLowerCase())))
        .filter(novel => excludedTags.length == 0 ||
            !excludedTags.map(tag => tag.ids).some(ids => novel.tags.map(tag => tag.ids[0]).some(tagId => ids.includes(tagId))) ||
            !selectedTags.map(tag => tag.name).some(name => novel.tags.map(tag => tag.name).some(tagName => tagName.toLowerCase() == name.toLowerCase())))
        .filter((novel) => !keyword || 
            (keywordSearchType && keywordSearchFilters.every((filter, index) => !selectedKeyboardSearches[index] || filter(novel, keyword)) || 
            (!keywordSearchType && keywordSearchFilters.some((filter, index) => selectedKeyboardSearches[index] && filter(novel, keyword)))))

    localStorage.setItem('selectedCats', JSON.stringify(selectedCategories))
    localStorage.setItem('excludedCats', JSON.stringify(excludedCategories))
    localStorage.setItem('selectedTags', JSON.stringify(selectedTags))
    localStorage.setItem('excludedTags', JSON.stringify(excludedTags))

    console.log(localStorage)
    addListeners(found, tags)
    
    page = 1
    loadFiltered(found, tags, 1)
}

function addListeners(found, tags) {
    document.removeEventListener('scroll', scrollListener)
    if (found.length > ELEMENTS_FOR_PAGE) {
        scrollListener = () => {
            if (window.scrollY + window.innerHeight >= document.body.clientHeight - 20) {
                console.log("loading")
                page++
                loadFiltered(found, tags, page)
            }
        }
        document.addEventListener('scroll', scrollListener)
    }

    let sortSelection = document.querySelector('#sort')
    sortSelection.removeEventListener('change', sortSelection)
    sortListener = (event) => {
        page = 1
        document.querySelector('#list').innerHTML = ""
        loadFiltered(sort(found, event.target.value), tags, 1)
    }
    sortSelection.addEventListener('change', sortListener)
}

function reset() {
    let sortSelection = document.querySelector('#sort')
    sortSelection.removeEventListener('change', sortSelection)
}

/** 
* @param {Array} tags 
* @param {Array} tags 
*/
function loadFiltered(novels, tags, count) {
    let div = document.querySelector('#list')
    novels.slice(count, count + ELEMENTS_FOR_PAGE).forEach(novel => div.appendChild(createListItem(novel, tags)))
}

/**
 * 
 * @param {Novel} novel 
 * @param {Array} tags 
 */
function createListItem(novel, tags) {
    let link = document.createElement('a')
    link.target = '_blank'
    link.href = `https://www.webnovel.com/book/${novel.id}`
    let card = document.createElement('div')
    link.appendChild(card)
    card.classList.add('card')
    let img = document.createElement('img')
    img.classList.add('card-img-left')
    img.alt = novel.name
    img.src = `https://img.webnovel.com/bookcover/${novel.id}/150/150.jpg`
    let cardBody = document.createElement('div')
    cardBody.classList.add('card-body')

    cardBody.appendChild(createText(novel.name, true))

    novel.tags.map(tag => createTag(tag, tags, novel.name)).filter(el => el)
        .splice(0, 5)
        .forEach(tag => cardBody.appendChild(tag))

    cardBody.appendChild(createText(novel.description))
    card.append(img, cardBody)
    return link
}

/**
 * @param {Novel} novel 
 */
function createText(text, strong = false) {
    let textToShow = text
    let cardText = document.createElement('p')
    cardText.classList.add('card-text')
    if (text.length > 100) {
        textToShow = text.substring(0, 100) + '....'
    }
    cardText.textContent = textToShow
    cardText.title = text
    if (strong)
        cardText.style.fontWeight = 'bold'
    return cardText
}

/** 
* @param {Array} tags 
*/
function createTag(tag, fullTags, novelName) {
    let badge = document.createElement('span')
    badge.classList.add('badge', 'badge-primary')
    // TODO: ?????????? Controllare per il nome!!
    /*let tagsName = [...fullTags.tags.filter(currentTag => tag.ids.some(val => currentTag.ids.includes(val))
        || currentTag.name.toLowerCase() == tag.name.toLowerCase()),
    ...fullTags.mainCategories.filter(cat => cat.id == tag.id)]
    if (!tagsName || tagsName.length == 0) {
        console.error(`${tag.ids} not found!`)
        console.error(novelName)
        return
    }*/
    badge.textContent = tag.name//tagsName[0].tagName || tagsName[0].name
    return badge
}

class Novel {
    /**
     * 
     * @param {String} id 
     * @param {String} name 
     * @param {String} description 
     * @param {Number} mainCategoryId 
     * @param {String} author 
     * @param {Number} score 
     * @param {Array} tags 
     */
    constructor(id, name, description, mainCategoryId, author, score, tags) {
        this.id = id
        this.name = name
        this.description = description
        this.mainCategoryId = mainCategoryId
        this.author = author
        this.score = score
        this.tags = tags
    }
}