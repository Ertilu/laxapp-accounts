const Sequelize = require('sequelize');

module.exports = {
	uid: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	firstname: {
		type: Sequelize.TEXT,
		allowNull: false,
	},
	lastname: {
		type: Sequelize.TEXT,
		allowNull: true,
    },
    pathImage: {
		type: Sequelize.TEXT,
		allowNull: true,
	},
	token: Sequelize.VIRTUAL,
	credentialGoogle: Sequelize.VIRTUAL,
	credentialEMail: Sequelize.VIRTUAL,
};
