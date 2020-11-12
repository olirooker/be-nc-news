const express = require("express");
const app = express();
const apiRouter = require("./routers/api_router");
const { send404, handleServerErrors, handlePSQLErrors, handleCustomErrors } = require('./controllers/error_controller');

app.use(express.json())
app.use('/api', apiRouter)

app.all('/*', send404) // endpoints that do not exist
//  app.all('/*', send405) // ??? for the invalid methods

// error handling
app.use(handleCustomErrors)
app.use(handlePSQLErrors)
app.use(handleServerErrors)

module.exports = app;
