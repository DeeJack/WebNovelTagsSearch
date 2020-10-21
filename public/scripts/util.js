/**
 * 
 * @param {HTMLElement} collapsableDiv 
 * @param {HTMLElement} toggleButton 
 */
function collapsable(collapsableDiv, toggleButton) {
    toggleButton.href = '#'
    collapsableDiv.classList.add('collapse')
    toggleButton.addEventListener('click', (e) => {
        e.preventDefault()
        collapsableDiv.classList.toggle('show')
    })
}

/**
 * 
 * @param {String} fullText 
 * @param {Number} length 
 * @param {HTMLElement} textDiv 
 * @param {HTMLElement} toggleButton 
 */
function collapseText(fullText, length, textDiv, toggleButton) {
    toggleButton.href = '#'
    textDiv.textContent = fullText.substring(0, length)
    toggleButton.textContent = '... more'
    textDiv.title = fullText
    let collapsed = true
    toggleButton.addEventListener('click', (e) => {
        e.preventDefault()
        collapsed = !collapsed
        if (collapsed) {
            textDiv.textContent = fullText.substring(0, length) + '...'
            toggleButton.textContent = ' more'
        } else {
            textDiv.textContent = fullText
            toggleButton.textContent = ' less'
        }
        textDiv.appendChild(toggleButton) // textContent removes all the children
    })
}