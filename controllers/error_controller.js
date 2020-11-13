// handle specific custom errors
exports.send404 = (req, res, next) => {
    res.status(404).send({ msg: 'Route not found!' })
}

// handle things that we want to be errors
exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status) {
        res.status(err.status).send({ msg: err.msg })
    }
    else next(err)
}

// handle psql errors like bad requests
exports.handlePSQLErrors = (err, req, res, next) => {
    const badReqCodes = ['22P02', '42703'];
    const notFoundCodes = ['23503'];
    if (badReqCodes.includes(err.code)) {
        res.status(400).send({ msg: 'Bad request' });
    }
    if (notFoundCodes.includes(err.code)) {
        res.status(404).send({ msg: 'Not found!' });
    }
    else next(err)
}

// handle all other errors
exports.handleServerErrors = (err, req, res, next) => {
    console.log(err, '<<<< error to handle');
    res.status(500).send({ msg: 'Internal Server Error' })
}