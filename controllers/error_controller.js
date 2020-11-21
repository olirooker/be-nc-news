exports.send404 = (req, res, next) => {
    res.status(404).send({ msg: 'Route not found!' })
};

exports.send405 = (req, res, next) => {
    res.status(405).send({ msg: 'Method not allowed!' })
};

exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status) {
        res.status(err.status).send({ msg: err.msg })
    }
    else next(err)
};

exports.handlePSQLErrors = (err, req, res, next) => {
    const badReqCodes = ['22P02', '42703', '23502'];
    const notFoundCodes = ['23503'];
    const alreadyExists = ['23505'];
    if (badReqCodes.includes(err.code)) {
        res.status(400).send({ msg: 'Bad request' });
    }
    else if (notFoundCodes.includes(err.code)) {
        res.status(404).send({ msg: 'Not found!' });
    }
    else if (alreadyExists.includes(err.code)) {
        res.status(400).send({ msg: 'This page already exists!' })
    }
    else next(err)
};

exports.handleServerErrors = (err, req, res, next) => {
    console.log(err, '<<<< error to handle');
    res.status(500).send({ msg: 'Internal Server Error' })
};