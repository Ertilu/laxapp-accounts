/* eslint-disable import/newline-after-import */
const DbMysql = require('../db/DbMysql');
const {
    AccountModel,
    GoogleAccountModel,
    EmailModel
} = require('../model');

// Setup data access object
const DataAccessObject = require('./DataAccessObject');
const AccountDAO = new DataAccessObject('Account', AccountModel);
const GoogleAccountDAO = new DataAccessObject('GoogleAccount', GoogleAccountModel);
const EmailDAO = new DataAccessObject('Email', EmailModel);

// Create all dao table
DbMysql.createAllTable();
DbMysql.initialize();

module.exports = { GoogleAccountDAO, AccountDAO, EmailDAO };
