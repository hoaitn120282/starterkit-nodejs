const { isEmpty } = require('lodash');
const Claim = require('./claim.model');
const Reward = require('../reward/reward.model');
const config = require('../../config');
/**
 * Load Claim and append to req.
 */
function load(req, res, next, walletID) {
  const { limit = 50, skip = 0 } = req.query;
  return Claim.getBywalletID(walletID, { limit, skip })
    .then((model) => {
      req.model = model;
      return res.json(req.model);
    })
    .catch((e) => next(e));
}

function findClaim(req, res, next, id) {
  return Claim.get(id)
    .then((model) => {
      req.model = model;
      return next();
    })
    .catch((e) => next(e));
}

/**
 * Get Claim
 * @returns {Claim}
 */
function get(req, res) {
  return res.json(req.model.safeModel());
}

/**
 * Create claim
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function create(req, res, next) {
  const model = new Claim(req.body);
  return model.save()
    .then((savedmodel) => {
      Reward.findOne({
        where: {
          walletID: savedmodel.walletID,
          rewardType: savedmodel.claimRewardType,
        },
      })
        .then((reward) => {
          const balance = (model.claimRewardAmount - ((config.withdrawFee/100)*model.claimRewardAmount));
          if (!isEmpty(reward)) {
            const rewardModel = reward;
            rewardModel.rewardAmount += balance;
            rewardModel.claimStatus = 'Success';
            rewardModel.save();
          } else {
            const rewardModel = new Reward();
            rewardModel.walletID = model.walletID;
            rewardModel.rewardAmount = balance;
            rewardModel.rewardType = model.claimRewardType;
            rewardModel.claimStatus = 'Success';
            rewardModel.save();
          }
        });
      res.json(savedmodel.safeModel());
    })
    .catch((e) => next(e));
}

/**
 * Get Model list.
 * @property {number} req.query.skip
 * @property {number} req.query.limit
 * @returns {Promise<Claim[]>}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  return Claim.list({ limit, skip })
    .then((claims) => res.json(claims))
    .catch((e) => next(e));
}

/**
 * Delete Claim.
 * @returns {Claim}
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
  findClaim,
};
