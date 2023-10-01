// The first step is to create a new link_token by making a /link/token/create request and passing in the required configurations. This link_token is a short lived, one-time use token that authenticates your app with Plaid Link, our frontend module. Several of the environment variables you configured when launching the Quickstart, such as PLAID_PRODUCTS, are used as parameters for the link_token.
const {
  Configuration,
  PlaidApi,
  PlaidEnvironments,
} = require("plaid");
const {
  PLAID_ENV,
  PLAID_CLIENT_ID,
  PLAID_SECRET,
} = require("../config/constants");

// Configuration for the Plaid client
const config = new Configuration({
  basePath: PlaidEnvironments[PLAID_ENV],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": PLAID_CLIENT_ID,
      "PLAID-SECRET": PLAID_SECRET,
      "Plaid-Version": "2020-09-14",
    },
  },
});

//Instantiate the Plaid client with the configuration
const client = new PlaidApi(config);

const getPlaidLinkToken = async (req, res, next) => {
  const clientUserId = req.user.uid;

  const request = {
    user: {
      client_user_id: clientUserId,
    },
    client_name: "Plaid Integation",
    products: ["auth"],
    language: "en",
    country_codes: ["US"],
  };
  try {
    const createTokenResponse = await client.linkTokenCreate(request);

    res.json(createTokenResponse.data);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const exchangePlaidToken = async (req, res, next) => {
  // Exchanges the public token from Plaid Link for an access token

  const exchangeResponse = await client.itemPublicTokenExchange({
    public_token: req.body.public_token,
  });

  // FOR DEMO PURPOSES ONLY
  // Store access_token in DB instead of session storage
  req.session.access_token = exchangeResponse.data.access_token;
  res.json(true);
};

const getBalance = async (req, res, next) => {
  const access_token = req.session.access_token;
  const balanceResponse = await client.accountsBalanceGet({
    access_token,
  });
  res.json({
    Balance: balanceResponse.data,
  });
};

module.exports = {
  getPlaidLinkToken,
  exchangePlaidToken,
  getBalance,
};
