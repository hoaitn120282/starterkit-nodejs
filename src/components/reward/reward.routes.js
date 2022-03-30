const express = require("express");
const { Joi } = require("express-validation");
const modelCtrl = require("./reward.controller");
const { validate } = require("../../helpers");

const router = express.Router(); // eslint-disable-line new-cap

const paramValidation = {
  updateModel: {
    body: Joi.object({
      walletID: Joi.string().required(),
      rewardAmount: Joi.number(),
      rewardWithdrawn: Joi.number(),
      rewardAvailable: Joi.number(),
      totalExp: Joi.number(),
      rewardType: Joi.string(),
    }),
    params: Joi.object({
      walletID: Joi.string().hex().required(),
    }),
  },
  createModel: {
    body: Joi.object({
      walletID: Joi.string().required(),
      rewardAmount: Joi.number(),
      rewardWithdrawn: Joi.number(),
      rewardAvailable: Joi.number(),
      totalExp: Joi.number(),
      rewardType: Joi.string(),
    }),
  },
};

router
  .route("/")

  .get(modelCtrl.list)

  .post(validate(paramValidation.createModel), modelCtrl.create);


/**
 * @api {get} /rewards/top-reward-toc Top reward TOC
 * @apiVersion 1.0.0
 * @apiName List top reward TOC
 * @apiGroup Reward
 *
 * @apiQuery {Integer} litmit Items in a page.
 * @apiQuery {Integer} skip Items will left in the list.
 * @apiQuery {Datetime} start Start time: yyyy-mm-dd.
 * @apiQuery {Datetime} end End time: yyyy-mm-dd.
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
  .route("/:walletID")

  .get(modelCtrl.get)

  .put(validate(paramValidation.updateModel), modelCtrl.update)

  .delete(modelCtrl.destroy);

router.param("walletID", modelCtrl.load);


module.exports = router;
