const Sequelize = require('sequelize');

module.exports = class Apartment extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      bjdCode: {
        type: Sequelize.STRING(50),
        // allowNull: false,
        // unique: true,
      },
        kaptName: {
        type: Sequelize.STRING(50),
        allowNull: false,
        // unique: true,
      },
      //   doroJuso: {
      //   type: Sequelize.STRING(50),
      //   allowNull: false,
      // },
      
      as1: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      as2: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      as3: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      as4: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      as5: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      address:{
        type: Sequelize.TEXT,
        allowNull: true,
      },
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