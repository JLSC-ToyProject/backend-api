const Sequelize = require('sequelize');

module.exports = class ApartmentPrice extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      dong: {//법정동
        type: Sequelize.STRING(50),
        // allowNull: false,
        // unique: true,
      },//아파트명
        aprtmentName: {
        type: Sequelize.STRING(50),
        // allowNull: false,
        // unique: true,
      },//거래금액
      dealAmount :{
        type: Sequelize.STRING(50),
        allowNull: false,
      },//계약년 
      dealYear: {
        type: Sequelize.STRING(5),

      },//계약월  
      dealMonth: {
        type: Sequelize.STRING(5),

      },//계약일
      dealDay: {
        type: Sequelize.STRING(5),
      },//건축년도
      buildYear: {
        type: Sequelize.STRING(5),
      },
      //전용면적
      areaForExUse:{type: Sequelize.STRING(50),},
      //지번
      jibun:{type: Sequelize.STRING(50),},
      //지역코드
      regionCd:{type: Sequelize.STRING(50),},
      //층
      floor:{type: Sequelize.STRING(50),},
      //해제여부
      cancelType:{type: Sequelize.STRING(50),},
       //주소
      address:{type: Sequelize.STRING(150),},

      //x좌표
      xlocation:{type: Sequelize.STRING(25),},
      //y좌표
      ylocation:{type: Sequelize.STRING(25),},


      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    }, {
      sequelize,
      timestamps: false,
      underscored: false,
 
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

//   static associate(db) {
//     db.User.hasMany(db.Comment, { foreignKey: 'commenter', sourceKey: 'id' });
//   }
};