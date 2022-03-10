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
 * @apiBody {String} walletID Mandatory unique Param.
 * @apiQuery {Integer} litmit Items in a page.
 * @apiQuery {Integer} skip Items will left in the list.
 * 
 * @apiSuccess {Object} Model[{}] List items of the History.
 *
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *   {
 *     "count": 10,
 *     "rows":[
 *      {
 *          "id": "1",
 *           "walletID": "222",
 *           "tokenBalance": 100,
 *           "tokenType": "TOC",
 *           "status": "success",
 *           "createdAt": "2022-03-10T10:08:27.000Z",
 *           "updatedAt": "2022-03-10T10:08:30.000Z"
 *       }
 *     ]
 *   }
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
