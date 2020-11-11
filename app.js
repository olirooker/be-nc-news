const express = require("express");
const app = express();
const apiRouter = require("./routers/api_router");
const { handleServerErrors } = require('./controllers/error_controller');

app.use('/api', apiRouter)

// error handling
// app.use(handlePSQLErrors)
app.use(handleServerErrors)

module.exports = app;
