const { isEmpty } = require('lodash');
const Deposit = require('./deposit.model');
const Reward = require('../reward/reward.model');
const config = require('../../config');
/**
 * Load Deposit and append to req.
 */
function load(req, res, next, walletID) {
  const { limit = 50, skip = 0 } = req.query;
  return Deposit.getBywalletID(walletID, { limit, skip })
    .then((model) => {
      req.model = model;
      return res.json(req.model);
    })
    .catch((e) => next(e));
}

function findDeposit(req, res, next, id) {
  return Deposit.get(id)
    .then((model) => {
      req.model = model;
      return next();
    })
    .catch((e) => next(e));
}

/**
 * Get Deposit
 * @returns {Deposit}
 */
function get(req, res) {
  return res.json(req.model.safeModel());
}

/**
 * Create Deposit
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function create(req, res, next) {
  const model = new Deposit(req.body);
  return model.save()
    .then((savedmodel) => {
      Reward.findOne({
        where: {
          walletID: savedmodel.walletID,
          rewardType: savedmodel.tokenType,
        },
      })
        .then((reward) => {
          if (!isEmpty(reward)) {
            const rewardModel = reward;
            rewardModel.rewardAmount += savedmodel.tokenBalance;
            rewardModel.rewardType = savedmodel.tokenType;
            rewardModel.save();
            model.status = 'Success';
            model.save();
            res.json(savedmodel.safeModel());
          } else {
            const rewardModel = new Reward();
            rewardModel.rewardAmount = savedmodel.tokenBalance;
            rewardModel.rewardType = savedmodel.tokenType;
            rewardModel.walletID = savedmodel.walletID;
            rewardModel.save();
            model.status = 'Success';
            model.save();
            res.json(savedmodel.safeModel());
          }
        });
    })
    .catch((e) => next(e));
}

/**
 * Get Model list.
 * @property {number} req.query.skip
 * @property {number} req.query.limit
 * @returns {Promise<Deposit[]>}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  return Deposit.list({ limit, skip })
    .then((Deposits) => res.json(Deposits))
    .catch((e) => next(e));
}

/**
 * Delete Deposit.
 * @returns {Deposit}
 */
function destroy(req, res, next) {
  const { model } = req;
  model.destroy()
    .then((deletedModel) => res.json(deletedModel.safeModel()))
    .catch((e) => next(e));
}

module.exports = {
  load,
  get,
  list,
  destroy,
  create,
  findDeposit,
};
