module.exports = {
	PORT: process.env.PORT,
	DEBUG_SERVER: process.env.DEBUG_SERVER,

	DB_URL: process.env.DB_URL,
	DB_USERNAME: process.env.DB_USERNAME,
	DB_PASSWORD: process.env.DB_PASSWORD,
	DB_DATABASE: process.env.DB_DATABASE,
	DB_PORT: process.env.DB_PORT,
	DB_ALTER_DATA: process.env.DB_ALTER_DATA || false,
	DB_SEARCH_MAX: process.env.DB_SEARCH_MAX,

	JWT_SECRET: process.env.JWT_SECRET || "EMBREO_SUPER_SECRET_HENTAI",
};
