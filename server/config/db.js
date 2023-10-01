const { initializeApp } = require("firebase-admin/app");
const admin = require("firebase-admin");

const serviceAccount = require("./fsCreds.json");

initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const auth = admin.auth();
const db = admin.firestore();

module.exports = { db, auth };
