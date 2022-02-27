
const Sequelize = require('sequelize');
const User = require('./user');
const User2 = require('./user2');
const Apartment = require('./apartment');
const ApartmentPrice = require('./apartprice');

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

const  sequelize = new Sequelize(config.database, config.username, config.password, config);


db.User= User;
db.User2= User2;
db.Apartment = Apartment ; 
db.ApartmentPrice = ApartmentPrice ; 


db.sequelize = sequelize;
db.Op = Sequelize.Op;
User.init(sequelize);
User2.init(sequelize);
Apartment.init(sequelize);
ApartmentPrice.init(sequelize);


// User.associate(db);
// Apartment.associate(db);

module.exports = db;
