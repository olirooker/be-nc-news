const express = require("express")
const app = express();
const apiRouter = require("./routes/api_router")

app.use('/api', apiRouter)


module.exports = app;
