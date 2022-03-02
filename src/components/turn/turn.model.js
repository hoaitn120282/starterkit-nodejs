const Sequelize = require('sequelize');
const httpStatus = require('http-status');
const _ = require('lodash');
const db = require('../../config/db');
const APIError = require('../../helpers/APIError');

/**
 * Turns Schema
 */
const TurnsSchema = {
  id: {
    type: Sequelize.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  playerID: {
    type: Sequelize.BIGINT,
    allowNull: false,
  },
  walletID: {
    type: Sequelize.STRING,
  },
  turnNumber: {
    type: Sequelize.INTEGER,
  },
  turnLimit: {
    type: Sequelize.INTEGER,
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

const Turns = db.sequelize.define('turns', TurnsSchema);

/**
 * Statics
 */

/**
 * Get Reward
 * @param {number} id - The id of Reward.
 * @returns {Promise<Reward, APIError>}
 */
Turns.get = function get(id) {
  return this.findByPk(id)
    .then((turn) => {
      if (turn) {
        return turn;
      }
      const err = new APIError('No such Record exists!', httpStatus.NOT_FOUND, true);
      return Promise.reject(err);
    });
};

/**
 * List Rewards in order of 'id'.
 * @param {number} skip - Number of Rewards to be skipped.
 * @param {number} limit - Limit number of Rewards to be returned.
 * @returns {Promise<Reward[]>}
 */
Turns.list = function list({ skip = 0, limit = 50 } = {}) {
  return this.findAll({
    limit,
    offset: skip,
    $sort: { id: 1 },
  });
};

Turns.getBywalletID = function getBywalletID(wallet, playerID) {
  return this.findOne({
    where: {
      walletID: wallet,
      playerID,
      createdAt: {
        $gte: new Date(new Date() - 24 * 60 * 60 * 1000),
        $lte: new Date(),
      },
    },
  });
};

/**
 * Generates same model of Turns details.
 * @returns {object} - Public information of Turns.
 */
Turns.prototype.safeModel = function safeModel() {
  return _.omit(this.toJSON(), ['password']);
};

module.exports = Turns;
