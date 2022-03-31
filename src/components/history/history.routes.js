const express = require("express");
const { Joi } = require("express-validation");
const modelCtrl = require("./history.controller");
const { validate } = require("../../helpers");
// const dayjs = require("dayjs");

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
  getList: {
    // query: Joi.object({
    //   startDate: Joi.string().custom((value, helper) => {
    //     if (dayjs(value, "YYYY-MM-DD").isValid()) {
    //       return true;
    //     } else {
    //       return helper.message("StartDate is not correct format");
    //     }
    //   }),
    // }),
    params: Joi.object({
      walletID: Joi.string().required(),
    }),
  },
};

/**
 * @api {get} /play-history Histories Listing
 * @apiVersion 1.0.0
 * @apiName Get the list of histories via wallet ID
 * @apiGroup Play History
 *
 * @apiParam {String} walletID Mandatory unique Param.
 * @apiQuery {Integer} litmit Items in a page.
 * @apiQuery {Integer} skip Items will left in the list.
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
 * @apiBody {String} walletID Mandatory unique Param.
 * @apiBody {Integer} playerID Mandatory unique Param.
 * @apiBody {Integer} rewardNumber Mandatory Reward number in play session.
 * @apiBody {Integer} expNumber Mandatory Experience number in play session.
 * @apiBody {String} rewardType Mandatory The of token reward won in game: TOC, SCORE, SNCT.
 * @apiBody {String} activityName Mandatory Activity name of play: PVP or PVE.
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
 * @api {get} /play-history/top-reward-toc Top reward history
 * @apiVersion 1.0.0
 * @apiName List top reward TOC
 * @apiGroup Play History
 *
 * @apiQuery {Integer} litmit Items in a page.
 * @apiQuery {Integer} skip Items will left in the list.
 * @apiQuery {Datetime} start Start time: yyyy-mm-dd.
 * @apiQuery {Datetime} end End time: yyyy-mm-dd.
 * @apiQuery {String} activityName PVP or PVE.
 *
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 * [
 *  {
 *       "playerID": "2",
 *       "total_amount": 66,
 *       "player": {
 *           "id": "2",
 *           "walletID": "222",
 *           "starNumber": 4,
 *           "mana": 100,
 *           "hp": 100,
 *           "skinName": "fire",
 *           "totalExp": 100,
 *           "description": "test",
 *           "external_url": null,
 *           "image": null,
 *           "attributes": null,
 *           "tokenID": "1",
 *           "createdAt": "2022-03-18T02:52:33.000Z",
 *           "updatedAt": "2022-03-01T02:52:36.000Z"
 *       }
 *   }
 * ]
 *
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": error exception string
 *     }
 */

router.route("/top-reward-toc").get(modelCtrl.listTopReward);

/**
 * @api {get} /play-history/:walletID History listing by walletID
 * @apiVersion 1.0.0
 * @apiName Get the list of histories by walletID
 * @apiGroup Play History
 *
 * @apiParam {String} walletID Mandatory unique Param.
 * @apiQuery {Integer} litmit Items in a page.
 * @apiQuery {Integer} skip Items will left in the list.
 *
 * @apiSuccess {Object} Model[{}] List items of the History.
 *
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *    "total": 4,
 *    "data":[
 *         {
 *           "date": "2022-03-06",
 *           "totalExp": 4,
 *           "totalReward": 44,
 *           "data": [
 *               {
 *                   "id": "4",
 *                   "playerID": "1",
 *                   "walletID": "222",
 *                   "rewardNumber": 44,
 *                   "expNumber": 4,
 *                   "rewardType": "TOC",
 *                   "activityName": "PVP",
 *                   "createdAt": "2022-03-06T03:24:38.000Z",
 *                   "updatedAt": "2022-03-06T03:24:46.000Z",
 *                   "createDate": "2022-03-06"
 *               },
 *               ...
 *             ]
 *          },
 *        ...
 *     ]
 * }
 *
 * @apiError HistoryNotFound Data is not exist.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Data is not exist"
 *     }
 */
router
  .route("/:walletID")
  .get(validate(paramValidation.getList), modelCtrl.getbyWalltediD)

  .delete(modelCtrl.destroy);

router.param("id", modelCtrl.load);

module.exports = router;
