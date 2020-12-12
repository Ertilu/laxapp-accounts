/* eslint-disable no-console */
const Sequelize = require('sequelize');
const ServerConfig = require('../config/ServerConfig');

class DbMysql {
	constructor() {
		if (!ServerConfig.DB_DATABASE) throw new Error('ServerConfig.DB_DATABASE is missing');
		if (!ServerConfig.DB_USERNAME) throw new Error('ServerConfig.DB_USERNAME is missing');
		if (!ServerConfig.DB_PASSWORD) throw new Error('ServerConfig.DB_PASSWORD is missing');
		if (!ServerConfig.DB_URL) throw new Error('ServerConfig.DB_URL is missing');

		this.db = new Sequelize(ServerConfig.DB_DATABASE, ServerConfig.DB_USERNAME, ServerConfig.DB_PASSWORD, {
			host: ServerConfig.DB_URL,
			dialect: 'mysql',
			logging: false,
			freezeTableName: true,
		});
	}

	async initialize() {
		try {
			await this.db.authenticate();
			console.log(`myssql db ${ServerConfig.DB_DATABASE} connection success`);
		} catch (err) {
			console.error('myssql connection failed');
			throw err;
		}
	}

	async createAllTable() {
		try {
			await this.db.sync({ alter: ServerConfig.DB_ALTER_DATA });
		} catch (err) {
			throw err;
		}
	}
}

module.exports = new DbMysql();
