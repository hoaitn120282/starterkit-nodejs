const Sequelize = require('sequelize');
const httpStatus = require('http-status');
const _ = require('lodash');
const db = require('../../config/db');
const APIError = require('../../helpers/APIError');

/**
 * Deposit Schema
 */
const DepositSchema = {
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

const Deposit = db.sequelize.define('deposits', DepositSchema);

/**
 * Statics
 */

/**
 * Get Reward
 * @param {number} id - The id of Reward.
 * @returns {Promise<Claim, APIError>}
 */
Deposit.get = function get(id) {
  return this.findByPk(id)
    .then((deposit) => {
      if (deposit) {
        return deposit;
      }
      const err = new APIError('No such Record exists!', httpStatus.NOT_FOUND, true);
      return Promise.reject(err);
    });
};

/**
 * List Deposit in order of 'id'.
 * @param {number} skip - Number of Deposit to be skipped.
 * @param {number} limit - Limit number of Deposit to be returned.
 * @returns {Promise<Reward[]>}
 */
Deposit.list = function list({ skip = 0, limit = 50 } = {}) {
  return this.findAll({
    limit,
    offset: skip,
    $sort: { id: 1 },
  });
};

Deposit.getBywalletID = function getBywalletID(wallet, { skip = 0, limit = 50 } = {}) {
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
 * Generates same model of Deposit details.
 * @returns {object} - Public information of Deposit.
 */
Deposit.prototype.safeModel = function safeModel() {
  return _.omit(this.toJSON(), ['password']);
};

/**
 * @typedef Deposits
 */
module.exports = Deposit;
