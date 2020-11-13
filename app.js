const express = require("express");
const app = express();
const apiRouter = require("./routers/api_router");
const { send404, send405, handleServerErrors, handlePSQLErrors, handleCustomErrors } = require('./controllers/error_controller');

app.use(express.json())
app.use('/api', apiRouter)

// not sure if this is a good way to handle 404s and 405s
app.get('/*', send404) // endpoints that do not exist
app.all('/*', send405) // ??? for the invalid methods

// error handling
app.use(handleCustomErrors)
app.use(handlePSQLErrors)
app.use(handleServerErrors)

module.exports = app;
