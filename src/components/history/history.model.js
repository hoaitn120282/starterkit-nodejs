const Sequelize = require("sequelize");
const httpStatus = require("http-status");
const _ = require("lodash");
const db = require("../../config/db");
const Player = require("../player/player.model");
const APIError = require("../../helpers/APIError");

/**
 * Histories Schema
 */
const HistoriesSchema = {
  id: {
    type: Sequelize.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  playerID: {
    type: Sequelize.BIGINT,
    allowNull: true,
  },
  walletID: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  rewardNumber: {
    type: Sequelize.FLOAT,
  },
  expNumber: {
    type: Sequelize.FLOAT,
  },
  rewardType: {
    type: Sequelize.STRING,
  },
  activityName: {
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

const History = db.sequelize.define("reward-histories", HistoriesSchema);

History.belongsTo(Player, {
  foreignKey: "playerID",
});

/**
 * Statics
 */
History.get = function get(id) {
  return this.findByPk(id).then((history) => {
    if (history) {
      return history;
    }
    const err = new APIError(
      "No such Record exists!",
      httpStatus.NOT_FOUND,
      true
    );
    return Promise.reject(err);
  });
};

/**
 * List Histories in order of 'id'.
 * @param {number} skip - Number of Histories to be skipped.
 * @param {number} limit - Limit number of Histories to be returned.
 * @returns {Promise<History[]>}
 */
History.list = function list({ skip = 0, limit = 50, group = [] } = {}) {
  return this.findAll({
    limit,
    offset: skip,
    group,
    // group: [sequelize.fn('date_trunc', 'day', sequelize.col('createdAt'))]
  });
};

/**
 * List Histories top.
 * @param {number} skip - Number of Histories to be skipped.
 * @param {number} limit - Limit number of Histories to be returned.
 * @param {number} skip - Number of Histories to be skipped.
 * @param {number} limit - Limit number of Histories to be returned.
 * @returns {Promise<Player[]>}
 */
History.listHistoryTop = function listHistoryTop({
  skip = 0,
  limit = 50,
  where,
  group,
  attributes,
  include,
} = {}) {
  return this.findAll({
    limit,
    offset: skip,
    where,
    attributes,
    group,
    include,
  });
};

History.getBywalletID = function getBywalletID(options) {
  return this.findAll(options);
};

/**
 * Generates same model of Histories details.
 * @returns {object} - Public information of Histories.
 */
History.prototype.safeModel = function safeModel() {
  return _.omit(this.toJSON(), ["password"]);
};

/**
 * @typedef Histories
 */
module.exports = History;
