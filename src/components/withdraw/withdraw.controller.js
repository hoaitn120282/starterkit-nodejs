const { isEmpty } = require('lodash');
const Withdraw = require('./withdraw.model');
const Reward = require('../reward/reward.model');
const config = require('../../config');
/**
 * Load Withdraw and append to req.
 */
function load(req, res, next, walletID) {
  const { limit = 50, skip = 0 } = req.query;
  return Withdraw.getBywalletID(walletID, { limit, skip })
    .then((model) => {
      req.model = model;
      return res.json(req.model);
    })
    .catch((e) => next(e));
}

function findWithdraw(req, res, next, id) {
  return Withdraw.get(id)
    .then((model) => {
      req.model = model;
      return next();
    })
    .catch((e) => next(e));
}

/**
 * Get Withdraw
 * @returns {Withdraw}
 */
function get(req, res) {
  return res.json(req.model.safeModel());
}

/**
 * Create Withdraw
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function create(req, res, next) {
  const model = new Withdraw(req.body);
  return model.save()
    .then((savedmodel) => {
      Reward.findOne({
        where: {
          walletID: savedmodel.walletID,
          rewardType: savedmodel.tokenType,
        },
      })
        .then((reward) => {
          const balance = (model.tokenBalance + ((config.withdrawFee / 100) * model.tokenBalance));
          if (!isEmpty(reward) && parseFloat(reward.rewardAmount) >= parseFloat(balance)) {
            reward.rewardAmount -= balance;
            reward.save();
            model.status = 'Pending';
            model.save();
            res.json(savedmodel.safeModel());
          } else {
            res.json({ message: 'Your amount have not enough to withdraw!' });
          }
        });
    })
    .catch((e) => next(e));
}

/**
 * Get Model list.
 * @property {number} req.query.skip
 * @property {number} req.query.limit
 * @returns {Promise<Withdraw[]>}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  return Withdraw.list({ limit, skip })
    .then((Withdraws) => res.json(Withdraws))
    .catch((e) => next(e));
}

/**
 * Delete Withdraw.
 * @returns {Withdraw}
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
  findWithdraw,
};
