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

        test('GET 404 - responds with a 404 when the user does not exist', () => {
            return request(app)
                .get('/api/users/not-a-user')
                .expect(404)
                .then(response => {
                    expect(response.body.msg).toEqual('User not found!');
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

        // 404 there is nothing wrong with the request it just doesn't exist.
        test('GET 404 - responds with 404 custom error the article_id does not exist', () => {
            return request(app)
                .get('/api/articles/100')
                .expect(404)
                .then(response => {
                    expect(response.body.msg).toEqual('Article not found!');
                })
        });

        test('GET 400 - responds with 400 if bad request is made. PSQL error', () => {
            return request(app)
                .get('/api/articles/cats')
                .expect(400)
                .then(response => {
                    expect(response.body.msg).toEqual('Bad request');
                })
        });

        test('PATCH 201 - increase vote property of an article. Accepts an object with votes property, responds with the updated article', () => {

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

        test('PATCH 201 - decrease vote property of an article. Decrease the votes passing through a negative number', () => {

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

        test('PATCH 400 - No votes on the req body - the property is not defined', () => {
            //  route to handleCustomErrors

            const votesToPatch = { name: 'Oli' };

            return request(app)
                .patch('/api/articles/1')
                .send(votesToPatch)
                .expect(400)
                .then(response => {
                    expect(response.body.msg).toEqual('No votes on the request!');
                })
        });

        test('PATCH 400 - responds with 400 bad request when provided with an invalid value', () => {
            //handled by handlePSQLErrors
            const votesToPatch = {
                votes: 'cats'
            };

            return request(app)
                .patch('/api/articles/1')
                .send(votesToPatch)
                .expect(400)
                .then(response => {
                    expect(response.body.msg).toEqual('Bad request');
                })
        });

        test('PATCH 201 - only patches the votes property even if there is another property on the request', () => {
            // this just ignores the other property as the model can only patch the votes property and nothing else.
            const votesToPatch = {
                votes: 5,
                name: 'Mitch'
            };

            return request(app)
                .patch('/api/articles/1')
                .send(votesToPatch)
                .expect(201)
                .then(response => {
                    // assert the votes have increased by the given number
                    expect(response.body.article[0].votes).toEqual(105);
                    // assert the full updated article is returned
                    expect(response.body.article[0]).toEqual({
                        article_id: 1,
                        title: 'Living in the shadow of a great man',
                        body: 'I find this existence challenging',
                        votes: 105,
                        topic: 'mitch',
                        author: 'butter_bridge',
                        created_at: '2018-11-15T12:21:54.171Z'
                    });
                });
        });

        test('DELETE 204 - removes an article by id', () => {
            // what happens onDelete??
            return request(app)
                .delete('/api/articles/1')
                .expect(204)
                .then(response => {
                    return request(app)
                        .get('/api/articles')
                        .expect(200)
                        .then(response => {
                            expect(response.body.articles.length).toEqual(11);
                        })
                })
        });

        test('DELETE 404 - responds with a 404 customer error when attempting to delete an article that does not exist', () => {
            return request(app)
                .delete('/api/articles/100')
                .expect(404)
                .then(response => {
                    expect(response.body.msg).toEqual('Article not found! Cannot delete.');
                })
        });
    }); // end of /api/articles/:article_id

    describe('/api/articles', () => {
        test('GET 200 - responds with an array of all the articles sorted by created_at most recent first by default', () => {
            return request(app)
                .get('/api/articles')
                .expect(200)
                .then(response => {
                    // assert the response has the correct number of rows
                    expect(response.body.articles.length).toEqual(12);
                    // assert the response is the correct shape
                    expect(response.body).toMatchObject({ articles: expect.any(Array) })
                    // assert the response has the correct properties
                    expect(Object.keys(response.body.articles[0])).toEqual(expect.arrayContaining(['article_id', 'title', 'body', 'votes', 'topic', 'author', 'created_at', 'comment_count']))

                    // assert the response
                    expect(response.body.articles).toBeSortedBy('created_at', { coerce: true });
                });
        });

        // next test here

    });

    describe('Unavailable Routes and Invalid Methods', () => {
        // 404 there is nothing wrong with the request it just doesn't exist.
        test('GET 404 - responds with 404 custom error when route is not available', () => {
            return request(app)
                .get('/not-a-route')
                .expect(404)
                .then(response => {
                    expect(response.body.msg).toEqual('Route not found!');
                })
        });

        test('INVALID METHOD 405 - responds with 405 custom error when the request method in not allowed', () => {

        });
    });

    describe('/api/articles/:article_id/comments', () => {

        test('GET 200 - responds with an array of comments for the given article_id', () => {
            return request(app)
                .get('/api/articles/1/comments')
                .expect(200)
                .then(response => {
                    // assert the response has the correct number of rows
                    expect(response.body.comments.length).toEqual(13);
                    // assert the response is the correct shape
                    expect(response.body).toMatchObject({ comments: expect.any(Array) })
                    // assert the response has the correct properties
                    expect(Object.keys(response.body.comments[0])).toEqual(expect.arrayContaining(['comment_id', 'votes', 'created_at', 'author', 'body']))
                })
        });

        test('GET 200 - responds with an array of comments with default sorting and ordering', () => {
            return request(app)
                .get('/api/articles/1/comments')
                .expect(200)
                .then(response => {
                    expect(response.body.comments).toBeSortedBy('created_at', { coerce: true });
                })
        });

        test('GET 200 - responds with an array of comments sorted by a valid column when queried', () => {
            return request(app)
                .get('/api/articles/1/comments?sort_by=votes')
                .expect(200)
                .then(response => {
                    expect(response.body.comments).toBeSortedBy('votes', { descending: true, coerce: true });
                    expect(response.body.comments[0].votes).toEqual(100);
                })
        });

        test('GET 400 - responds with a 400 for a request made to sort by an invalid column', () => {
            return request(app)
                .get('/api/articles/1/comments?sort_by=totes')
                .expect(400)
                .then(response => {
                    expect(response.body.msg).toEqual('Bad request')
                })
        });

        test('GET 200 - responds with an array of comments order ascending when queried', () => {

            return request(app)
                .get('/api/articles/1/comments?order=asc')
                .expect(200)
                .then(response => {
                    expect(response.body.comments).toBeSortedBy('created_at', { descending: false, coerce: true });
                })
        });

        test('GET 400 - responds with an 400 when ordering by an invalid value', () => {

            return request(app)
                .get('/api/articles/1/comments?order=cats')
                .expect(400)
                .then(response => {
                    expect(response.body.msg).toEqual('Invalid order request');
                })
        });

        test('GET 200 - responds with comments array with chained queries. ordered and sort by', () => {

            return request(app)
                .get('/api/articles/1/comments?sort_by=author&order=asc')
                .expect(200)
                .then(response => {
                    expect(response.body.comments).toBeSortedBy('author', { descending: false, coerce: true });
                })
        });

        test('POST 201 - accepts a new comment object and responds with the posted comment', () => {

            // request body accepts an object with username and body properties
            // responds with the posted comment

            const newComment = {
                username: 'name',
                body: 'text'
            }

        });


    }); // end of /api/articles/:article_id/comments

}); // end of all tests