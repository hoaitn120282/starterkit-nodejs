const express = require("express");
const { Joi } = require("express-validation");
const playerCtrl = require("./player.controller");
const { validate } = require("../../helpers");

const paramValidation = {
  createModel: {
    body: Joi.object({
      walletID: Joi.string().required(),
      starNumber: Joi.number().required(),
      skinName: Joi.string().required(),
      tokenID: Joi.string().required(),
    }),
  },
  createRandom: {
    body: Joi.object({
      walletID: Joi.string().required(),
    }),
  },
  bootMana: {
    body: Joi.object({
      walletID: Joi.string().required(),
      // mana: Joi.number().required(),
    }),
  },
  bootHp: {
    body: Joi.object({
      walletID: Joi.string().required(),
      hp: Joi.number().required(),
    }),
  },
};
const router = express.Router();
/**
 * @api {get} /players/randomPlayer Get random player
 * @apiVersion 1.0.0
 * @apiName Create random player
 * @apiGroup Players
 *
 * @apiParam {String} walletID Mandatory unique Param in body.
 *
 * @apiSuccess {Object} Player[{}] Players item.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *      {
 *       "starNumber": 5,
 *       "skinName": "Bananas",
 *      }
 *     ]
 *
 * @apiError AmountNotEnough.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Your amount not enough to use! please deposit more."
 *     }
 */
router
  .route("/randomPlayer")
  .get(validate(paramValidation.createRandom), playerCtrl.randomPlayer);

/**
 * @api {post} /players Player Creation
 * @apiVersion 1.0.0
 * @apiName Create player item with wallet ID
 * @apiGroup Players
 *
 * @apiParam {String} walletId Mandatory unique Param.
 * @apiParam {Integer} starNumber Mandatory unique Param.
 * @apiParam {String} skinName Mandatory unique Param.
 * @apiParam {String} tokenID Mandatory unique Param.
 *
 * @apiSuccess {Object} Model[{}] Item of the player created.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *      {
 *       "id": "2",
 *       "walletID": "JY58ZjzBWh9785349Yo54FP789453697852147",
 *       "starNumbers": 190,
 *       "skinName": 3,
 *       ...
 *       "createdAt": "2022-01-04T19:17:17.089Z",
 *       "updatedAt": "2022-01-04T19:17:17.089Z"
 *       }
 *     ]
 *
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": error exception string
 *     }
 */
router
  .route("/")
  .post(validate(paramValidation.createModel), playerCtrl.createPlayer);

/**
 * @api {get} /players/top-exp Top exp Listing
 * @apiVersion 1.0.0
 * @apiName Top exp Listing
 * @apiGroup Players
 *
 * @apiParam {Integer} litmit Items in a page.
 * @apiParam {Integer} skip Items will left in the list.
 * @apiParam {Datetime} start Start time.
 * @apiParam {Datetime} end End time.
 * @apiSuccess {Object} Model[{}] Item of the player created.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *      {
 *       "id": "2",
 *       "walletID": "JY58ZjzBWh9785349Yo54FP789453697852147",
 *       "starNumbers": 190,
 *       "skinName": 3,
 *       ...
 *       "createdAt": "2022-01-04T19:17:17.089Z",
 *       "updatedAt": "2022-01-04T19:17:17.089Z"
 *       }
 *     ]
 *
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": error exception string
 *     }
 */
router.route("/top-exp").get(playerCtrl.listTopExp);

// router.route("/:playerId").get(playerCtrl.getProfile);

/**
 * @api {get} /players/detailPlayer/:playerId Player Detail by Id
 * @apiVersion 1.0.0
 * @apiName Get player detail by Id
 * @apiGroup Players
 *
 * @apiParam {String} playerId Mandatory unique Param.
 *
 * @apiSuccess {Object} Model[{}] Profile of the Player.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *      {
 *       "id": "2",
 *       "walletID": "JY58ZjzBWh9785349Yo54FP789453697852147",
 *       "starNumbers": 190,
 *       "skinName": 3,
 *       ...
 *       "createdAt": "2022-01-04T19:17:17.089Z",
 *       "updatedAt": "2022-01-04T19:17:17.089Z"
 *       }
 *     ]
 * @apiError PlayerNotFound Data is not exist.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Data is not exist"
 *     }
 */
