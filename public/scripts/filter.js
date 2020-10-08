let currentFocus = -1

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Loaded')
    const categoryInput = document.querySelector('#category')
    const tagInput = document.querySelector('#tags')
    const response = await fetch('/static/documents/webnoveltags.json', {
        method: 'GET',
    })
    if (!response.ok) {
        console.log("Couldn't load tags json")
        return
    }
    const tagsJson = await response.json()

    registerInputEvents(categoryInput, tagsJson.mainCategories) // TODO: add an array parameter with the 'name'(text) and the hidden value, 
    //add a limited number of suggestion (5), in the bottom right say something like "Showing 5 of N"
    registerInputEvents(tagInput, tagsJson.tags)
})

/**
 * Registers the needed events for the given input to use the autocomplete list
 * @param {HTMLElement} input 
 */
function registerInputEvents(input, array) {
    console.log(array)
    input.addEventListener('keydown', (event) => changeFocusEvent(event, input))
    input.addEventListener('input', (event) => {
        const word = input.value
        closeAutocompleteLists() // Close all the lists

        if (!word) // If the string is empty or not present, return 
            return false
        currentFocus = -1 // Reset the focus
        createList(input, array)
    })
}

/**
 * Create a autocomplete list for the current input
 * @param {HTMLElement} input 
 * @param {Object[]} array
 */
function createList(input, array) {
    const word = input.value
    let list = document.createElement('div')
    list.id = input.id + '_autocomplete_list'
    list.classList.add('autocomplete-items')
    array.filter((element) => element.name.toLowerCase().includes(word.toLowerCase())).forEach(element => {
        let item = document.createElement('div')
        let textFoundIndex = element.name.toLowerCase().indexOf(word.toLowerCase())
        let text = ""
        for (let i = 0; i < element.name.length; i++) {
            if (i == textFoundIndex)
                text += "<strong>"
            if (i == (textFoundIndex + word.length))
                text += "</strong>"
            text += element.name[i]
        }
        let hiddenValue = document.createElement('input')
        hiddenValue.type = 'hidden'
        hiddenValue.value = element.id // TODO: remove 'id' to make it more general
        item.appendChild(hiddenValue)
        item.innerHTML = text
        item.addEventListener('click', (event) => {
            input.value = element.name
            closeAutocompleteLists()
        })
        list.appendChild(item)
    });
    input.parentElement.appendChild(list)
}

function changeFocusEvent(event, input) {
    console.log(this)
    let key = event.key
    switch (key) {
        case 'Enter':
            event.preventDefault()
            let autocompleteItems = getAutocompleteListByInput(input)
            if (autocompleteItems) 
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
    console.log(currentFocus)
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