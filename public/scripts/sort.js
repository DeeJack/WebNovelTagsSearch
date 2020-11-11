/**
 * 
 * @param {Novel[]} list 
 * @param {String} sortType 
 */
function sort(list, sortType) {
    if (!sortType || !list)
        return list
    let orderedList = list
    switch (sortType) {
        case '0': // Rating
            orderedList = list.filter(novel => novel.details !== undefined).sort((first, second) => getWeightedRating(second) - getWeightedRating(first))
            orderedList.push(list.filter(novel => !novel.details))
            break;
        case '1': // Views, not included in the details :(
            console.log('1')
            break;
        case '2': // Collections, not included in the details :(
            console.log('2')
            break;
        case '3': // Total chapters
            orderedList = list.filter(novel => novel.details !== undefined).sort((first, second) => second.details.chaptersInfo.totalChapters - first.details.chaptersInfo.totalChapters)
            orderedList.push(list.filter(novel => !novel.details))
            break;
        case '4': // Last update, removed since the last update changes too fast, it needs to be refreshed a lot
            break;
        case '5': // Random
            for (let i = 0; i < list.length; i++) {
                const rnd = Math.floor(Math.random() * (i + 1))
                let temp = orderedList[i]
                orderedList[i] = orderedList[rnd]
                orderedList[rnd] = temp
            }
            console.log('5')
            break;
        case '6': // Power stones, removed since the powerstones are an index of popularity, they need to be refreshed a lot
            break;
        default:
            console.error(`Sort type ${sortType} not found!`)
            break;
    }
    console.log(orderedList)
    return orderedList
}

/**
 * https://stackoverflow.com/questions/1411199/what-is-a-better-way-to-sort-by-a-5-star-rating
 * @param {Novel} novel 
 */
function getWeightedRating(novel) {
    let minimumVotes = 30
    let meanVote = 3.0
    if (!novel.details)
        return -1
    let reviewsNum = novel.details.reviews.totalReviewNum
    return (novel.details.reviews.totalScore * reviewsNum + meanVote * minimumVotes) / (reviewsNum + minimumVotes)
}