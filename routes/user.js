/**
 * @file routes/user.js
 * @author shjang
 */

const express = require('express');
const router = express.Router();
const userSignUp = require('../api/user/loginUser.js').userSignUp;
const userSignOut = require('../api/user/loginUser.js').userSuserSignOutignUp;
const getUserInfo = require('../api/user/loginUser.js').getUserInfo;
const getUserFavorites = require('../api/user/loginUser.js').getUserFavorites;

/* GET user listing. */
router.get('/', function(req, res) {
    res.send(`respond with a user`);
});

// 신규 사용자 가입
router.post('/signup', async (req, res) => {

});

// 사용자 정보 삭제
router.post('/signout', async (req, res) => {
    
});

// 사용자 정보 조회
router.post('/info', async (req, res) => {
    
});

// 사용자 즐겨찾기 정보 조회
router.post('/favorites', async (req, res) => {
    
});

module.exports = router;