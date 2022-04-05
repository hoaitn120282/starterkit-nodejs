const express = require('express');
const { Joi } = require('express-validation');
const modelCtrl = require('./claim.controller');
const { validate } = require('../../helpers');

const router = express.Router();

const paramValidation = {
  updateModel: {
    body: Joi.object({
      walletID: Joi.string().required(),
      claimRewardAmount: Joi.number(),
      claimRewardType: Joi.string(),
      claimStatus: Joi.string(),
      transactionID: Joi.string(),
    }),
    params: Joi.object({
      id: Joi.string().hex().required(),
    }),
  },
  createModel: {
    body: Joi.object({
      walletID: Joi.string().required(),
      claimRewardAmount: Joi.number(),
      claimRewardType: Joi.string(),
      claimStatus: Joi.string(),
      transactionID: Joi.string(),
    }),
  },
};

router.route('/')
  .get(modelCtrl.list);

/**
 * @api {post} /claims Claims Creation
 * @apiVersion 1.0.0
 * @apiName Create claim item with wallet ID
 * @apiGroup Claim
 *
 * @apiBody {String} walletID Mandatory unique Param.
 * @apiBody {Integer} claimRewardAmount Mandatory The amount in claim request.
 * @apiBody {String} claimRewardType Mandatory The type of token: PVP or PVE.
 * @apiBody {String} claimStatus Status of request, It should be "Confirmed".
 *
 * @apiSuccess {Object} Model[{}] Item of the claim created.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *        "id": "1",
 *        "walletID": "JY58ZjzBWh9785349Yo54FP789453697852147",
 *        "claimRewardAmount": 15,
 *        "claimRewardType": "TOC",
 *        "claimStatus": "Confirmed",
 *        "createdAt": "2022-01-04T19:21:21.264Z",
 *        "updatedAt": "2022-01-04T19:23:08.326Z"
 *       },
 *     ]
 *
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": error exception string
 *     }
 */
router.route('/')
  .post(validate(paramValidation.createModel), modelCtrl.create);

/**
 * @api {get} /claims/:walletID Claims List
 * @apiVersion 1.0.0
 * @apiName Get the list of claims via wallet ID
 * @apiGroup Claim
 *
 * @apiParam {String} walletID Mandatory unique Param.
 * @apiQuery {Integer} litmit Items in a page.
 * @apiQuery {Integer} skip Items will left in the list.
 *
 * @apiSuccess {Object} Model[{}] List items of the Claims.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *        "id": "1",
 *        "walletID": "JY58ZjzBWh9785349Yo54FP789453697852147",
 *        "claimRewardAmount": 15,
 *        "transactionID": "D9B7323243958",
 *        "claimRewardType": "TOC",
 *        "claimStatus": "Confirmed",
 *        "createdAt": "2022-01-04T19:21:21.264Z",
 *        "updatedAt": "2022-01-04T19:23:08.326Z"
 *       },
 *     ]
 *
 * @apiError ClaimNotFound Data is not exist.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Data is not exist"
 *     }
 */
router.route('/:walletID')
  .get(modelCtrl.get)

  .delete(modelCtrl.destroy);

router.param('id', modelCtrl.findClaim);
router.param('walletID', modelCtrl.load);

module.exports = router;
