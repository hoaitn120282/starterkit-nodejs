const { isEmpty } = require("lodash");
const Deposit = require("../deposit/deposit.model");
const Withdraw = require("../withdraw/withdraw.model");

const config = require("../../config");

/**
 * Get Transactions History list.
 * @property {number} req.query.skip
 * @property {number} req.query.limit
 * @returns {Promise<Deposit[]>}
 */
async function list(req, res, next) {
    
  const deposits = await Deposit.findAll();
  const withdraws = await Withdraw.findAll();

  const transactionsHistory = {
    deposits: deposits,
    withdraws: withdraws,
  };

  return res.json(transactionsHistory);
}

module.exports = {
  list,
};
