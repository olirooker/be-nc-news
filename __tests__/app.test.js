const connection = require("../db/connection")
const app = require("../app")
const request = require("supertest");
// const { response } = require("express");
// line 4 appeared - what is this?


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
        test('GET 200 - responds with an object of a given user', () => {
            return request(app)
                .get('/api/users/butter_bridge')
                .expect(200)
                .then(response => {
                    expect(response.body).toMatchObject({ user: expect.any(Object) })
                    expect(Object.keys(response.body.user)).toEqual(expect.objectContaining(['username', 'avatar_url', 'name']))

                    expect(response.body.user).toEqual({
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
        test('GET 200 - responds with an object of a given article, including a count of how many comments the article has', () => {
            return request(app)
                .get('/api/articles/1')
                .expect(200)
                .then(response => {
                    console.log(response.body)
                    expect(response.body).toMatchObject({ article: expect.any(Object) })
                    expect(Object.keys(response.body.article)).toEqual(expect.objectContaining(['article_id', 'title', 'body', 'votes', 'topic', 'author', 'created_at', 'comment_count']))

                    expect(response.body.article).toEqual({
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
                    console.log(response.body)
                    expect(response.body.article.comment_count).toEqual('0');
                })
        });

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
                    expect(response.body.article[0].votes).toEqual(99);
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

        test('PATCH 400 - responds with 400 bad request when provided with an invalid value on the votes object', () => {
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
                    expect(response.body.article[0].votes).toEqual(105);
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
                    expect(response.body.articles.length).toEqual(12);
                    expect(response.body).toMatchObject({ articles: expect.any(Array) })
                    expect(Object.keys(response.body.articles[0])).toEqual(expect.arrayContaining(['author', 'title', 'body', 'article_id', 'topic', 'created_at', 'votes', 'comment_count']))

                    expect(response.body.articles).toBeSortedBy('created_at', { coerce: true });
                });
        });

        test('GET 200 - responds with an array of all the articles sorted by any valid column', () => {
            return request(app)
                .get('/api/articles?sort_by=topic')
                .expect(200)
                .then(response => {
                    expect(response.body.articles).toBeSortedBy('topic', { coerce: true });
                });
        });

        test('GET 200 - responds with an array of all articles ordered ascending', () => {
            return request(app)
                .get('/api/articles?order=asc')
                .expect(200)
                .then(response => {
                    expect(response.body.articles).toBeSortedBy('created_at', { descending: false, coerce: true });
                    expect(response.body.articles[0].created_at).toEqual('1974-11-26T12:21:54.171Z');
                });
        });

        test('GET 200 - responds with an array of articles written by the same author', () => {
            return request(app)
                .get('/api/articles?username=icellusedkars')
                .expect(200)
                .then(response => {
                    console.log(response.body.articles)
                    response.body.articles.forEach(article => {
                        expect(article.author).toEqual('icellusedkars');
                    })
                });
        });

        test('GET 200 - responds with an array of articles filtered by topic', () => {
            return request(app)
                .get('/api/articles?topic=cats')
                .expect(200)
                .then(response => {
                    console.log(response.body.articles)
                    response.body.articles.forEach(article => {
                        expect(article.topic).toEqual('cats');
                    })
                });
        });

        test('GET 400 - when sorting by an invalid column', () => {
            return request(app)
                .get('/api/articles?sort_by=not_a_column')
                .expect(400)
                .then(response => {
                    expect(response.body.msg).toEqual('Bad request')
                })
        });

        test('GET 400 - responds with an 400 when ordering by an invalid value', () => {

            return request(app)
                .get('/api/articles?order=cats')
                .expect(400)
                .then(response => {
                    console.log(response.body)
                    expect(response.body.msg).toEqual('Bad request: Invalid order query')
                })
        });

        test('GET 404 - responds with 404 when the author is not in the database', () => {
            return request(app)
                .get('/api/articles?username=bilbo_baggins')
                .expect(404)
                .then(response => {
                    expect(response.body.msg).toEqual('bilbo_baggins? No articles found!');
                });
        });

        test('GET 404 - responds with 404 when the topic is not in the database', () => {
            return request(app)
                .get('/api/articles?topic=mushrooms')
                .expect(404)
                .then(response => {
                    expect(response.body.msg).toEqual('mushrooms? No articles found!');
                });
        });

        test('GET 404 - responds with 404 when the author has not posted any articles', () => {
            return request(app)
                .get('/api/articles?username=lurker')
                .expect(404)
                .then(response => {
                    expect(response.body.msg).toEqual('No articles yet!');
                });
        });

        test('GET 404 - responds with 404 when there are no articles for a valid topic', () => {
            return request(app)
                .get('/api/articles?topic=paper')
                .expect(404)
                .then(response => {
                    expect(response.body.msg).toEqual('No articles yet!');
                });
        });

        test('POST 201 - accepts a new comment object and responds with the posted article', () => {

            const newArticle = {
                username: 'icellusedkars',
                topic: 'cats',
                title: 'Can cats and dogs get along?',
                body: 'Short answer, yes!'
            }

            return request(app)
                .post('/api/articles')
                .send(newArticle)
                .expect(201)
                .then(response => {
                    expect(response.body).toMatchObject({ postedArticle: expect.any(Object) });
                    expect(Object.keys(response.body.postedArticle)).toEqual(expect.arrayContaining(['author', 'title', 'body', 'article_id', 'topic', 'created_at', 'votes']));
                })

        });

        test.only('POST 404 - response with 404 if the topic is not in the database', () => {
            const newArticle = {
                username: 'icellusedkars',
                topic: 'dogs',
                title: 'Can cats and dogs get along?',
                body: 'Short answer, yes!'
            }

            return request(app)
                .post('/api/articles')
                .send(newArticle)
                .expect(404)
                .then(response => {
                    console.log(response.body)
                })
        });

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
            return request(app)
                .delete('/api/topics')
                .expect(405)
                .then(response => {
                    expect(response.body.msg).toEqual('Method not allowed!');
                })
        });
    });

    describe('/api/articles/:article_id/comments', () => {

        test('GET 200 - responds with an array of comments for the given article_id', () => {
            return request(app)
                .get('/api/articles/1/comments')
                .expect(200)
                .then(response => {
                    expect(response.body.comments.length).toEqual(13);
                    expect(response.body).toMatchObject({ comments: expect.any(Array) })
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

        // test.only('GET 400 - responds with an 400 when ordering by an invalid value', () => {

        //     return request(app)
        //         .get('/api/articles/1/comments?order=cats')
        //         .expect(400)
        //         .then(response => {
        //             expect(response.body.msg).toEqual('Invalid order request');
        //         })
        // });

        test('GET 200 - responds with comments array with chained queries. ordered and sort by', () => {

            return request(app)
                .get('/api/articles/1/comments?sort_by=author&order=asc')
                .expect(200)
                .then(response => {
                    expect(response.body.comments).toBeSortedBy('author', { descending: false, coerce: true });
                })
        });

        test('POST 201 - accepts a new comment object and responds with the posted comment', () => {

            const newComment = {
                username: 'icellusedkars',
                body: 'I don\'t know half of you half as well as I should like; and I like less than half of you half as well as you deserve.'
            }

            return request(app)
                .post('/api/articles/3/comments')
                .send(newComment)
                .expect(201)
                .then(response => {
                    expect(response.body).toMatchObject({ postedComment: expect.any(Object) })
                    expect(Object.keys(response.body.postedComment)).toEqual(expect.arrayContaining(['comment_id', 'author', 'article_id', 'votes', 'created_at', 'body']))

                    // the new Date() creates different times so this test fails

                    // expect(response.body.postedComment[0]).toEqual({
                    //     comment_id: 19,
                    //     author: 'icellusedkars',
                    //     article_id: 3,
                    //     votes: 0,
                    //     created_at: new Date(),
                    //     body: "I don't know half of you half as well as I should like; and I like less than half of you half as well as you deserve."
                    // });
                })
        });

        test('POST 404 - responds with a 404 if the username is not a user', () => {

            const newComment = {
                username: 'Bilbo_Baggins',
                body: 'I don\'t know half of you half as well as I should like; and I like less than half of you half as well as you deserve.'
            };

            return request(app)
                .post('/api/articles/3/comments')
                .send(newComment)
                .expect(404)
                .then(response => {
                    expect(response.body.msg).toEqual('Not found!');
                })
        });

        test('POST 400 - responds with a 400 when the username property is not defined', () => {

            const newComment = {
                body: 'I don\'t know half of you half as well as I should like; and I like less than half of you half as well as you deserve.'
            };

            return request(app)
                .post('/api/articles/3/comments')
                .send(newComment)
                .expect(400)
                .then(response => {
                    expect(response.body.msg).toEqual('Missing information on the request!');
                })
        });

        test('POST 400 - responds with a 400 when the body is not defined', () => {
            const newComment = {
                username: 'icellusedkars'
            };

            return request(app)
                .post('/api/articles/3/comments')
                .send(newComment)
                .expect(400)
                .then(response => {
                    expect(response.body.msg).toEqual('Missing information on the request!');
                })
        });

        test('POST 201 - additional properties on the request have no impact on the post', () => {

            const newComment = {
                username: 'icellusedkars',
                body: 'I don\'t know half of you half as well as I should like; and I like less than half of you half as well as you deserve.',
                flamingo: 'bird'
            }

            return request(app)
                .post('/api/articles/3/comments')
                .send(newComment)
                .expect(201)
                .then(response => {
                    console.log(response.body)
                    expect(Object.keys(response.body.postedComment)).toEqual(expect.arrayContaining(['comment_id', 'author', 'article_id', 'votes', 'created_at', 'body']))
                });
        });

        // next test about invalid data types on the username and body properties
        // the data type should be 'text' - what is invalid on text



    }); // end of /api/articles/:article_id/comments

    describe('/api/comments/:comment_id', () => {
        test('PATCH 201 - request body accepts an object which increases the vote property of the comment, responds with the updated comment', () => {
            const votesToPatch = {
                inc_votes: 1
            };

            return request(app)
                .patch('/api/comments/4')
                .send(votesToPatch)
                .expect(201)
                .then(response => {
                    // assert the votes have increased by the given number
                    expect(response.body.comment.votes).toEqual(-99);
                    // assert the full updated comment is returned
                    expect(response.body.comment).toEqual({
                        comment_id: 4,
                        author: 'icellusedkars',
                        article_id: 1,
                        votes: -99,
                        created_at: '2014-11-23T12:36:03.389Z',
                        body: ' I carry a log — yes. Is it funny to you? It is not to me.'
                    });
                })
        });

        test('PATCH 201 - request body accepts an object which decreases the vote property of the comment, responds with the updated comment', () => {
            const votesToPatch = {
                inc_votes: -1
            };

            return request(app)
                .patch('/api/comments/4')
                .send(votesToPatch)
                .expect(201)
                .then(response => {
                    // assert the votes have decreased by the given number
                    expect(response.body.comment.votes).toEqual(-101);
                    // assert the full updated comment is returned
                    expect(response.body.comment).toEqual({
                        comment_id: 4,
                        author: 'icellusedkars',
                        article_id: 1,
                        votes: -101,
                        created_at: '2014-11-23T12:36:03.389Z',
                        body: ' I carry a log — yes. Is it funny to you? It is not to me.'
                    });
                })
        });

        // bad request tests on the votesToPatch object

        test('DELETE 204 - delete the given comment by comment_id, responds with 204 and no content', () => {
            return request(app)
                .delete('/api/comments/4')
                .expect(204)
                .then(response => {
                    return request(app)
                        .get('/api/articles/1')
                        .expect(200)
                        .then(response => {
                            expect(response.body.article.comment_count).toEqual('12');
                        })
                })
        });

        test('DELETE 404 - responds with 404 when attempting to delete a comment that does not exist', () => {
            return request(app)
                .delete('/api/comments/100')
                .expect(404)
                .then(response => {
                    expect(response.body.msg).toEqual('Comment not found! Cannot delete.');
                })
        });

    }); // end of /api/comments/:comment_id

}); // end of all tests