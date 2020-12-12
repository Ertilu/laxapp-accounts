const Sequelize = require('sequelize');

module.exports = {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	idGoogle:{
		type: Sequelize.TEXT,
		allowNull: false,
		unique: "idGoogle"
	},
	uid: {
		type: Sequelize.INTEGER,
		allowNull: false,
		unique: "uid",
	},
	email: {
		type: Sequelize.TEXT,
		allowNull: false,
		unique: "email"
	},
};
