const express = require('express');
const { Joi } = require('express-validation');
const modelCtrl = require('./deposit.controller');
const { validate } = require('../../helpers');

const router = express.Router();

const paramValidation = {
  createModel: {
    body: Joi.object({
      walletID: Joi.string().required(),
      tokenBalance: Joi.number(),
      tokenType: Joi.string(),
    }),
  },
};

router.route('/')
  .get(modelCtrl.list);

/**
 * @api {post} /Deposit Deposit Creation
 * @apiVersion 1.0.0
 * @apiName Create Deposit item with wallet ID
 * @apiGroup Deposit
 *
 * @apiBody {String} walletID Mandatory unique Param.
 * @apiBody {Float} tokenBalance Mandatory The amount in Deposit request.
 * @apiBody {String} tokenType Mandatory The type of token in request.
 *
 * @apiSuccess {Object} Model[{}] Item of the Deposit created.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *        "id": "1",
 *        "walletID": "JY58ZjzBWh9785349Yo54FP789453697852147",
 *        "tokenBalance": 150,
 *        "tokenType": "SNCT",
 *        "status":"Success"
 *        "createdAt": "2022-01-04T19:21:21.264Z",
 *        "updatedAt": "2022-01-04T19:23:08.326Z"
 *       },
 *     ]
 *
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": Your amount have not enough to Deposit!
 *     }
 */
router.route('/')
  .post(validate(paramValidation.createModel), modelCtrl.create);
/**
 * @api {get} /Deposit/:walletID Deposit List
 * @apiVersion 1.0.0
 * @apiName Get the list of Deposit via wallet ID
 * @apiGroup Deposit
 *  
 * @apiQuery {Integer} litmit Items in a page.
 * @apiQuery {Integer} skip Items will left in the list.
 *
 * @apiSuccess {Object} Model[{}] List items of the Deposit.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *        "id": "1",
 *        "walletID": "JY58ZjzBWh9785349Yo54FP789453697852147",
 *        "tokenBalance": 150,
 *        "tokenType": "SNCT",
 *        "status":"Pending"
 *        "createdAt": "2022-01-04T19:21:21.264Z",
 *        "updatedAt": "2022-01-04T19:23:08.326Z"
 *       },
 *       {
 *        "id": "2",
 *        "walletID": "JY58ZjzBWh9785349Yo54FP789453697852147",
 *        "tokenBalance": 200,
 *        "tokenType": "TOC",
 *        "status":"Success"
 *        "createdAt": "2022-01-04T19:21:21.264Z",
 *        "updatedAt": "2022-01-04T19:23:08.326Z"
 *       },
 *     ]
 *
 * @apiError Deposit Data is not exist.
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

router.param('walletID', modelCtrl.load);

module.exports = router;
