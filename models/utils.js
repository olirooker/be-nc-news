const connection = require("../db/connection");

exports.checkUserExists = (user) => {
    return connection
        .select('*')
        .from('users')
        .where('username', '=', user)
        .then(username => {
            if (username.length === 0) return false
            else return true
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