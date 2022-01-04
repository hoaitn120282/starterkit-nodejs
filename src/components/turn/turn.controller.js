const { isEmpty } = require('lodash');
const Turn = require('./turn.model');

/**
 * Load Turn and append to req.
 */
function load(req, res, next, walletID) {
  return Turn.getBywalletID(walletID)
    .then((model) => {
      if (isEmpty(model)) {
        const obj = new Turn();
        obj.walletID = walletID;
        obj.turnNumber = 0;
        obj.turnLimit = 5;
        obj.save();
        req.model = obj;
      } else {
        return next();
      }
      return res.json(req.model);
    })
    .catch((e) => next(e));
}

/**
 * Get Turn
 * @returns {Turn}
 */
function get(req, res, next) {
  const wallet = req.params.walletID;
  return Turn.getBywalletID(wallet)
    .then((model) => {
      if (isEmpty(model)) {
        const obj = new Turn();
        obj.walletID = wallet;
        obj.turnNumber = 0;
        obj.turnLimit = 5;
        obj.save();
        res.json(obj);
      }
      res.json(model);
    })
    .catch((e) => next(e));
}

/**
 * Get Turn profile of logged in Model
 * @returns {Promise<Turn>}
 */
function getObject(req, res, next) {
  return Turn.get(res.locals.session.id)
    .then((model) => res.json(model.safeModel()))
    .catch((e) => next(e));
}
/**
 * Create Turn
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function create(req, res, next) {
  const model = new Turn(req.body);
  return model.save()
    .then((savedmodel) => res.json(savedmodel.safeModel()))
    .catch((e) => next(e));
}

/**
 * Update existing Turn
 * @property {string} req.body.walletID .
 * @property {integer} req.body.turnNumber .
 * @property {integer} req.body.turnLimit .
 * @returns {Turn}
 */
function update(req, res, next) {
  const wallet = req.body.walletID;
  Turn.findAll({
    where: {
      createdAt: {
        $gte: new Date(new Date() - 24 * 60 * 60 * 1000),
        $lte: new Date(),
      },
      walletID: wallet,
    },
  }).then((turn) => {
    if (!isEmpty(turn)) {
      const model = turn[0];
      model.turnNumber = req.body.turnNumber;
      model.save();
      res.json(model.safeModel());
    } else {
      res.json({ err: 'record is not exist!' });
    }
  }).catch((e) => next(e));
}

/**
 * Get Turn list.
 * @property {number} req.query.skip
 * @property {number} req.query.limit
 * @returns {Promise<Turn[]>}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  return Turn.list({ limit, skip })
    .then((models) => res.json(models))
    .catch((e) => next(e));
}

/**
 * Delete Turn.
 * @returns {Turn}
 */
function destroy(req, res, next) {
  const { Turn } = req;
  Turn.destroy()
    .then((deletedModel) => res.json(deletedModel.safeModel()))
    .catch((e) => next(e));
}

module.exports = {
  load,
  get,
  getObject,
  update,
  list,
  destroy,
  create,
};
