/**
 * @file mysqlConnection.js
 * @notice Mysql 접속을 위한 connectionPool 생성 부분
 * @author shjang
 */

const mysql2 = require("mysql2/promise");
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = mysql2.createPool({
    host : process.env.MYSQL_HOST,
    user : process.env.MYSQL_USER,
    port : process.env.MYSQL_PORT,
    password : process.env.MYSQL_PASSWORD,
    database : process.env.MYSQL_DATABASE
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
