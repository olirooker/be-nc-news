// custom error handlers
// exports.send404 = (req, res, next) => {
//     res.status(404).send({ msg: 'Not found!' })
// }

// handle psql errors like bad requests
// exports.handlePSQLErrors = (err, req, res, next) => {
//     const badReqCodes = [];
//     if (badReqCodes.includes(err.code)) res.status(400).send({ msg: 'Bad request' });
//     else next(err)
// }

// handle all other errors
exports.handleServerErrors = (err, req, res, next) => {
    console.log(err, 'error to handle');
    res.status(500).send({ msg: 'Internal Server Error' })
}