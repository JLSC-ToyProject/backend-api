/**
 * @file examMysql.js
 * @notice Mysql 접속 및 쿼리 예제 코드
 * @author shjang
 */

const connDB = require('../models/mysqlConnection.js').connDB;

const RunProc = async () => {
    try {
        const db = await connDB();
        try {
            const [rows] = await db.query('select * from user');
            db.release();
            console.log(rows);
        } catch(error) {
            console.log("RunProc::dbquery::error", error);
            db.release();
        }
    } catch(error) {
        console.log("RunProc::error", error);
    }
}
RunProc();
