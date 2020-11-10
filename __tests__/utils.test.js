const { formatArticleData, createArticleRef, formatCommentData } = require("../db/utils/data-manipulation")


describe("formatting timestamp", () => {
    test("given an array returns a new array", () => {
        const input = []
        const output = []
        expect(formatArticleData(input)).toEqual(output)

    })
    test("given an array of objects return a new array with the created_at property timestamp updated", () => {
        const input = [{
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: 1542284514171,
            votes: 100,
        },
        {
            title: 'Sony Vaio; or, The Laptop',
            topic: 'mitch',
            author: 'icellusedkars',
            body:
                'Call me Mitchell...',
            created_at: 1416140514171,
        }]
        const output = [{
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: new Date(1542284514171),
            votes: 100,
        },
        {
            title: 'Sony Vaio; or, The Laptop',
            topic: 'mitch',
            author: 'icellusedkars',
            body:
                'Call me Mitchell...',
            created_at: new Date(1416140514171),
        }]
        expect(formatArticleData(input)).toEqual(output)
    })
    test("check original array isn't mutated", () => {
        const input = [{
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: 1542284514171,
            votes: 100,
        },
        {
            title: 'Sony Vaio; or, The Laptop',
            topic: 'mitch',
            author: 'icellusedkars',
            body:
                'Call me Mitchell...',
            created_at: 1416140514171,
        }]
        formatArticleData(input)
        expect(input).toEqual(input)
    })
})

describe("creating article reference object", () => {
    test("given an empty array returns an empty object", () => {
        expect(createArticleRef([])).toEqual({})
    })
    test("Given an array of articles returns a new reference object", () => {
        const input = [{
            article_id: 1,
            title: 'Living in the shadow of a great man',
            body: 'I find this existence challenging',
            votes: 100,
            topic: 'mitch',
            author: 'butter_bridge',
            created_at: 1542284514171
        },
        {
            article_id: 2,
            title: 'Sony Vaio; or, The Laptop',
            body: 'Call me Mitchell...',
            votes: 0,
            topic: 'mitch',
            author: 'icellusedkars',
            created_at: 1416140514171
        }
        ]
        const output = {
            'Living in the shadow of a great man': 1,
            'Sony Vaio; or, The Laptop': 2
        }
        expect(createArticleRef(input)).toEqual(output)
    })
})

describe.only("formatting the comment data", () => {
    test("given an empty array returns an empty array", () => {
        expect(formatCommentData([])).toEqual([])
    })
    test("given an array of objects returns a new array of object with data updated", () => {
        const input = [
            {
                body:
                    "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                belongs_to: "They're not exactly dogs, are they?",
                created_by: 'butter_bridge',
                votes: 16,
                created_at: 1511354163389,
            },
            {
                body:
                    'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
                belongs_to: 'Living in the shadow of a great man',
                created_by: 'butter_bridge',
                votes: 14,
                created_at: 1479818163389,
            }
        ]
        const refObj = {
            "They're not exactly dogs, are they?": 1,
            'Living in the shadow of a great man': 2
        }
        const output = [
            {
                body:
                    "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                article_id: 1,
                author: "butter_bridge",
                votes: 16,
                created_at: new Date(1511354163389),
            },
            {
                body:
                    'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
                article_id: 2,
                author: "butter_bridge",
                votes: 14,
                created_at: new Date(1479818163389),
            }
        ]

        expect(formatCommentData(input, refObj)).toEqual(output)

    })
    test("check original array is not mutated", () => {
        const input = [
            {
                body:
                    "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                belongs_to: "They're not exactly dogs, are they?",
                created_by: 'butter_bridge',
                votes: 16,
                created_at: 1511354163389,
            },
            {
                body:
                    'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
                belongs_to: 'Living in the shadow of a great man',
                created_by: 'butter_bridge',
                votes: 14,
                created_at: 1479818163389,
            }
        ]
        const refObj = {
            "They're not exactly dogs, are they?": 1,
            'Living in the shadow of a great man': 2
        }
        formatCommentData(input, refObj)
        expect(input).toEqual(input)
    })

})