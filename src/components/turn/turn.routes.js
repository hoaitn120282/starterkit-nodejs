const express = require('express');
const { Joi } = require('express-validation');
const modelCtrl = require('./turn.controller');
const { validate } = require('../../helpers');

const router = express.Router();

const paramValidation = {
  updateModel: {
    body: Joi.object({
      walletID: Joi.string().required(),
      turnNumber: Joi.number(),
      turnLimit: Joi.number(),
    }),
    params: Joi.object({
      walletID: Joi.string().required(),
    }),
  },
  createModel: {
    body: Joi.object({
      walletID: Joi.string().required(),
      turnNumber: Joi.number(),
      turnLimit: Joi.number(),
    }),
  },
};

router.route('/')
  .get(modelCtrl.list)

  .post(validate(paramValidation.createModel), modelCtrl.create);

router.route('/:walletID')
  .get(modelCtrl.get)

  .delete(modelCtrl.destroy);

router.route('/:walletID')
  .put(validate(paramValidation.updateModel), modelCtrl.update);

router.param('id', modelCtrl.load);

module.exports = router;
