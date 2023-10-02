const { Configuration, PlaidEnvironments } = require("plaid");
const {
  PLAID_CLIENT_ID,
  PLAID_SECRET,
  PLAID_ENV,
} = require("./constants");

// Configuration for the Plaid client
const plaidConfig = new Configuration({
  basePath: PlaidEnvironments[PLAID_ENV],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": PLAID_CLIENT_ID,
      "PLAID-SECRET": PLAID_SECRET,
      "Plaid-Version": "2020-09-14",
    },
  },
});

module.exports = plaidConfig;
