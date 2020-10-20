let currentFocus = -1
const selectedCategories = []
const excludedCategories = []
const selectedTags = []
const excludedTags = []

document.addEventListener('DOMContentLoaded', async () => {
    const categoryInput = document.querySelector('#category')
    const tagInput = document.querySelector('#tag')
    const searchButton = document.querySelector('#search')

    const response = await fetch('/static/documents/webnoveltags.json', {
        method: 'GET',
    })
    if (!response.ok) {
        console.log("Couldn't load tags json")
        return
    }
    const tagsJson = await response.json()

    registerInputEvents(categoryInput, tagsJson.mainCategories, selectedCategories, excludedCategories, 'name', 'id') // TODO: add an array parameter with the 'name'(text) and the hidden value, 
    //add a limited number of suggestion (5), in the bottom right say something like "Showing 5 of N"
    registerInputEvents(tagInput, tagsJson.tags, selectedTags, excludedTags, 'name', 'ids')

    loadLastSearch(categoryInput, tagInput)

    searchButton.addEventListener('click', () => {
        let div = document.querySelector('#list')
        div.innerHTML = ""
        console.log({selectedCategories, excludedCategories, selectedTags, excludedTags})
        loadList(selectedCategories, excludedCategories, selectedTags, excludedTags, tagsJson)
    })
    document.querySelector('#reset').addEventListener('click', () => {
        localStorage.clear()
        selectedTags.length = 0
        selectedCategories.length = 0
        excludedCategories.length = 0
        excludedTags.length = 0
        document.querySelector('#list').innerHTML = ""
        document.querySelectorAll('.autocomplete_selected').forEach(el => el.innerHTML = "")
        reset()
    })
})

function loadLastSearch(categoryInput, tagInput) {
    console.log('LOADING STORAGE')
    console.log(localStorage)
    let cats = JSON.parse(localStorage.getItem('selectedCats')) || []
    let excludedCats = JSON.parse(localStorage.getItem('excludedCats')) || []
    let localTags = JSON.parse(localStorage.getItem('selectedTags')) || []
    let localExcludedTags = JSON.parse(localStorage.getItem('excludedTags')) || []
    cats.forEach(cat => selectAutocompletation(cat, categoryInput, selectedCategories, excludedCategories, 'name'))
    excludedCats.forEach(cat => selectAutocompletation(cat, categoryInput, selectedCategories, excludedCategories, 'name', true))
    localTags.forEach(tag => selectAutocompletation(tag, tagInput, selectedTags, excludedTags, 'name'))
    localExcludedTags.forEach(tag => selectAutocompletation(tag, tagInput, selectedTags, excludedTags, 'name', true))
}

/**
 * Registers the needed events for the given input to use the autocomplete list
 * @param {HTMLElement} input 
 */
function registerInputEvents(input, array, selectedItems, excludedItems, propertyName, propertyId) {
    let selectedList = document.createElement('ul')
    selectedList.id = input.id + '_autocomplete_selected'
    selectedList.classList.add('autocomplete_selected')
    input.parentElement.parentElement.appendChild(selectedList)

    input.addEventListener('keydown', (event) => changeFocusEvent(event, input))
    input.addEventListener('input', (event) => {
        const word = input.value
        closeAutocompleteLists() // Close all the lists

        if (!word) // If the string is empty or not present, return 
            return false
        currentFocus = -1 // Reset the focus

        createList(input, array, selectedItems, excludedItems, propertyName, propertyId)
    })
}

/**
 * Create a autocomplete list for the current input
 * @param {HTMLElement} input 
 * @param {Object[]} array
 */
function createList(input, array, selectedItems, excludedItems, propertyName, propertyId) {
    const word = input.value
    let list = document.createElement('div')
    list.id = input.id + '_autocomplete_list'
    list.classList.add('autocomplete-items')
    array.filter(element => !selectedItems.includes(element))
        .filter((element) => element[propertyName].toLowerCase().includes(word.toLowerCase()))
        .sort((first, second) => first[propertyName].length > second[propertyName].length ? 1 : -1)
        .splice(0, 30)
        .forEach(element => {
            let item = document.createElement('div')
            let textFoundIndex = element[propertyName].toLowerCase().indexOf(word.toLowerCase())
            let text = ""
            for (let i = 0; i < element[propertyName].length; i++) {
                if (i == textFoundIndex)
                    text += "<strong>"
                if (i == (textFoundIndex + word.length))
                    text += "</strong>"
                text += element[propertyName][i]
            }
            let hiddenValue = document.createElement('input')
            hiddenValue.type = 'hidden'
            hiddenValue.value = element[propertyId] 
            item.appendChild(hiddenValue)
            item.innerHTML = text
            item.addEventListener('click', (event) => {
                closeAutocompleteLists()
                selectAutocompletation(element, input, selectedItems, excludedItems, propertyName)
                input.value = ''
            })
            list.appendChild(item)
        });
    input.parentElement.appendChild(list)
}

