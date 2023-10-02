const express = require("express");

const VerifyJWT = require("../middleware/VerifyJWT");
const {
  getPlaidLinkToken,
  exchangePlaidToken,
  getBalance,
  getTransactions,
} = require("../controllers/link.controller");

const plaidRouter = express.Router();

/**
 * @method {get}
 * @protected
 * @{url-endpoint} api/plaid/create_link_token
 */
plaidRouter.get("/create_link_token", VerifyJWT, getPlaidLinkToken);
/**
 * @method {post}
 * @protected
 * @{url-endpoint} api/plaid/exchange_public_token
 */
plaidRouter.post(
  "/exchange_public_token",
  VerifyJWT,
  exchangePlaidToken
);
/**
 * @method {get}
 * @protected
 * @{url-endpoint} api/plaid/balance
 */
plaidRouter.get("/balance", VerifyJWT, getBalance);

/**
 * @method {get}
 * @protected
 * @{url-endpoint} api/plaid/transactions
 */
plaidRouter.post("/transactions", VerifyJWT, getTransactions);

module.exports = plaidRouter;
