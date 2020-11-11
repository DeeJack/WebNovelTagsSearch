class Novel {
    /**
     * Represent a novel, useful only for intellisense
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
    /**
     * The details of a novel, useful only for intellisense
     * @param {ChaptersInfo} chaptersInfo 
     * @param {Gifts} gifts 
     * @param {RankInfo} rankInfo 
     * @param {Reviews} reviews 
     * @param {String} updatedAt 
     */
    constructor(chaptersInfo, gifts, rankInfo, reviews, updatedAt) {
        this.chaptersInfo = chaptersInfo;
        this.gifts = gifts;
        this.rankInfo = rankInfo;
        this.reviews = reviews;
        this.updatedAt = updatedAt;
    }
}

class ChaptersInfo {
    /**
     * 
     * @param {Number} totalChapters 
     * @param {Number} lastChapter 
     * @param {String} lastUpdate 
     */
    constructor(totalChapters, lastChapter, lastUpdate) {
        this.totalChapters = totalChapters
        this.lastChapter = lastChapter
        this.lastUpdate = lastUpdate
    }
} 

class Gifts {
    /**
     * 
     * @param {Number} numOfGifts 
     */
    constructor(numOfGifts) {
        this.numOfGifts = numOfGifts
    }
}

class RankInfo {
    /**
     * 
     * @param {Number} currentRank 
     * @param {Number} powerVotes 
     */
    constructor(currentRank, powerVotes) {
        this.currentRank = currentRank
        this.powerVotes = powerVotes
    }
}

class Reviews {
    /**
     * 
     * @param {Number} totalReviewNum 
     * @param {Number} totalScore 
     */
    constructor(totalReviewNum, totalScore) {
        this.currentRank = totalReviewNum
        this.powerVotes = totalScore
    }
}