function changeFocusEvent(event, input) {
    let key = event.key
    switch (key) {
        case 'Enter':
            event.preventDefault()
            let autocompleteItems = getAutocompleteListByInput(input)
            if (autocompleteItems && autocompleteItems[currentFocus])
                autocompleteItems[currentFocus].click()
            break
        case 'ArrowDown':
            currentFocus++
            addActive(input)
            break
        case 'ArrowUp':
            currentFocus--
            addActive(input)
            break
        default:
            break
    }
}

/**
 * Add the 'active' class to the current-focused item in the autocomplete list (given an input with the autocomplete list)
 * @param {HTMLElement} input 
 */
function addActive(input) {
    let autocompleteItems = getAutocompleteListByInput(input)
    if (!autocompleteItems)
        return false

    clearActive(input)
    if (autocompleteItems.length === 0)
        return false
    if (currentFocus >= autocompleteItems.length)
        currentFocus = 0
    if (currentFocus < 0)
        currentFocus = autocompleteItems.length - 1

    autocompleteItems[currentFocus].classList.add('autocomplete-active')
}

/**
 * Clear all the active elements in the autocomplete list
 * @param {HTMLElement} input 
 */
function clearActive(input) {
    let autocompleteItems = getAutocompleteListByInput(input)
    autocompleteItems.forEach(element => element.classList.remove('autocomplete-active'))
}

/**
 * Get the items (as divs) in the autocomplete list of the given input
 * @param {HTMLElement} input 
 * @returns {HTMLElement[]}
 */
function getAutocompleteListByInput(input) {
    let autocompleteElement = document.getElementById(input.id + '_autocomplete_list')
    if (!autocompleteElement)
        return undefined
    return [...autocompleteElement.getElementsByTagName('div')]
}

/**
 * Get the list element with the selected elements from the autocomplete
 * @param {HTMLElement} input 
 * @returns {HTMLElement} list
 */
function getAutocompleteSelectedByInput(input) {
    let autocompleteSelected = document.getElementById(input.id + '_autocomplete_selected')
    return autocompleteSelected
}

/**
 * Select the selected element
 * @param {Object} element 
 * @param {HTMLElement} input 
 * @param {Array} selectedItems
 * @param {Array} excludedItems
 */
function selectAutocompletation(element, input, selectedItems, excludedItems, propertyName, excluded = false) {
    if (!element || selectedItems.includes(element))
        return
    let selectedList = getAutocompleteSelectedByInput(input)
    let newItem = document.createElement('span')
    newItem.classList.add('badge', 'badge-pill', 'badge-light')
    newItem.textContent = element[propertyName] + '   '

    let excludedEl = document.createElement('i')
    excludedEl.title = "Included"
    excludedEl.style.marginLeft = '4px'
    excludedEl.classList.add('fas', 'fa-check')
    newItem.appendChild(excludedEl)

    excludedEl.addEventListener('click', () => {
        excludeTag(excludedEl, element, selectedItems, excludedItems)
    })

    let removeItem = document.createElement('i')
    removeItem.title = 'Remove'
    removeItem.classList.add('fas', 'fa-trash')
    newItem.appendChild(removeItem)
    removeItem.addEventListener('click', (event) => {
        console.log(selectedItems.indexOf(element))
        selectedItems.splice(selectedItems.indexOf(element), 1)
        excludedItems.splice(selectedItems.indexOf(element), 1)
        newItem.remove()
    })
    selectedList.appendChild(newItem)
    selectedItems.push(element)
    if (excluded)
        excludeTag(excludedEl, element, selectedItems, excludedItems)
}

function excludeTag(excludedEl, element, selectedItems, excludedItems) {
    excludedEl.classList.toggle('fa-check')
    let nowExcluded = excludedEl.classList.toggle('fa-minus-circle')
    
    if (nowExcluded) {
        excludedItems.push(element)
        selectedItems.splice(selectedItems.indexOf(element), 1)
        excludedEl.title = "Excluded"
    } else {
        selectedItems.push(element)
        excludedItems.splice(excludedItems.indexOf(element), 1)
        excludedEl.title = "Included"
    }
}

/**
 * Closes all the list in the document aside from the one of the input passed as argument
 * @param {HTMLElement} currentInput
 */
function closeAutocompleteLists(currentInput) {
    let currentList = currentInput ? document.getElementById(currentInput.id + '_autocomplete_list') : null
    let lists = document.getElementsByClassName('autocomplete-items')
    for (let i = 0; i < lists.length; i++) {
        if (lists[i] !== currentList)
            lists[i].parentElement.removeChild(lists[i])
    }
}