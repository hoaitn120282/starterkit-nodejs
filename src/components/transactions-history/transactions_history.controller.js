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
  const { limit = 50, skip = 0 } = req.query;
  const deposits = await Deposit.list({ limit: Math.floor(limit / 2), skip });
  const withdraws = await Withdraw.list({ limit: Math.floor(limit / 2), skip });

  const transaction = deposits.concat(withdraws);

  return res.json(transaction);
}

module.exports = {
  list,
};
