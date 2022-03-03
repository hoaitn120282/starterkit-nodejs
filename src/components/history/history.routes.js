const express = require("express");
const { Joi } = require("express-validation");
const modelCtrl = require("./history.controller");
const { validate } = require("../../helpers");

const router = express.Router();

const paramValidation = {
  updateModel: {
    body: Joi.object({
      walletID: Joi.string().required(),
      rewardNumber: Joi.number(),
      expNumber: Joi.number(),
      rewardType: Joi.string(),
      activityName: Joi.string(),
    }),
    params: Joi.object({
      id: Joi.string().hex().required(),
    }),
  },
  createModel: {
    body: Joi.object({
      walletID: Joi.string().required(),
      playerID: Joi.number().required(),
      rewardNumber: Joi.number(),
      expNumber: Joi.number(),
      rewardType: Joi.string(),
      activityName: Joi.string().required(),
    }),
  },
};

/**
 * @api {get} /play-history/:walletID Histories Listing
 * @apiVersion 1.0.0
 * @apiName Get the list of histories via wallet ID
 * @apiGroup Play History
 *
 * @apiParam {String} walletID Mandatory unique Param.
 * @apiParam {Integer} litmit Items in a page.
 * @apiParam {Integer} skip Items will left in the list.
 *
 * @apiSuccess {Object} Model[{}] List items of the History.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *      {
 *       "id": "2",
 *       "walletID": "JY58ZjzBWh9785349Yo54FP789453697852147",
 *       "rewardNumber": 190,
 *       "expNumber": 3,
 *       "rewardType": "TOC",
 *       "activityName": "Training",
 *       "createdAt": "2022-01-04T19:17:17.089Z",
 *       "updatedAt": "2022-01-04T19:17:17.089Z"
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
router.route("/").get(modelCtrl.list);

/**
 * @api {post} /play-history History Creation
 * @apiVersion 1.0.0
 * @apiName Create history item with wallet ID
 * @apiGroup Play History
 *
 * @apiParam {String} walletID Mandatory unique Param.
 * @apiParam {Integer} playerID Mandatory unique Param.
 * @apiParam {Integer} rewardNumber Mandatory Reward number in play session.
 * @apiParam {Integer} expNumber Mandatory Experience number in play session.
 * @apiParam {String} rewardType Mandatory The of token reward won in game.
 * @apiParam {activityName} Mandatory Activity name of play: PVP or PVE.
 *
 * @apiSuccess {Object} Model[{}] Item of the claim created.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *      {
 *       "id": "2",
 *       "walletID": "JY58ZjzBWh9785349Yo54FP789453697852147",
 *       "rewardNumber": 190,
 *       "expNumber": 3,
 *       "rewardType": "TOC",
 *       "activityName": "Training",
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
router.route("/").post(validate(paramValidation.createModel), modelCtrl.create);

/**
 * @api {post} /play-history/top-reward-toc Top reward TOC
 * @apiVersion 1.0.0
 * @apiName List top reward TOC
 * @apiGroup Play History
 *
 * @apiParam {Integer} litmit Items in a page.
 * @apiParam {Integer} skip Items will left in the list.
 * @apiParam {Datetime} start Start time.
 * @apiParam {Datetime} end End time.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *      {
 *       "id": "1",
 *     ]
 *
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": error exception string
 *     }
 */
router.route("/top-reward-toc").get(modelCtrl.listTopReward);

router
  .route("/:id")
  .get(modelCtrl.get)

  .delete(modelCtrl.destroy);

router.param("id", modelCtrl.load);

module.exports = router;
