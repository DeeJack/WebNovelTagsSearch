/**
 * @type {Novel[]}
 */
let novels;
let page = 0;
let scrollListener;
let sortListener;
const ELEMENTS_FOR_PAGE = 10;

let keywordSearchFilters = [
    (novel, keyword) => novel.name.toLowerCase().includes(keyword),
    (novel, keyword) => novel.description.toLowerCase().includes(keyword),
    (novel, keyword) => novel.author.toLowerCase().includes(keyword),
    (novel, keyword) => novel.tags.some((tag => tag.name.toLowerCase().includes(keyword)))
]
let searchForTag = (novel, tag) => (novel.tags.some(novelTag => tag.ids.includes(novelTag.ids[0])) ||
    novel.tags.some(novelTag => novelTag.name.toLowerCase() == tag.name.toLowerCase()))
let tagsFilters = [
    // Check if the category of the novel is a selected category, or in the excluded category if excluded is selected (XOR)
    (novel, list, excluded, tagsSearchType) => list.length == 0 || (excluded != list.map(cat => cat.id).includes(novel.mainCategoryId)),
    // Check if the novel contains a tag that is in the selected ones, or in the excluded one if excluded is selected (XOR), 
    // It also checks if the 'AND' is selected
    (novel, list, excluded, tagsSearchType) => list.length == 0 || (
        (excluded != (
            ((excluded || !tagsSearchType) && list.some(currentTag => searchForTag(novel, currentTag)) ||
                (!excluded && tagsSearchType && list.every(currentTag => searchForTag(novel, currentTag))))))
    )
]

