const express = require("express");
const { Joi } = require("express-validation");
const modelCtrl = require("./turn.controller");
const { validate } = require("../../helpers");

const router = express.Router();

const paramValidation = {
  updateModel: {
    body: Joi.object({
      playerID: Joi.number().required(),
      turnNumber: Joi.number(),
      playType: Joi.string().required(),
    }),
    params: Joi.object({
      walletID: Joi.string().required(),
    }),
  },
  createModel: {
    body: Joi.object({
      walletID: Joi.string().required(),
      playerID: Joi.number().required(),
      playType: Joi.string().required(),
    }),
  },
};

/**
 * @api {get} /turns/ Turns Listing
 * @apiVersion 1.0.0
 * @apiName Get the list of Turns
 * @apiGroup Turns
 *
 * @apiSuccess {Object} Model[{}] List items of the History.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *      {
 *       "id": "2",
 *       "walletID": "JY58ZjzBWh9785349Yo54FP789453697852147",
 *       "turnNumber": 2,
 *       "turnLimit": 14,
 *       "createdAt": "2022-01-04T19:17:17.089Z",
 *       "createdAt": "2022-01-04T19:17:17.089Z",
 *       }
 *     ]
 *
 * @apiError Turns Data is not exist.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Data is not exist"
 *     }
 */

/**
 * @api {post} /turns/ Turns Creation
 * @apiVersion 1.0.0
 * @apiName Get turn by wallteId and playerId
 * @apiGroup Turns
 *
 * @apiParam {String} walletID Mandatory unique Param.
 * @apiParam {Integer} playerID Mandatory unique Param.
 * @apiParam {String} playType PVP or PVE
 *
 * @apiSuccess {Object} Model[{}] Item of the turn created.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *      {
 *       "id": "2",
 *       "walletID": "JY58ZjzBWh9785349Yo54FP789453697852147",
 *       "turnNumber": 2,
 *       "turnLimit": 14,
 *       "createdAt": "2022-01-04T19:17:17.089Z",
 *       "createdAt": "2022-01-04T19:17:17.089Z",
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
  .get(modelCtrl.list)

  .post(validate(paramValidation.createModel), modelCtrl.create);

/**
 * @api {get} /turns/:walletID/:playerID/:playType Get detail turn
 * @apiVersion 1.0.0
 * @apiName Create turn by wallteId and playerId
 * @apiGroup Turns
 *
 * @apiParam {String} walletID Mandatory unique Param.
 * @apiParam {Integer} playerID Mandatory unique Param.
 * @apiParam {String} playType PVP or PVE
 *
 * @apiSuccess {Object} Model[{}] Item of the turn created.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *       "id": "2",
 *       "walletID": "JY58ZjzBWh9785349Yo54FP789453697852147",
 *       "turnNumber": 2,
 *       "turnLimit": 14,
 *       "createdAt": "2022-01-04T19:17:17.089Z",
 *       "createdAt": "2022-01-04T19:17:17.089Z",
 *       }
 *
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": error exception string
 *     }
 */

router
  .route("/:walletID/:playerID/:playType")
  .get(modelCtrl.get)

  .delete(modelCtrl.destroy);

/**
 * @api {put} /turns/:walletID Turns Update
 * @apiVersion 1.0.0
 * @apiName Update turn by wallteId and playerId
 * @apiGroup Turns
 *
 * @apiParam {Integer} playerID Mandatory unique Param.
 * @apiParam {String} turnNumber Turn number.
 * @apiParam {String} playType PVP or PVE.
 * 
 * @apiSuccess {Object} Model[{}] Item of the turn created.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *       "id": "2",
 *       "walletID": "JY58ZjzBWh9785349Yo54FP789453697852147",
 *       "turnNumber": 2,
 *       "turnLimit": 14,
 *       "createdAt": "2022-01-04T19:17:17.089Z",
 *       "createdAt": "2022-01-04T19:17:17.089Z",
 *       }
 *
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": error exception string
 *     }
 */

router
  .route("/:walletID")
  .put(validate(paramValidation.updateModel), modelCtrl.update);

router.param("id", modelCtrl.load);

module.exports = router;
