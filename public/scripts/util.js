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

/**
 * @param {Novel} novel 
 */
function createText(text, strong = false) {
    let cardText = document.createElement('p')
    cardText.classList.add('card-text')
    let textLengthWidth = (window.innerWidth / 10)
    if (textLengthWidth > 130)
        textLengthWidth -= 90
    console.log(text.length > textLengthWidth)
    if (text.length > textLengthWidth) {
        let toggleBtn = document.createElement('a')
        collapseText(text, textLengthWidth, cardText, toggleBtn)
        cardText.appendChild(toggleBtn)
    } else {
        cardText.textContent = text
    }
    if (strong)
        cardText.style.fontWeight = 'bold'
    return cardText
}

/** 
 * @param {Array} tags 
 */
function createTag(tag) {
    let badge = document.createElement('span')
    badge.classList.add('badge', 'badge-primary')
    badge.textContent = tag.name
    return badge
}