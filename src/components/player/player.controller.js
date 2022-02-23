const Player = require('./player.model');
const Models = require('../models');
const { getRandomInt, getRandomName } = require('../../helpers');

/**
 * Load Player and append to req.
 */
function load(req, res, next) {
  const { limit = 50, skip = 0, walletID } = req.query;
  return Player.get({ limit, skip, walletID })
    .then((player) => {
      req.player = player; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch((e) => next(e));
}

/**
 * Get Player
 * @returns {Player}
 */
function get(req, res) {
  return res.json(req.Player.safeModel());
}

/**
 * Get Player profile of logged in Player
 * @returns {Promise<Player>}
 */
function getProfile(req, res, next) {
  return Player.get(res.locals.session.id)
    .then((player) => res.json(player.safeModel()))
    .catch((e) => next(e));
}
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
function createPlayer(req, res, next) {
  const player = new Player();
  player.walletID = req.body.walletID;
  player.starNumber = req.body.starNumber;
  player.skinName = req.body.skinName;
  player.tokenID = req.body.tokenID;
  player.hp = 0;
  player.mana = 0;
  player.totalExp = 0;
  return player
    .save()
    .then((savedPlayer) => res.json(savedPlayer.safeModel()))
    .catch((e) => next(e));
}
/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
function randomPlayer(req, res) {
  let { starNumber, skinName } = {};
  return Models.Reward.findOne({
    where: {
      walletID: req.body.walletID || null,
      rewardType: 'SNCT',
    },
  })
    .then((reward) => {
      if (reward.rewardAmount >= 1000) {
        reward.rewardAmount -= 1000;
        reward.save();
        starNumber = getRandomInt(5);
        skinName = getRandomName();
      } else {
        res.json({
          message: 'Your amount not enough to use! please deposit more.',
        });
      }
      res.json({ starNumber, skinName });
    })
    .catch(() => {
      res.json({ message: 'Something went wrong!' });
    });
}
/**
 * Get Player list.
 * @property {number} req.query.skip - Number of Players to be skipped.
 * @property {number} req.query.limit - Limit number of Players to be returned.
 * @returns {Promise<Player[]>}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  return Player.list({ limit, skip })
    .then((player) => res.json(player))
    .catch((e) => next(e));
}

/**
 * Delete Player.
 * @returns {Player}
 */
function destroy(req, res, next) {
  const { player } = req;
  player
    .destroy()
    .then((deletedPlayer) => res.json(deletedPlayer.safeModel()))
    .catch((e) => next(e));
}

/**
 * Boot Mana.
 * @returns {Player}
 */
async function bootMana(req, res, next) {
  const { playerId } = req.params;
  const { mana } = req.body;
  const player = await Player.findOne({ where: { id: playerId } });

  const newMana = checkMana(player.starNumber);
  const manaAdd = newMana - player.mana;

  console.log('player',player.starNumber,player.mana, '-', manaAdd);


  // player.mana += mana;

  return player
    .save()
    .then((savedPlayer) => res.json(savedPlayer.safeModel()))
    .catch((e) => next(e));
}

/**
 * Check turn by starNumber 
 * 
 */
 const checkMana = (starNumber) => {
  switch (starNumber) {
    case 1:
      return 100;
    case 2:
      return 125;
    case 3:
      return 175;
    case 4:
      return 250;
    case 5:
      return 350;
    default:
      return 0;
  }
}

/**
 * Boot Hp.
 * @returns {Player}
 */
async function bootHp(req, res, next) {
  const { playerId } = req.params;
  const { hp } = req.body;

  const player = await Player.findOne({ where: { id: playerId } });

  player.hp += hp;

  return player
    .save()
    .then((savedPlayer) => res.json(savedPlayer.safeModel()))
    .catch((e) => next(e));
}


/**
 * Get detail player by Id.
 * @returns {Player}
 */
 async function getDetailPlayer(req, res, next) {
  const { playerId } = req.params;

  return Player.getByID(playerId)
    .then((player) => res.json(player))
    .catch((e) => next(e));
}

module.exports = {
  load,
  get,
  getProfile,
  createPlayer,
  list,
  destroy,
  randomPlayer,
  bootMana,
  bootHp,
  getDetailPlayer
};
