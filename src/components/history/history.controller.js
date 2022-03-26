const { sequelize } = require("../../config/db");
const { isEmpty, parseInt } = require("lodash");
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
      console.log("savedmodel", savedmodel);
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
  const { limit = 2, skip = 0 } = req.query;
  const { walletID } = req.params;

  const count = await History.count({
    where: {
      walletID,
    },
    attributes: [
      [sequelize.fn("DATE", sequelize.col("createdAt")), "Date"],
      [sequelize.fn("count", "*"), "count"],
    ],
    group: [sequelize.fn("DATE", sequelize.col("createdAt")), "Date"],
    raw: true,
  });

  const DaysArr = await History.findAll({
    where: {
      walletID,
    },
    attributes: [
      [sequelize.fn("DATE", sequelize.col("createdAt")), "Date"],
      [sequelize.fn("count", "*"), "count"],
    ],
    group: [sequelize.fn("DATE", sequelize.col("createdAt")), "Date"],
    order: [[sequelize.col("Date"), "DESC"]],
    limit,
    offset: skip,
    raw: true,
  });

  const dataDays = await Promise.all(
    DaysArr.map(async (d) => {
      const listByDay = await History.getBywalletID({
        where: {
          walletID,
        },
        where: sequelize.where(
          sequelize.fn("date", sequelize.col("createdAt")),
          "=",
          d.Date
        ),
        raw: true,
      });
      return listByDay;
    })
  );

  const ListHistory = dataDays.map((ele) => {
    let lastTime = "";
    let totalExp = 0;
    let totalReward = 0;
    if (ele.length > 0) {
      lastTime = dayjs(ele[0].createdAt).format("YYYY-MM-DD");
      totalExp = ele.reduce((a, b) => a + b.expNumber, 0);
      totalReward = ele.reduce((a, b) => a + b.rewardNumber, 0);
    }
    return {
      date: lastTime,
      totalExp,
      totalReward,
      data: ele,
    };
  });

  return res.json({
    total: count.length,
    data: ListHistory,
  });
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
async function listTopReward(req, res, next) {
  const {
    limit = 50,
    skip = 0,
    start = new Date(),
    end = new Date(),
    activityName,
  } = req.query;

  const countData = await History.count({
    distinct: true,
    skip,
    limit,
    where: {
      createdAt: {
        $between: [
          dayjs(start).format("YYYY-MM-DD"),
          dayjs(end).add(1, "day").format("YYYY-MM-DD"),
        ],
      },
      activityName,
    },
    group: ["playerID", "player.id"],
    attributes: [
      "playerID",
      [sequelize.fn("SUM", sequelize.col("rewardNumber")), "total_amount"],
    ],
    raw: true,
    include: [
      {
        model: Player,
        // attributes: [],
      },
    ],
  });

  const countData1 = await History.findAll({
    where: {
      createdAt: {
        $between: [
          dayjs(start).format("YYYY-MM-DD"),
          dayjs(end).add(1, "day").format("YYYY-MM-DD"),
        ],
      },
      activityName,
    },
    group: ["playerID", "player.id"],
    attributes: [
      "playerID",
      [sequelize.fn("SUM", sequelize.col("rewardNumber")), "total_amount"],
    ],
    raw: true,
    include: [
      {
        model: Player,
        attributes: [],
      },
    ],
  });

  return res.json({
    countData1
  })


  if (activityName) {
    return History.listHistoryTop({
      skip,
      limit,
      where: {
        createdAt: {
          $between: [
            dayjs(start).format("YYYY-MM-DD"),
            dayjs(end).add(1, "day").format("YYYY-MM-DD"),
          ],
        },
        activityName,
        rewardType: "SCORE",
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
  } else {
    return History.listHistoryTop({
      skip,
      limit,
      where: {
        createdAt: {
          $between: [
            dayjs(start).format("YYYY-MM-DD"),
            dayjs(end).add(1, "day").format("YYYY-MM-DD"),
          ],
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
        },
      ],
    })
      .then((historys) => res.json(historys))
      .catch((e) => next(e));
  }
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
