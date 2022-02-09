const Sequelize = require('sequelize');
const httpStatus = require('http-status');
const _ = require('lodash');
const db = require('../../config/db');
const APIError = require('../../helpers/APIError');

/**
 * Withdraw Schema
 */
const WithdrawSchema = {
  id: {
    type: Sequelize.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  walletID: {
    allowNull: false,
    type: Sequelize.STRING,
  },
  tokenBalance: {
    allowNull: false,
    type: Sequelize.FLOAT,
  },
  tokenType: {
    allowNull: false,
    type: Sequelize.STRING,
  },
  status: {
    allowNull: false,
    type: Sequelize.STRING,
    defaultValue: 'Fail',
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

const Withdraw = db.sequelize.define('withdraw-histories', WithdrawSchema);

/**
 * Statics
 */

/**
 * Get Reward
 * @param {number} id - The id of Reward.
 * @returns {Promise<Claim, APIError>}
 */
Withdraw.get = function get(id) {
  return this.findByPk(id)
    .then((withdraw) => {
      if (withdraw) {
        return withdraw;
      }
      const err = new APIError('No such Record exists!', httpStatus.NOT_FOUND, true);
      return Promise.reject(err);
    });
};

/**
 * List withdraw in order of 'id'.
 * @param {number} skip - Number of withdraw to be skipped.
 * @param {number} limit - Limit number of withdraw to be returned.
 * @returns {Promise<Reward[]>}
 */
Withdraw.list = function list({ skip = 0, limit = 50 } = {}) {
  return this.findAll({
    limit,
    offset: skip,
    $sort: { id: 1 },
  });
};

Withdraw.getBywalletID = function getBywalletID(wallet, { skip = 0, limit = 50 } = {}) {
  return this.findAll({
    where: {
      walletID: wallet,
    },
    limit,
    offset: skip,
    order: [['createdAt', 'DESC']],
  });
};

/**
 * Generates same model of withdraw details.
 * @returns {object} - Public information of withdraw.
 */
Withdraw.prototype.safeModel = function safeModel() {
  return _.omit(this.toJSON(), ['password']);
};

/**
 * @typedef Withdraws
 */
module.exports = Withdraw;
