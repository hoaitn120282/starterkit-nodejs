const express = require("express");
const { Joi } = require("express-validation");
const modelCtrl = require("./withdraw.controller");
const { validate } = require("../../helpers");

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

router.route("/").get(modelCtrl.list);

/**
 * @api {post} /withdraw Withdraw Creation
 * @apiVersion 1.0.0
 * @apiName Create withdraw item with wallet ID
 * @apiGroup Withdraw
 *
 * @apiParam {String} walletID Mandatory unique Param.
 * @apiParam {Float} tokenBalance Mandatory The amount in withdraw request.
 * @apiParam {String} tokenType Mandatory The type of token in request.
 *
 * @apiSuccess {Object} Model[{}] Item of the withdraw created.
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
 *       "message": Your amount have not enough to withdraw!
 *     }
 */
router.route("/").post(validate(paramValidation.createModel), modelCtrl.create);
/**
 * @api {get} /withdraw/:walletID Withdraw List
 * @apiVersion 1.0.0
 * @apiName Get the list of withdraw via wallet ID
 * @apiGroup Withdraw
 *
 *
 * @apiParam {String} walletID Mandatory unique Param.
 * @apiParam {Integer} litmit Items in a page.
 * @apiParam {Integer} skip Items will left in the list.
 * @apiSuccess {Object} Model[{}] List items of the Withdraw.
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
 *       {
 *        "id": "3",
 *        "walletID": "JY58ZjzBWh9785349Yo54FP789453697852147",
 *        "tokenBalance": 100,
 *        "tokenType": "TOC",
 *        "status":"Fail"
 *        "createdAt": "2022-01-04T19:21:21.264Z",
 *        "updatedAt": "2022-01-04T19:23:08.326Z"
 *       },
 *     ]
 *
 * @apiError Withdraw Data is not exist.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Data is not exist"
 *     }
 */
router
  .route("/:walletID")
  .get(modelCtrl.get)

  .delete(modelCtrl.destroy);

router.param("walletID", modelCtrl.load);

module.exports = router;
