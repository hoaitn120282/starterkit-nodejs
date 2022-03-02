const express = require("express");
const { Joi } = require("express-validation");
const modelCtrl = require("./turn.controller");
const { validate } = require("../../helpers");

const router = express.Router();

const paramValidation = {
  updateModel: {
    body: Joi.object({
      // walletID: Joi.string().required(),
      playerID: Joi.number().required(),
      turnNumber: Joi.number(),
    }),
    params: Joi.object({
      walletID: Joi.string().required(),
    }),
  },
  createModel: {
    body: Joi.object({
      walletID: Joi.string().required(),
      playerID: Joi.number().required(),
    }),
  },
};

/**
 * @api {get} /turns/ Turns Listing
 * @apiVersion 1.0.0
 * @apiName Get the list of Turns
 * @apiGroup Turns
 *
 * * @apiSuccess {Object} Model[{}] List items of the History.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *      {
 *       "id": "2",
 *       }
 *     ]
 *
 * @apiError HistoryNotFound Data is not exist.
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
 *
 * @apiSuccess {Object} Model[{}] Item of the claim created.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *      {
 *       "id": "2",
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
 * @api {get} /turns/:walletID/:playerID/ Get detail turn
 * @apiVersion 1.0.0
 * @apiName Create turn by wallteId and playerId
 * @apiGroup Turns
 *
 * @apiParam {String} walletID Mandatory unique Param.
 * @apiParam {Integer} playerID Mandatory unique Param.
 *
 * @apiSuccess {Object} Model[{}] Item of the claim created.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *      {
 *       "id": "2",
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
  .route("/:walletID/:playerID")
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
 *
 * @apiSuccess {Object} Model[{}] Item of the claim created.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *      {
 *       "id": "2",
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
  .route("/:walletID")
  .put(validate(paramValidation.updateModel), modelCtrl.update);

router.param("id", modelCtrl.load);

module.exports = router;
