const connection = require("../db/connection")
const app = require("../app")
const request = require("supertest");
const { response } = require("express");


describe("northcoders news api", () => {

    // hooks
    afterAll(() => {
        return connection.destroy();
    });
    beforeEach(() => {
        return connection.seed.run();
    })

    describe("/api/topics", () => {
        test("GET 200 - responds with an array of topics", () => {
            return request(app)
                .get('/api/topics')
                .expect(200)
                .then(response => {
                    // assert the response has the correct number of rows
                    expect(response.body.topics.length).toEqual(3);
                    // assert the response is the correct shape
                    expect(response.body).toMatchObject({ topics: expect.any(Array) })
                    // assert the response has the correct properties
                    expect(Object.keys(response.body.topics[0])).toEqual(expect.arrayContaining(['description', 'slug']))

                    // is it better to have the above assertions or one like below?
                    // assert the response
                    expect(response.body).toEqual({
                        "topics": [
                            {
                                description: 'The man, the Mitch, the legend',
                                slug: 'mitch',
                            },
                            {
                                description: 'Not dogs',
                                slug: 'cats',
                            },
                            {
                                description: 'what books are made of',
                                slug: 'paper',
                            },
                        ]
                    });
                })
        })
    })

    describe('/api/users/:username', () => {
        test('GET 200 - responds with an array of a given user', () => {
            return request(app)
                .get('/api/users/butter_bridge')
                .expect(200)
                .then(response => {
                    // assert the response has the correct number of rows
                    expect(response.body.user.length).toEqual(1);
                    // assert the response is the correct shape
                    expect(response.body).toMatchObject({ user: expect.any(Array) })
                    // assert the response has the correct properties
                    expect(Object.keys(response.body.user[0])).toEqual(expect.arrayContaining(['username', 'avatar_url', 'name']))
                })
        });
    });

    describe.only('/api/articles/:article_id', () => {
        test('GET 200 - responds with an array of a given article', () => {
            return request(app)
                .get('/api/articles/2')
                .expect(200)
                .then(response => {
                    // console.log(response.body)
                    // assert the response has the correct number of rows
                    expect(response.body.article.length).toEqual(1);
                    // assert the response is the correct shape
                    expect(response.body).toMatchObject({ article: expect.any(Array) })
                    // assert the response has the correct properties
                    expect(Object.keys(response.body.article[0])).toEqual(expect.arrayContaining(['article_id', 'title', 'body', 'votes', 'topic', 'author', 'created_at']))
                })
        });
    });

})