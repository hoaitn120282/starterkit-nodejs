// const { isEmpty } = require("lodash");
const Deposit = require('../deposit/deposit.model');
const Withdraw = require('../withdraw/withdraw.model');

// const config = require("../../config");

/**
 * Get Transactions History list.
 * @property {number} req.query.skip
 * @property {number} req.query.limit
 * @returns {Promise<Deposit[]>}
 */
async function list(req, res) {
  const { walletID } = req.body;
  const { limit = 50, skip = 0 } = req.query;
  const deposits = await Deposit.getBywalletID(walletID, {
    limit: Math.floor(limit / 2),
    skip,
  });
  const withdraws = await Withdraw.getBywalletID(walletID, {
    limit: Math.floor(limit / 2),
    skip,
  });

  const transaction = deposits.concat(withdraws);

  return res.json(transaction);
}

module.exports = {
  list,
};
