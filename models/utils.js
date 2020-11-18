const connection = require("../db/connection");

exports.checkExists = (table, column, query) => {

    if (!query) return true;

    return connection
        .select('*')
        .from(table)
        .where(column, '=', query)
        .then(result => {
            if (result.length === 0) {
                return Promise.reject({ status: 404, msg: `${query}? No articles found!` })
            }
            else return true;
        })
};




// exports.checkExists = (table, column, query) => {

//     if (!query) return true;

//     return connection
//         .select('*')
//         .where({ [column]: query })
//         .where(column, '=', query)
//         .first()
//         .then(result => {
//             console.log(result, '<<<<<<<<<< utils')
//             const notFound = table[0].toUpperCase() + table.slice(1, -1);
//             return result ? true : Promise.reject({ status: 404, msg: `${notFound} Not Found` })
//             // if (result) {
//             //     return true
//             // }
//             // else {
//             //     return Promise.reject({ status: 404, msg: `${notFound} Not Found` })
//             // }
//         })
// };