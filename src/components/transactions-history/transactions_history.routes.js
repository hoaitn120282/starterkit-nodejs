const express = require('express');
const { Joi } = require('express-validation');
const modelCtrl = require('./transactions_history.controller');
const { validate } = require('../../helpers');

const router = express.Router();

const paramValidation = {
  transactionParam: {
    body: Joi.object({
      walletID: Joi.string().required(),
    }),
  },
};

/**
 * @api {get} /transactions-history/ Transactions History Listing
 * @apiVersion 1.0.0
 * @apiName Get the list of transactions history via wallet ID
 * @apiGroup Transactions History
 *
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
router.route('/')
  .get(validate(paramValidation.transactionParam), modelCtrl.list);

module.exports = router;
