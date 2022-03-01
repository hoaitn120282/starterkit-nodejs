const Sequelize = require("sequelize");
const bcrypt = require("bcrypt-nodejs");
const _ = require("lodash");
const db = require("../../config/db");

/**
 * Player Schema
 */
const PlayerSchema = {
  id: {
    type: Sequelize.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  walletID: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  starNumber: {
    allowNull: false,
    type: Sequelize.INTEGER,
  },
  mana: {
    allowNull: false,
    type: Sequelize.INTEGER,
  },
  hp: {
    allowNull: false,
    type: Sequelize.INTEGER,
  },
  skinName: {
    allowNull: false,
    type: Sequelize.STRING,
  },
  totalExp: {
    allowNull: false,
    type: Sequelize.INTEGER,
  },
  description: {
    allowNull: true,
    type: Sequelize.STRING,
  },
  external_url: {
    allowNull: true,
    type: Sequelize.STRING,
  },
  image: {
    allowNull: true,
    type: Sequelize.STRING,
  },
  attributes: {
    allowNull: true,
    type: Sequelize.JSONB,
  },
  tokenID: {
    allowNull: false,
    type: Sequelize.STRING,
  },
  createdAt: {
    allowNull: false,
    type: Sequelize.DATE,
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE,
  },
};

const Player = db.sequelize.define("players", PlayerSchema);

/**
 * Statics
 */

/**
 * Get player
 * @param {number} id - The id of player.
 * @returns {Promise<Player, APIError>}
 */
Player.get = function get({ skip = 0, limit = 50, walletID = null } = {}) {
  return this.findAll({
    where: {
      walletID,
    },
    limit,
    offset: skip,
    $sort: { id: 1 },
  });
};

/**
 * Get top play's exp
 * @returns {Promise<Player, APIError>}
 */
Player.getListExp = function getListExp({
  skip = 0,
  limit = 50,
  where = {},
  order = [],
} = {}) {
  return this.findAll({
    limit,
    offset: skip,
    where,
    order,
  });
};

/**
 * List player in order of 'id'.
 * @param {number} skip - Number of player to be skipped.
 * @param {number} limit - Limit number of player to be returned.
 * @returns {Promise<User[]>}
 */
Player.list = function list({ skip = 0, limit = 50 } = {}) {
  return this.findAll({
    limit,
    offset: skip,
    $sort: { id: 1 },
  });
};

Player.getByID = function getByID(id) {
  return this.findOne({
    where: {
      id,
    },
  });
};

Player.getByWalletId = function WalletId(walletID) {
  return this.findOne({
    where: {
      walletID,
    },
  });
};

/**
 * Methods
 */

/**
 * Generates password for the plain password.
 * @param password
 * @returns {string} - hashed password
 */
Player.prototype.generatePassword = function generatePassword(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

/**
 * Checks if the password matches the hash of password
 * @param password
 * @returns {boolean} - Returns true if password matches.
 */
Player.prototype.validPassword = function validPassword(password) {
  return bcrypt.compareSync(password, this.password);
};

/**
 * Generates same model of player details.
 * @returns {object} - Public information of player.
 */
Player.prototype.safeModel = function safeModel() {
  return _.omit(this.toJSON(), ["password"]);
};

/**
 * @typedef Players
 */
module.exports = Player;
