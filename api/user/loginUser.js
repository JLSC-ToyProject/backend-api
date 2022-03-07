/**
 * @file loginUser.js
 * @notice User 관련 API 호출 코드
 * @author shjang
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

module.exports.userSignUp = async (options) => {
    try {
        
        return ;
    } catch(error) {
        console.log("loginUser::userSignUp::error", error);
    }
}

module.exports.userSignOut = async (options) => {
    try {
        
        return ;
    } catch(error) {
        console.log("loginUser::userSignOut::error", error);
    }
}

module.exports.getUserInfo = async (options) => {
    try {
        
        return ;
    } catch(error) {
        console.log("loginUser::getUserInfo::error", error);
    }
}

module.exports.getUserFavorites = async (options) => {
    try {
        
        return ;
    } catch(error) {
        console.log("loginUser::getUserFavorites::error", error);
    }
}
