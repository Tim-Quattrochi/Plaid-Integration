const { PlaidApi } = require("plaid");

const { db } = require("../config/db");
const syncTransactions = require("../services/syncTransactions");
const plaidConfig = require("../config/plaidConfig");

const client = new PlaidApi(plaidConfig);

const getPlaidLinkToken = async (req, res, next) => {
  const clientUserId = req.user.uid;

  const request = {
    user: {
      client_user_id: clientUserId,
    },
    client_name: "Plaid Integation",
    products: ["transactions"],
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
  const exchangeResponse = await client.itemPublicTokenExchange({
    public_token: req.body.public_token,
  });

  const userId = req.user.uid;
  const userData = {
    pLAccessToken: exchangeResponse.data.access_token,
  };

  try {
    const userRef = db.collection("users").doc(userId);

    await userRef.set(userData);
    res.json(true);
    console.log("data added to store");
  } catch (error) {
    console.error("Error adding user data: ", error);
    next(error);
  }
};

const getBalance = async (req, res, next) => {
  const userId = req.user.uid;
  const userRef = db.collection("users").doc(userId);
  try {
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const pLAccessToken = userDoc.data().pLAccessToken;

    if (!pLAccessToken) {
      return res
        .status(404)
        .json({ error: "pLAccessToken not found for the user" });
    }

    const balanceResponse = await client.accountsBalanceGet({
      access_token: pLAccessToken,
    });

    res.json({
      Balance: balanceResponse.data,
    });
  } catch (error) {
    next(error);
  }
};

const getTransactions = async (req, res, next) => {
  const userId = req.user.uid;
  const { itemId } = req.body;

  const userRef = db.collection("users").doc(userId);
  try {
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const pLAccessToken = userDoc.data().pLAccessToken;

    if (!pLAccessToken) {
      return res
        .status(404)
        .json({ error: "token not found for the user" });
    }

    await syncTransactions(
      userId,
      pLAccessToken,
      client,
      db,
      res,
      itemId
    );
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  getPlaidLinkToken,
  exchangePlaidToken,
  getBalance,
  getTransactions,
};