document.addEventListener('DOMContentLoaded', async () => {
    let sortSelection = document.querySelector('#sort')
    sortSelection.selectedIndex = 0
    sortSelection.disabled = true

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
    let tagLists = [excludedCategories, excludedTags, selectedCategories, selectedTags]
    let found = filterNovels(novels, tagLists)
    console.log(found)

    localStorage.setItem('selectedCats', JSON.stringify(selectedCategories))
    localStorage.setItem('excludedCats', JSON.stringify(excludedCategories))
    localStorage.setItem('selectedTags', JSON.stringify(selectedTags))
    localStorage.setItem('excludedTags', JSON.stringify(excludedTags))

    
    addListeners(found)

    page = 0
    loadFiltered(found, 0)
}

/**
 * Filters the novels based on the choices of the user
 * @param {Novel[]} novels 
 */
function filterNovels(novels, tagLists) {
    console.log(novels.length)
    let keyword = document.querySelector('#keyword').value.trim().toLowerCase()
    let keywordSearchType = document.querySelector('#swcKeywordAnd').checked
    let tagsSearchType = document.querySelector('#swcTagsAnd').checked

    let selectedKeyboardSearches = [
        document.querySelector('#chkTitle').checked,
        document.querySelector('#chkDescription').checked,
        document.querySelector('#chkAuthor').checked,
        document.querySelector('#chkTag').checked
    ]
    console.log(selectedKeyboardSearches)
    console.log(novels.map(novel => keywordSearchFilters.some((filter, index) => selectedKeyboardSearches[index] && filter(novel, keyword))).filter(asd => asd))

    return novels
        // Check that the novel does't contain even one of the excluded categories
        .filter(novel => tagsFilters.every((filter, index) => filter(novel, tagLists[index], true, true)))
        .filter(novel =>
            // Check that if the novels contains the selectedCats AND the selectedTags
            tagsFilters.every((filter, index) => filter(novel, tagLists[index + 2], false, tagsSearchType))
        )
        // If there isn't a keyword, or if none of the checkboxes are selected
        .filter((novel) => !keyword || !selectedKeyboardSearches.some(chk => chk) ||
            // If the search type is 'AND' and all of the filters are satisfied
            (keywordSearchType && keywordSearchFilters.every((filter, index) => !selectedKeyboardSearches[index] || filter(novel, keyword)) ||
                // If the search type is 'OR' and some (at least one) of the filters are satisfied
                (!keywordSearchType && keywordSearchFilters.some((filter, index) => selectedKeyboardSearches[index] && filter(novel, keyword)))
            )
        )
}

function addListeners(found) {
    document.removeEventListener('scroll', scrollListener)
    if (found.length > ELEMENTS_FOR_PAGE) {
        scrollListener = () => {
            if (window.scrollY + window.innerHeight >= document.body.clientHeight - 20) {
                console.log("loading")
                page++
                loadFiltered(found, page)
            }
        }
        document.addEventListener('scroll', scrollListener)
    }

    let sortSelection = document.querySelector('#sort')
    sortSelection.selectedIndex = 0
    sortSelection.disabled = false
    sortSelection.removeEventListener('change', sortSelection)
    sortListener = (event) => {
        page = 1
        document.querySelector('#list').innerHTML = ""
        loadFiltered(sort(found, event.target.value), 1)
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
function loadFiltered(novels, count) {
    let div = document.querySelector('#list')
    novels.slice(count * ELEMENTS_FOR_PAGE, count * ELEMENTS_FOR_PAGE + ELEMENTS_FOR_PAGE).forEach(novel => div.appendChild(createListItem(novel)))
}

/**
 * 
 * @param {Novel} novel 
 */
function createListItem(novel) {
    let column = document.createElement('div')
    column.classList.add('col-sm-4')
    let link = document.createElement('a')
    link.target = '_blank'
    link.href = `https://www.webnovel.com/book/${novel.id}`
    let card = document.createElement('div')
    card.classList.add('card')
    let img = document.createElement('img')
    img.classList.add('card-img-left')
    img.alt = novel.name
    img.src = `https://img.webnovel.com/bookcover/${novel.id}/150/150.jpg`
    let cardBody = document.createElement('div')
    cardBody.classList.add('card-body')

    link.appendChild(createText(novel.name, true))
    cardBody.appendChild(link)

    novel.tags.map(tag => createTag(tag)).filter(el => el)
        .slice(0, 5)
        .forEach(tag => cardBody.appendChild(tag))

    if (novel.tags.length > 5) {
        let hiddenDiv = document.createElement('div')

        novel.tags.map(tag => createTag(tag)).filter(el => el)
            .slice(5)
            .forEach(tag => hiddenDiv.appendChild(tag))
        let toggleTags = document.createElement('a')
        toggleTags.textContent = 'Toggle all'
        collapsable(hiddenDiv, toggleTags)
        cardBody.appendChild(hiddenDiv)
        cardBody.appendChild(toggleTags)
    }
    if (novel.details) {
        cardBody.appendChild(createDetails(novel))
    }

    cardBody.appendChild(createText(`Description: ${novel.description}`))
    card.append(img, cardBody)
    column.appendChild(card)
    return column
}

/**
 * @param {Novel} novel 
 */
function createDetails(novel) {
    let container = document.createElement('div')
    container.appendChild(createText(`Chapters: ${novel.details.chaptersInfo.totalChapters}`))
    container.appendChild(createText(`Score: ${novel.details.reviews.totalScore}, ${novel.details.reviews.totalReviewNum} reviews`))
    container.appendChild(createText(`Gifts: ${novel.details.gifts.numOfGifts}`))
    container.appendChild(createText(`Rank: ${novel.details.rankInfo.currentRank}, ${novel.details.rankInfo.powerVotes} power stones`))
    return container
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
     * @param {Details} details
     */
    constructor(id, name, description, mainCategoryId, author, score, tags, details) {
        this.id = id
        this.name = name
        this.description = description
        this.mainCategoryId = mainCategoryId
        this.author = author
        this.score = score
        this.tags = tags
        this.details = details
    }
}

class Details {
    constructor(chaptersInfo, gifts, rankInfo, reviews, updatedAt) {
        this.chaptersInfo = chaptersInfo;
        this.gifts = gifts;
        this.rankInfo = rankInfo;
        this.reviews = reviews;
        this.updatedAt = updatedAt;
    }
}