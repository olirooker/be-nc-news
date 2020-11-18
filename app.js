const express = require("express");
const app = express();
const apiRouter = require("./routers/api_router");
const { send404, handleServerErrors, handlePSQLErrors, handleCustomErrors } = require('./controllers/error_controller');

app.use(express.json())
app.use('/api', apiRouter)

// not sure if this is a good way to handle 404s and 405s
app.all('/*', send404) // endpoints that do not exist

// error handling
app.use(handleCustomErrors)
app.use(handlePSQLErrors)
app.use(handleServerErrors)

module.exports = app;
