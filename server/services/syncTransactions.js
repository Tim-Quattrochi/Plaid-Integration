/**
 * @param {string} accessToken The Plaid link_token
 * @param {string} userId The users uid
 * @param {object} client The PlaidApi instance.
 * @param {object} db The firestore db config.
 * @param {import('express').Response} res The express response object.
 * @param {string} res The Plaid Item ID. The item_id is always unique; linking the same account at the same institution twice will result in two Items with different item_id values. Like all Plaid identifiers, the item_id is case-sensitive.
 */
async function syncTransactions(
  userId,
  accessToken,
  client,
  db,
  res,
  itemId
) {
  let cursor = itemId;

  let added = [];
  let modified = [];
  let removed = [];
  let hasMore = true;

  while (hasMore) {
    const request = {
      access_token: accessToken,
      cursor: cursor,
    };

    const response = await client.transactionsSync(request);
    const data = response.data;

    added = added.concat(data.added);
    modified = modified.concat(data.modified);
    removed = removed.concat(data.removed);

    hasMore = data.has_more;

    cursor = data.next_cursor;
  }
  const extractedTransactions = [];

  //iterate through and take only what I want to display/store.
  added.forEach((transaction) => {
    const extractedTransaction = {
      category: transaction.category,
      transaction_id: transaction.transaction_id,
      logo_url: transaction.logo_url,
      merchant: transaction.name,
      date: transaction.date,
      amount: transaction.amount,
    };

    extractedTransactions.push(extractedTransaction);
  });

  //payload of info to save to firestore.
  const updates = {
    item_id: itemId,
    cursor: cursor,
    added: added,
    modified: modified,
    removed: removed,
    transactions: extractedTransactions,
  };

  const docRef = db.collection("users").doc(userId);

  try {
    await docRef.set(updates, { merge: true });
    console.log("Transaction synced to Firestore.");
  } catch (error) {
    console.error("Error saving to Firestore:", error);
  }
  res.status(200).json({ transactions: extractedTransactions });
}

module.exports = syncTransactions;
