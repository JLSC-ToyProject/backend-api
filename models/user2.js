const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      name: {
        type: Sequelize.STRING(20),
 
        unique: true,
      },
      password: {
        type: Sequelize.STRING(20),

      },
      married: {
        type: Sequelize.BOOLEAN,

      },
      comment: {
        type: Sequelize.TEXT,
   
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
      modelName: 'User2',
      tableName: 'users2',
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  // static associate(db) {
  //   db.User.hasMany(db.Comment, { foreignKey: 'commenter', sourceKey: 'id' });
  // }
};