const mysql2 = require("mysql2/promise");

const pool = mysql2.createPool({
    host : '35.212.140.89',
    user : 'root',
    port : 3306,
    password : 'toy12345/',
    database : 'toy_project',
    connectionLimit: 4
});

let connection;
let getConnectionPool = async () => {
    try {
        connection = await pool.getConnection(async conn => conn);
        return connection;
    } catch(error) {
        console.log("mysql connection::error", error);
    }
} 

module.exports.connDB = getConnectionPool;