router.route("/detailPlayer/:playerId").get(playerCtrl.getDetailPlayer);

/**
 * @api {post} /players/:playerId/bootMana Boot Mana
 * @apiVersion 1.0.0
 * @apiName Boot mana with playerId
 * @apiGroup Players
 *
 * @apiParam {String} walletId Mandatory unique Param.
 *
 * @apiSuccess {Object} Model[{}] Item of the player created.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *      {
 *       "id": "2",
 *       "walletID": "JY58ZjzBWh9785349Yo54FP789453697852147",
 *       "starNumbers": 190,
 *       "skinName": 3,
 *       ...
 *       "createdAt": "2022-01-04T19:17:17.089Z",
 *       "updatedAt": "2022-01-04T19:17:17.089Z"
 *       }
 *     ]
 *
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": error exception string
 *     }
 */
router
  .route("/:playerId/bootMana")
  .post(validate(paramValidation.bootMana), playerCtrl.bootMana);

/**
 * @api {post} /players/bootHp Boot Hp
 * @apiVersion 1.0.0
 * @apiName Boot Hp with playerId
 * @apiGroup Players
 *
 * @apiParam {String} walletId Mandatory unique Param.
 *
 * @apiSuccess {Object} Model[{}] Item of the player created.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *      {
 *       "id": "2",
 *       "walletID": "JY58ZjzBWh9785349Yo54FP789453697852147",
 *       "starNumbers": 190,
 *       "skinName": 3,
 *       ...
 *       "createdAt": "2022-01-04T19:17:17.089Z",
 *       "updatedAt": "2022-01-04T19:17:17.089Z"
 *       }
 *     ]
 *
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": error exception string
 *     }
 */
router
  .route("/:playerId/bootHp")
  .post(validate(paramValidation.bootHp), playerCtrl.bootHp);

/**
 * @api {get} /players/get-player-by-tokenID/:walletID:/:tokenID Players detail by tokenID
 * @apiVersion 1.0.0
 * @apiName Get player by tokenID
 * @apiGroup Players
 *
 * @apiParam {String} walletID Mandatory unique Param.
 * @apiParam {tokenID} tokenID TokenID.
 *
 * @apiSuccess {Object} Model[{}] List items of the Players.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *      {
 *       "id": "2",
 *       "walletID": "JY58ZjzBWh9785349Yo54FP789453697852147",
 *       "starNumber": 5,
 *       "skinName": "Bananas",
 *       ...
 *       "createdAt": "2022-01-04T19:17:17.089Z",
 *       "updatedAt": "2022-01-04T19:17:17.089Z"
 *       }
 *     ]
 *
 * @apiError PlayerNotFound Data is not exist.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Data is not exist"
 *     }
 */
 router.route("/get-player-by-tokenID/:walletID/:tokenID").get(playerCtrl.getPlayerByTokenID);

  /**
 * @api {get} /players/:walletID Players Listing
 * @apiVersion 1.0.0
 * @apiName Get the list of players via wallet ID
 * @apiGroup Players
 *
 * @apiParam {String} walletID Mandatory unique Param.
 * @apiParam {Integer} litmit Items in a page.
 * @apiParam {Integer} skip Items will left in the list.
 *
 * @apiSuccess {Object} Model[{}] List items of the Players.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *      {
 *       "id": "2",
 *       "walletID": "JY58ZjzBWh9785349Yo54FP789453697852147",
 *       "starNumber": 5,
 *       "skinName": "Bananas",
 *       ...
 *       "createdAt": "2022-01-04T19:17:17.089Z",
 *       "updatedAt": "2022-01-04T19:17:17.089Z"
 *       }
 *     ]
 *
 * @apiError PlayerNotFound Data is not exist.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Data is not exist"
 *     }
 */
router.route("/:walletID").get(playerCtrl.list);

/** Load player when API with walletID route parameter is hit */
router.param("walletID", playerCtrl.load);

module.exports = router;
