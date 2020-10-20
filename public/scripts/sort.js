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
            console.log('0')
            orderedList = list.sort((first, second) => second.score - first.score)
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