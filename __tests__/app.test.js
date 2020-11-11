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

                    // like this or above?
                    expect(response.body.user[0]).toEqual({
                        username: 'butter_bridge',
                        avatar_url: 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
                        name: 'jonny'
                    })
                })
        });
    });

    describe('/api/articles/:article_id', () => {
        test('GET 200 - responds with an array of a given article, including a count of how many comments the article has', () => {
            return request(app)
                .get('/api/articles/1')
                .expect(200)
                .then(response => {
                    // assert the response has the correct number of rows
                    expect(response.body.article.length).toEqual(1);
                    // assert the response is the correct shape
                    expect(response.body).toMatchObject({ article: expect.any(Array) })
                    // assert the response has the correct properties
                    expect(Object.keys(response.body.article[0])).toEqual(expect.arrayContaining(['article_id', 'title', 'body', 'votes', 'topic', 'author', 'created_at', 'comment_count']))

                    // this or above?
                    expect(response.body.article[0]).toEqual({
                        article_id: 1,
                        title: 'Living in the shadow of a great man',
                        body: 'I find this existence challenging',
                        votes: 100,
                        topic: 'mitch',
                        author: 'butter_bridge',
                        created_at: '2018-11-15T12:21:54.171Z',
                        comment_count: '13'
                    });
                })
        });

        test('GET 200 - responds with comment_count as 0 if the article has no comments', () => {
            return request(app)
                .get('/api/articles/3')
                .expect(200)
                .then(response => {
                    expect(response.body.article[0].comment_count).toEqual('0');
                })
        });

        test('PATCH 201 - increase vote property of an article. accepts an object to increase the votes property by and responds with the updated article', () => {

            // /api/articles/1 has 100 votes
            // should return 101

            const votesToPatch = {
                votes: 1
            };

            return request(app)
                .patch('/api/articles/1')
                .send(votesToPatch)
                .expect(201)
                .then(response => {
                    // assert the votes have increased by the given number
                    expect(response.body.article[0].votes).toEqual(101);
                    // assert the full updated article is returned
                    expect(response.body.article[0]).toEqual({
                        article_id: 1,
                        title: 'Living in the shadow of a great man',
                        body: 'I find this existence challenging',
                        votes: 101,
                        topic: 'mitch',
                        author: 'butter_bridge',
                        created_at: '2018-11-15T12:21:54.171Z'
                    });
                })
        });

        test('PATCH 201 - decrease vote property of an article. test if the current functionality can decrease the votes passing through a negative number', () => {

            const votesToPatch = {
                votes: -1
            };

            return request(app)
                .patch('/api/articles/1')
                .send(votesToPatch)
                .expect(201)
                .then(response => {
                    // assert the votes have increased by the given number
                    expect(response.body.article[0].votes).toEqual(99);
                    // assert the full updated article is returned
                    expect(response.body.article[0]).toEqual({
                        article_id: 1,
                        title: 'Living in the shadow of a great man',
                        body: 'I find this existence challenging',
                        votes: 99,
                        topic: 'mitch',
                        author: 'butter_bridge',
                        created_at: '2018-11-15T12:21:54.171Z'
                    });
                })
        });

    });

})