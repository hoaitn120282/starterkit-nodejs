const Sequelize = require('sequelize');
const httpStatus = require('http-status');
const _ = require('lodash');
const db = require('../../config/db');
const APIError = require('../../helpers/APIError');

/**
 * Claims Schema
 */
const ClaimsSchema = {
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
  claimRewardAmount: {
    type: Sequelize.FLOAT,
  },
  transactionID: {
    type: Sequelize.STRING,
  },
  claimRewardType: {
    type: Sequelize.STRING,
  },
  claimStatus: {
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

const Claim = db.sequelize.define('claims', ClaimsSchema);

/**
 * Statics
 */

/**
 * Get Reward
 * @param {number} id - The id of Reward.
 * @returns {Promise<Claim, APIError>}
 */
Claim.get = function get(id) {
  return this.findByPk(id)
    .then((claim) => {
      if (claim) {
        return claim;
      }
      const err = new APIError('No such Record exists!', httpStatus.NOT_FOUND, true);
      return Promise.reject(err);
    });
};

/**
 * List Claims in order of 'id'.
 * @param {number} skip - Number of Claims to be skipped.
 * @param {number} limit - Limit number of Claims to be returned.
 * @returns {Promise<Reward[]>}
 */
Claim.list = function list({ skip = 0, limit = 50 } = {}) {
  return this.findAll({
    limit,
    offset: skip,
    $sort: { id: 1 },
  });
};

Claim.getBywalletID = function getBywalletID(wallet, { skip = 0, limit = 50 } = {}) {
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
 * Generates same model of Claims details.
 * @returns {object} - Public information of Claims.
 */
Claim.prototype.safeModel = function safeModel() {
  return _.omit(this.toJSON(), ['password']);
};

/**
 * @typedef Claims
 */
module.exports = Claim;
