# Possible Errors

This is an incomplete guide to the possible errors that may happen in your app. It is designed to prompt you to think about the errors that could occur as a client uses each endpoint that you have created.

Think about what could go wrong for each route, and the HTTP status code should be sent to the client in each case.
For each thing that could go wrong, make a test with your expected status code and then make sure that possibility is handled.

Bear in mind, handling bad inputs from clients doesn't necessarily have to lead to a 4** status code. Handling can include using default behaviours or even ignoring parts of the request.

---

## Relevant HTTP Status Codes

- 200 OK
- 201 Created
- 204 No Content
- 400 Bad Request
- 404 Not Found
- 405 Method Not Allowed
- 418 I'm a teapot
- 422 Unprocessable Entity
- 500 Internal Server Error

---

## The Express Documentation

[The Express Docs](https://expressjs.com/en/guide/error-handling.html) have a great section all about handling errors in Express.

## Unavailable Routes

### GET `/not-a-route`

- ✅ Status: 404

### PATCH / PUT / POST / DELETE... `/api/articles` etc...

- ✅ Status: 405

---

## Available Routes

### GET `/api/topics`

Added:

- ✅ 404s and 405s covered above

### GET `/api/users/:username`

Added:

- ✅ username does not exist in the database

### GET `/api/articles/:article_id`

- ✅ Bad `article_id` (e.g. `/dog`)
- ✅ Well formed `article_id` that doesn't exist in the database (e.g. `/999999`) - check lecture from Tuesday for a better approach to this

### PATCH `/api/articles/:article_id`

- ✅ No `inc_votes` on request body
- ✅ Invalid `inc_votes` (e.g. `{ inc_votes : "cat" }`)
- ✅ Some other property on request body (e.g. `{ inc_votes : 1, name: 'Mitch' }`)

### Other `/api/articles/:article_id`

Added:

- order request not equal to asc or desc

### POST `/api/articles/:article_id/comments`

- ✅ user is not in the database
- ✅ username not defined
- ✅ additonal properties on the object
- invalid data types

### GET `/api/articles/:article_id/comments`

Added:
- ✅ sort by an invalid column
- `order` !== "asc" / "desc"

### GET `/api/articles`

- Bad queries:
  - ✅  `sort_by` a column that doesn't exist
  - `order` !== "asc" / "desc"
  - ✅  `author` / `topic` that is not in the database
  - ✅  `author` / `topic` that exists but does not have any articles associated with it - could be better

  Added:
- ✅ request to delete an article that doesn't exist

### PATCH `/api/comments/:comment_id`

Added:

- user is not in the database
- username not defined
- additonal properties on the object

### DELETE `/api/comments/:comment_id`

Added:

- ✅ attempt to delete a comment that doesn't exist

### GET `/api`

-
