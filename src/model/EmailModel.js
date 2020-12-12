const Sequelize = require('sequelize');

module.exports = {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	uid: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	email: {
		type: Sequelize.STRING(255),
		allowNull: false,
		unique: 'email',
		isEmail: true,
	},
	password: {
		type: Sequelize.TEXT,
		allowNull: false,
    },
};
