const { sequelize } = require("../../config/db");
const { isEmpty } = require("lodash");
const History = require("./history.model");
const Player = require("../player/player.model");
const Models = require("../models");

/**
 * Load History and append to req.
 */
function load(req, res, next, walletID) {
  const { limit = 50, skip = 0 } = req.query;
  return History.getBywalletID(walletID, { limit, skip })
    .then((model) => {
      req.model = model;
      return res.json(req.model);
    })
    .catch((e) => next(e));
}

/**
 * Get History
 * @returns {History}
 */
function get(req, res) {
  return res.json(req.model.safeModel());
}

/**
 * Create History
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function create(req, res, next) {
  const model = new History(req.body);
  return model
    .save()
    .then((savedmodel) => {
      Models.Player.findOne({
        where: { walletID: savedmodel.walletID, id: req.body.playerID },
      }).then((player) => {
        if (!isEmpty(player)) {
          const playerObj = player;
          playerObj.totalExp += savedmodel.expNumber;
          playerObj.save();
        } else {
          res.json({ message: "Player does not exsit!" });
        }
      });
      // Models.Reward.findOne({
      //   where: {
      //     walletID: savedmodel.walletID,
      //     rewardType: req.body.rewardType,
      //   },
      // }).then((reward) => {
      //   if (!isEmpty(reward)) {
      //     const rewardObj = reward;
      //     rewardObj.rewardAmount += req.body.rewardNumber;
      //     rewardObj.save();
      //   } else {
      //     res.json({ message: "Reward does not exsit!" });
      //   }
      // });
      res.json(savedmodel.safeModel());
    })
    .catch((e) => next(e));
}

/**
 * Get Histories list.
 * @property {number} req.query.skip
 * @property {number} req.query.limit
 * @returns {Promise<History[]>}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  return History.list({ limit, skip })
    .then((models) => res.json(models))
    .catch((e) => next(e));
}

/**
 * Delete History.
 * @returns {History}
 */
function destroy(req, res, next) {
  const { model } = req;
  model
    .destroy()
    .then((deletedModel) => res.json(deletedModel.safeModel()))
    .catch((e) => next(e));
}

/**
 * List Top history reward
 * @returns {History}
 */
function listTopReward(req, res, next) {
  const { limit = 50, skip = 0, start, end } = req.query;
  return History.listHistoryTop({
    skip,
    limit,
    where: {
      createdAt: {
        $between: [start, end],
      },
    },
    group: ["playerID", "player.id"],
    attributes: [
      "playerID",
      [sequelize.fn("sum", sequelize.col("rewardNumber")), "total_amount"],
    ],
    include: [
      {
        model: Player,
        // as: "player",
        // attributes: [["id", "playerID"], "walletID", "starNumber"],
      },
    ],
  })
    .then((historys) => res.json(historys))
    .catch((e) => next(e));
}

module.exports = {
  load,
  get,
  list,
  destroy,
  create,
  listTopReward,
};
