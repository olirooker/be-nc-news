const connection = require("../db/connection")
const app = require("../app")
const request = require("supertest");
const endpoints = require('../endpoints.json');

describe("northcoders news api", () => {
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
                    expect(response.body.topics.length).toEqual(3);
                    expect(response.body).toMatchObject({ topics: expect.any(Array) })
                    expect(Object.keys(response.body.topics[0])).toEqual(expect.arrayContaining(['description', 'slug']))

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

        test('POST 201 - request body accepts a new topic object and responds with the posted topic', () => {
            const newTopic = {
                slug: 'dogs',
                description: 'Not cats'
            }

            return request(app)
                .post('/api/topics')
                .send(newTopic)
                .expect(201)
                .then(response => {
                    expect(response.body).toMatchObject({ postedTopic: expect.any(Object) });
                    expect(Object.keys(response.body.postedTopic)).toEqual(expect.arrayContaining(['slug', 'description']));
                    expect(response.body.postedTopic).toEqual({ slug: 'dogs', description: 'Not cats' });
                })
        });

        test('POST 400 - responds with 400 if the slug is not defined', () => {
            const newTopic = {
                description: 'Not cats'
            };

            return request(app)
                .post('/api/topics')
                .send(newTopic)
                .expect(400)
                .then(response => {
                    expect(response.body.msg).toEqual('Bad request');
                });
        });

        test('POST 400 - responds with 400 if the description is not defined', () => {
            const newTopic = {
                slug: 'dogs'
            };

            return request(app)
                .post('/api/topics')
                .send(newTopic)
                .expect(400)
                .then(response => {
                    expect(response.body.msg).toEqual('Please include a description');
                });
        });

        test('POST 400 - responds with 400 the requested topic to add already exists', () => {
            const newTopic = {
                slug: 'cats',
                description: 'A rival cats page!'
            };

            return request(app)
                .post('/api/topics')
                .send(newTopic)
                .expect(400)
                .then(response => {
                    expect(response.body.msg).toEqual('This already exists!');
                });
        });

        test('POST 201 - ignores any additional properties on the request body', () => {
            const newTopic = {
                slug: 'dogs',
                description: 'Not cats',
                extra: 'content!'
            };

            return request(app)
                .post('/api/topics')
                .send(newTopic)
                .expect(201)
                .then(response => {
                    expect(response.body.postedTopic).toEqual({
                        slug: 'dogs',
                        description: 'Not cats'
                    });
                });
        });
    });

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
            const votesToPatch = {
                votes: 1
            };

            return request(app)
                .patch('/api/articles/1')
                .send(votesToPatch)
                .expect(201)
                .then(response => {
                    expect(response.body.article[0].votes).toEqual(101);
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
            return request(app)
                .delete('/api/articles/1')
                .expect(204)
                .then(response => {
                    return request(app)
                        .get('/api/articles/1')
                        .expect(404)
                        .then(response => {
                            expect(response.body.msg).toEqual('Article not found!');
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

        test('POST 404 - response with 404 if the topic is not in the database', () => {
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
                    expect(response.body.msg).toEqual('Not found!');
                })
        });

        test('POST 404 - responds with 404 if the username is not in the database', () => {
            const newArticle = {
                username: 'bilbo_baggins',
                topic: 'paper',
                title: 'The best paper grades to start a novel',
                body: 'Starting a novel with ink and quill is difficult so make sure you have the right paper!'
            }

            return request(app)
                .post('/api/articles')
                .send(newArticle)
                .expect(404)
                .then(response => {
                    expect(response.body.msg).toEqual('Not found!');
                })
        });

        test('POST 400 - responds with 400 if the username is not provided in the request', () => {
            const newArticle = {
                topic: 'paper',
                title: 'The best paper grades to start a novel',
                body: 'Starting a novel with ink and quill is difficult so make sure you have the right paper!'
            }

            return request(app)
                .post('/api/articles')
                .send(newArticle)
                .expect(400)
                .then(response => {
                    expect(response.body.msg).toEqual('Bad request');
                })
        });

        test('POST 400 - responds with 400 if the topic is not provided in the request', () => {
            const newArticle = {
                username: 'bilbo_baggins',
                title: 'The best paper grades to start a novel',
                body: 'Starting a novel with ink and quill is difficult so make sure you have the right paper!'
            }

            return request(app)
                .post('/api/articles')
                .send(newArticle)
                .expect(400)
                .then(response => {
                    expect(response.body.msg).toEqual('Bad request');
                })
        });

        test('POST 400 - responds with 400 if the title is not provided in the request', () => {
            const newArticle = {
                username: 'bilbo_baggins',
                topic: 'paper',
                body: 'Starting a novel with ink and quill is difficult so make sure you have the right paper!'
            }

            return request(app)
                .post('/api/articles')
                .send(newArticle)
                .expect(400)
                .then(response => {
                    expect(response.body.msg).toEqual('Missing information on the request!');
                })
        });

        test('POST 400 - responds with 400 if the body is not provided in the request', () => {
            const newArticle = {
                username: 'bilbo_baggins',
                topic: 'paper',
                title: 'The best paper grades to start a novel'
            }

            return request(app)
                .post('/api/articles')
                .send(newArticle)
                .expect(400)
                .then(response => {
                    expect(response.body.msg).toEqual('Missing information on the request!');
                })
        });

        test('POST 201 - ignores any additional properties on the request body', () => {
            const newArticle = {
                username: 'icellusedkars',
                topic: 'cats',
                title: 'Can cats and dogs get along?',
                body: 'Short answer, yes!',
                extra: 'content'
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

        test('GET 200 - responds with an array of articles limited to 10', () => {
            return request(app)
                .get('/api/articles')
                .expect(200)
                .then(response => {
                    expect(response.body.articles.length).toEqual(10);
                })
        });
    });

    describe('Unavailable Routes and Invalid Methods', () => {
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

        xtest('GET 400 - responds with an 400 when ordering by an invalid value', () => {
            return request(app)
                .get('/api/articles/1/comments?order=cats')
                .expect(400)
                .then(response => {
                    expect(response.body.msg).toEqual('Bad request: Invalid order query');
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

        test('POST 201 - ignores any additional properties on the request body', () => {
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

        test('GET 200 - responds with an array of comments limited to 10', () => {
            return request(app)
                .get('/api/articles/1/comments')
                .expect(200)
                .then(response => {
                    expect(response.body.comments.length).toEqual(10);
                })
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
                    expect(response.body.comment.votes).toEqual(-99);
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
                    expect(response.body.comment.votes).toEqual(-101);
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

    describe('/api', () => {
        test('GET 200 - responds with a JSON of all the available endpoints', () => {
            return request(app)
                .get('/api')
                .expect(200)
                .then(response => {
                    expect(response.body.endpoints).toEqual(endpoints);
                })
        });
    });

    describe('/api/users', () => {
        test('GET 200 - responds with an array of users', () => {
            return request(app)
                .get('/api/users')
                .expect(200)
                .then(response => {
                    expect(response.body.users.length).toEqual(4);
                    expect(response.body).toMatchObject({ users: expect.any(Array) });
                    expect(Object.keys(response.body.users[0])).toEqual(expect.arrayContaining(['username', 'avatar_url', 'name']));

                    expect(response.body).toEqual({
                        users: [
                            {
                                username: 'butter_bridge',
                                avatar_url: 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
                                name: 'jonny'
                            },
                            {
                                username: 'icellusedkars',
                                avatar_url: 'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4',
                                name: 'sam'
                            },
                            {
                                username: 'rogersop',
                                avatar_url: 'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4',
                                name: 'paul'
                            },
                            {
                                username: 'lurker',
                                avatar_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                                name: 'do_nothing'
                            }
                        ]
                    })
                })
        });

        test('POST 201 - sends a new user object and responds with the new user added to the database', () => {
            const newUser = {
                username: 'the_gardener',
                name: 'Samwise',
                avatar_url: 'https://lthumb.lisimg.com/077/8432077.jpg?width=411&sharpen=true'
            };

            return request(app)
                .post('/api/users')
                .send(newUser)
                .expect(201)
                .then(response => {
                    expect(response.body).toMatchObject({ postedUser: expect.any(Object) });
                    expect(Object.keys(response.body.postedUser)).toEqual(expect.arrayContaining(['username', 'avatar_url', 'name']));
                    expect(response.body.postedUser).toEqual({
                        username: 'the_gardener',
                        avatar_url: 'https://lthumb.lisimg.com/077/8432077.jpg?width=411&sharpen=true',
                        name: 'Samwise'
                    });
                });
        });

        test('POST 400 - responds with 400 when username already exists', () => {
            const newUser = {
                username: 'icellusedkars',
                name: 'Sam',
                avatar_url: 'https://nerdist.com/wp-content/uploads/2020/07/maxresdefault.jpg'
            };

            return request(app)
                .post('/api/users')
                .send(newUser)
                .expect(400)
                .then(response => {
                    expect(response.body.msg).toEqual('This already exists!');
                });
        });

        test('POST 400 - responds with 400 when username is not defined', () => {
            const newUser = {
                name: 'Samwise',
                avatar_url: 'https://lthumb.lisimg.com/077/8432077.jpg?width=411&sharpen=true'
            };

            return request(app)
                .post('/api/users')
                .send(newUser)
                .expect(400)
                .then(response => {
                    expect(response.body.msg).toEqual('Bad request');
                });
        });

        test('POST 400 - responds with 400 when name is not defined', () => {
            const newUser = {
                username: 'the_gardener',
                avatar_url: 'https://lthumb.lisimg.com/077/8432077.jpg?width=411&sharpen=true'
            };

            return request(app)
                .post('/api/users')
                .send(newUser)
                .expect(400)
                .then(response => {
                    expect(response.body.msg).toEqual('Missing information on the request');
                });
        });

        test('POST 400 - responds with 400 when avatar_url is not defined', () => {
            const newUser = {
                username: 'the_gardener',
                name: 'Samwise'
            };

            return request(app)
                .post('/api/users')
                .send(newUser)
                .expect(400)
                .then(response => {
                    expect(response.body.msg).toEqual('Missing information on the request');
                });
        });

        test('POST 400 - ignores unnecessary content on the request body', () => {
            const newUser = {
                username: 'the_gardener',
                name: 'Samwise',
                avatar_url: 'https://lthumb.lisimg.com/077/8432077.jpg?width=411&sharpen=true',
                extra: 'content!'
            };

            return request(app)
                .post('/api/users')
                .send(newUser)
                .expect(201)
                .then(response => {
                    expect(response.body.postedUser).toEqual({
                        username: 'the_gardener',
                        avatar_url: 'https://lthumb.lisimg.com/077/8432077.jpg?width=411&sharpen=true',
                        name: 'Samwise'
                    });
                });
        });
    });



}); // end of all tests