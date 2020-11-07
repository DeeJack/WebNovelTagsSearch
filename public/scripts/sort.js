/**
 * 
 * @param {Novel[]} list 
 * @param {String} sortType 
 */
function sort(list, sortType) {
    if (!sortType || !list)
        return list
    let orderedList = list
    console.log(sortType)
    switch (sortType) {
        case '0': // Rating
            orderedList = list.sort((first, second) => getWeightedRating(first.score) - getWeightedRating(second.score))
            break;
        case '1': // Views
            console.log('1')
            break;
        case '2': // Collections
            console.log('2')
            break;
        case '3': // Total chapters
            console.log('3')
            break;
        case '4': // Last update
            console.log('4')
            break;
        case '5': // Power stones
            for (let i = 0; i < list.length; i++) {
                const rnd = Math.floor(Math.random() * (i + 1))
                let temp = orderedList[i]
                orderedList[i] = orderedList[rnd]
                orderedList[rnd] = temp
            }
            console.log('5')
            break;
        case '6': // Random
            console.log('6')
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
    return (novel.score * novel.numberOfRatings + meanVote * minimumVotes) / (novel.numberOfRatings + minimumVotes)
}

let tests = [{
        score: 3.0,
        numberOfRatings: 20
    }, {
        score: 3.5,
        numberOfRatings: 15
    }, {
        score: 4.3,
        numberOfRatings: 10
    },
    {
        score: 4.8,
        numberOfRatings: 100
    }, {
        score: 4.9,
        numberOfRatings: 50
    }, {
        score: 4.4,
        numberOfRatings: 40
    },
]
console.log(tests.map(test => getWeightedRating(test)))
