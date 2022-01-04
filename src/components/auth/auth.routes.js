const express = require('express');
const { Joi } = require('express-validation');
const authCtrl = require('./auth.controller');
const { validate } = require('../../helpers');

const router = express.Router();
const paramValidation = {
  login: {
    body: Joi.object({
      signature: Joi.string().required(),
      publicAddress: Joi.string().required(),
    }),
  },
  registerUser: {
    body: Joi.object({
      publicAddress: Joi.string().required(),
    }),
  },
};

/**
 * @api {post} /auth/login Authentication User
 * @apiVersion 1.0.0
 * @apiName User login via signature & publicAddress
 * @apiGroup User
 *
 * @apiParam {String} signature  unique Param.
 * @apiParam {String} publicAddress unique Param.
 *
 * @apiSuccess {String} token Token of the User.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "token": "0x8d70ed7a609fe8a7229784f9d25d781a70d67294",
 *     }
 *
 * @apiError UserNotFound The publicAddress of the User was not found.
 * @apiError UserNotFound The signature of the User invalid.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 */
router.route('/login')
  .post(validate(paramValidation.login), authCtrl.login);

/**
 * @api {post} /auth/register Registration User
 * @apiVersion 1.0.0
 * @apiName User register publicAddress
 * @apiGroup User
 *
 * @apiParam {String} publicAddress Mandatory unique Param.
 *
 * @apiSuccess {String} nonce Nonce number of the publicAddress.
 * @apiSuccess {String} publicAddress publicAddress was submitted.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "nonce": "1234",
 *       "publicAddress": "0x610CC894bD7cAE794530286443F90E97f5d0405B",
 *     }
 *
 * @apiError UserNotFound The publicAddress of the User was not found.
 * @apiError UserNotFound The signature of the User invalid.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 */
router.route('/register')
  .post(validate(paramValidation.registerUser), authCtrl.register);

/**
 * @api {get} /auth/checkAddress Check Public Address
 * @apiVersion 1.0.0
 * @apiName User checkAddress publicAddress
 * @apiGroup User
 *
 * @apiParam {String} publicAddress Mandatory unique Param.
 *
 * @apiSuccess {String} nonce Nonce number of the publicAddress.
 * @apiSuccess {String} publicAddress publicAddress was submitted.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "nonce": "1234",
 *       "publicAddress": "0x610CC894bD7cAE794530286443F90E97f5d0405B",
 *     }
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "mgs": "publicAddress is not define",
 *     }
 *
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 */
router.route('/checkAddress')
  .get(authCtrl.check);

module.exports = router;
