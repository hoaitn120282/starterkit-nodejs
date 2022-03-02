const { isEmpty } = require("lodash");
const Turn = require("./turn.model");
const Player = require("../player/player.model");

/**
 * Check turn by starNumber
 *
 */
const checkTurn = (starNumber) => {
  switch (starNumber) {
    case 1:
      return 4;
    case 2:
      return 5;
    case 3:
      return 7;
    case 4:
      return 10;
    case 5:
      return 14;
    default:
      return 5;
  }
};

/**
 * Load Turn and append to req.
 */
function load(req, res, next, walletID, playerID) {
  return Turn.getBywalletID(walletID, playerID)
    .then(async (model) => {
      if (isEmpty(model)) {
        const player = await Player.getById(playerID);
        const obj = new Turn();
        obj.walletID = walletID;
        obj.turnNumber = 0;
        obj.turnLimit = checkTurn(player?.starNumber);

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
  const { playerID } = req.params;
  return Turn.getBywalletID(wallet, playerID)
    .then(async (model) => {
      if (isEmpty(model)) {
        const player = await Player.getById(playerID);
        const obj = new Turn();
        obj.walletID = wallet;
        obj.turnNumber = 0;
        obj.playerID = playerID;
        obj.turnLimit = checkTurn(player?.starNumber);
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
async function create(req, res, next) {
  const model = new Turn(req.body);
  const { 
    playerID
  } = req.body;

  const player = await Player.getById(playerID);
  model.turnLimit = checkTurn(player?.starNumber);
  model.turnNumber = 0;
  return model
    .save()
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
  const wallet = req.params.walletID;
  const { playerID } = req.body;
  Turn.findOne({
    where: {
      createdAt: {
        $gte: new Date(new Date() - 24 * 60 * 60 * 1000),
        $lte: new Date(),
      },
      walletID: wallet,
      playerID,
    },
  })
    .then((turn) => {
      if (!isEmpty(turn)) {
        const model = turn;
        model.turnNumber = req.body.turnNumber;
        model.save();
        res.json(model.safeModel());
      } else {
        res.json({ err: "record is not exist!" });
      }
    })
    .catch((e) => next(e));
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
