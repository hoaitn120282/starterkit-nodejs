const { isEmpty } = require('lodash');
const History = require('./hisroty.model');
const Models = require('../models');

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

  return model.save()
    .then((savedmodel) => {
      Models.Player.findOne({
        where: { walletID: savedmodel.walletID },
      }).then((player) => {
        if (!isEmpty(player)) {
          const playerObj = player;
          playerObj.totalExp += savedmodel.expNumber;
          playerObj.save();
        } else {
          res.json({ message: 'Player does not exsit!' });
        }
      });
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
};
