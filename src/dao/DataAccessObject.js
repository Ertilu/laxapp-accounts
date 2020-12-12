const DbMysql = require('../db/DbMysql');
const ServerConfig = require('../config/ServerConfig');
const { options } = require('@hapi/joi');

class DataAccessObject {
	constructor(tableName, tableModel) {
		// Validate
		if (!tableName) throw new Error('tableName is required');
		if (!tableModel) throw new Error('tableModel is required');
		this.table = DbMysql.db.define(tableName, tableModel);
	}

	async getAll(query = {}, option = {}) {
		try {
			const sqlFilter = { ...query };
			delete sqlFilter.searchMax;
			delete sqlFilter.searchPage;
			delete sqlFilter.searchOrder;

			// Define sql search max
			const sqlPagination = {};
			if (query.searchMax) {
				if (Number.isInteger(query.searchMax)) {
					let limit = parseInt(query.searchMax, 10);
					const defaultLimit = parseInt(ServerConfig.DB_SEARCH_MAX, 10);
					limit = limit > defaultLimit || limit < 0 ? defaultLimit : limit;
					sqlPagination.limit = limit;
				} else {
					sqlPagination.limit = parseInt(ServerConfig.DB_SEARCH_MAX, 10);
				}
			}

			// Define sql search page
			if (query.searchPage) {
				if (Number.isInteger(query.searchPage)) {
					const searchPage = parseInt(query.searchPage, 10);
					if (sqlPagination.limit) {
						sqlPagination.offset = (searchPage - 1) * sqlPagination.limit;
					} else {
						const toSkip = parseInt(ServerConfig.DB_SEARCH_MAX, 10);
						sqlPagination.offset = (searchPage - 1) * parseInt(toSkip, 10);
					}
				} else {
					sqlPagination.offset = 0;
				}
			}

			const sqlOrder = {};
			if (Array.isArray(query.searchOrder) && query.searchOrder.length > 0) {
				sqlOrder.order = query.searchOrder;
			}

			const result = await this.table.findAll({ where: sqlFilter, ...sqlPagination, ...sqlOrder, ...option, raw: true });
			return result;
		} catch (err) {
			throw err;
		}
	}

	async create(data, option = {}) {
		try {
			const queryOption = {
				...option,
				raw: true,
			};
			const result = await this.table.create(data, queryOption);
			return result;
		} catch (err) {
			throw err;
		}
	}

	async edit(query, data, option = {}) {
		try {
			const result = await this.table.update(data, { where: query, ...option });
			return result;
		} catch (err) {
			throw err;
		}
	}

	async delete(query, option = {}) {
		try {
			const result = await this.table.destroy({ where: query, ...option });
			return result;
		} catch (err) {
			throw err;
		}
	}

	async createTransaction() {
		try {
			const t = await DbMysql.db.transaction();
			return t;
		} catch (err) {
			throw err;
		}
	}
}

module.exports = DataAccessObject;
