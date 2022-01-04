const { isEmpty } = require('lodash');
const Claim = require('./claim.model');
const Reward = require('../reward/reward.model');
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
 * Get Model profile of logged in Model
 * @returns {Promise<Claim>}
 */
function getProfile(req, res, next) {
  return Claim.get(res.locals.session.id)
    .then((model) => res.json(model.safeModel()))
    .catch((e) => next(e));
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
      Reward.findAll({
        where: {
          walletID: savedmodel.walletID,
          rewardType: savedmodel.claimRewardType,
        },
      })
        .then((reward) => {
          if (!isEmpty(reward)) {
            const rewardModel = reward[0];
            rewardModel.rewardWithdrawn = rewardModel.rewardWithdrawn + model.claimRewardAmount;
            rewardModel.rewardAvailable = rewardModel.rewardAvailable - model.claimRewardAmount;
            rewardModel.save();
          } else {
            const rewardModel = new Reward();
            rewardModel.walletID = model.walletID;
            rewardModel.rewardAmount = model.claimRewardAmount;
            rewardModel.rewardAvailable = 0;
            rewardModel.rewardWithdrawn = model.claimRewardAmount;
            rewardModel.rewardType = model.claimRewardType;
            rewardModel.save();
          }
        });
      res.json(savedmodel.safeModel());
    })
    .catch((e) => next(e));
}

/**
 * Update existing Claim
 * @property {string} req.body.walletID .
 * @property {float} req.body.claimRewardAmount .
 * @property {string} req.body.transactionID .
 * @property {string} req.body.claimRewardType .
 * @property {string} req.body.claimStatus .
 * @returns {Claim}
 */
function update(req, res, next) {
  const { model } = req;
  model.walletID = req.body.walletID;
  model.claimRewardAmount = req.body.claimRewardAmount;
  model.transactionID = req.body.transactionID;
  model.claimRewardType = req.body.claimRewardType;
  model.claimStatus = req.body.claimStatus;

  return model.save()
    .then((savedModel) => {
      res.json(savedModel.safeModel());
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
  getProfile,
  update,
  list,
  destroy,
  create,
  findClaim,
};
