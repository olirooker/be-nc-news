const express = require("express");
const app = express();
const apiRouter = require("./routers/api_router");
const { send404, handleServerErrors, handlePSQLErrors, handleCustomErrors } = require('./controllers/error_controller');

app.use(express.json())
app.use('/api', apiRouter)

app.all('/*', send404)

app.use(handleCustomErrors)
app.use(handlePSQLErrors)
app.use(handleServerErrors)

module.exports = app;
