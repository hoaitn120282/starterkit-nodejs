const { sequelize } = require("../../config/db");
const { isEmpty } = require("lodash");
const History = require("./history.model");
const Player = require("../player/player.model");
const Models = require("../models");

const dayjs = require("dayjs");
const _ = require("lodash");

/**
 * Load History and append to req.
 */
function load(req, res, next) {
  const { id } = req.params;
  return History.findOne({
    where: {
      id,
    },
  })
    .then((player) => res.json(player))
    .catch((e) => next(e));
}

/**
 * Get History
 * @returns {History}
 */
function get(req, res) {
  const { id } = req.params;
  return History.findOne({
    where: {
      id,
    },
  })
    .then((player) => res.json(player))
    .catch((e) => next(e));
}

/**
 * Get detail History by Id
 * @returns {History}
 */
function getDetail(req, res) {
  const { id } = req.params;
  return History.findOne({
    where: {
      id,
    },
  })
    .then((player) => res.json(player))
    .catch((e) => next(e));
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
  return History.list({
    limit,
    skip,
  })
    .then((models) => res.json(models))
    .catch((e) => next(e));
}

/**
 * Get Histories list.
 * @property {number} req.query.skip
 * @property {number} req.query.limit
 * @returns {Promise<History[]>}
 */
async function getbyWalltediD(req, res, next) {
  const { startDate } = req.query;
  const { walletID } = req.params;
  const endDate = dayjs(startDate).add(2, "day").toISOString();

  const ListHistory = await History.getBywalletID({
    where: {
      walletID,
      createdAt: {
        $between: [dayjs(startDate).toISOString(), endDate],
      },
    },
  });

  ListHistory.map((e, index) => {
    const newDate = dayjs(e.createdAt).format("YYYY-MM-DD");
    // console.log(e);
    e.createdAt = newDate;
    console.log('eee',e.dataValues);

    return e;
  });

  console.log(ListHistory);

  let grouped = _.mapValues(_.groupBy(ListHistory, "createdAt"), (clist) =>
    clist.map((listDay) => _.omit(listDay, "createdAt"))
  );

  // console.log("grouped", grouped);

  return res.json({
    ListHistory,
  });
  // return History.list({
  //   limit,
  //   skip,
  //   group: [sequelize.fn("date_trunc", "day", sequelize.col("createdAt"))],
  // })
  //   .then((models) => res.json(models))
  //   .catch((e) => next(e));
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
  getDetail,
  getbyWalltediD,
};
