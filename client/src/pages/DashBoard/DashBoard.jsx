import { useEffect, useState, useCallback } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuthContext from "../../hooks/useAuthContext";
import LoadingSpinner from "../../components/Loading/LoadingSpinner";
import { usePlaidLink } from "react-plaid-link";
import "./dashBoard.css";

const DashBoard = () => {
  const axiosPrivate = useAxiosPrivate();
  const { authState } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [data, setData] = useState(null);
  const [transactions, setTransactions] = useState(null);
  const [itemId, setItemId] = useState(null);

  const {
    user: { name },
  } = authState;

  const onSuccess = useCallback(async (publicToken) => {
    setLoading(true);
    await axiosPrivate.post("/plaid/exchange_public_token", {
      public_token: publicToken,
    });
    await getBalance();
    await getTransactions();
  }, []);

  // Creates a Link token
  const createLinkToken = useCallback(async () => {
    // For OAuth, use previously generated Link token
    if (window.location.href.includes("?oauth_state_id=")) {
      const linkToken = localStorage.getItem("link_token");
      setToken(linkToken);
    } else {
      const response = await axiosPrivate.get(
        "/plaid/create_link_token",
        {}
      );
      const linkToken = response.data.link_token;
      setToken(linkToken);
      localStorage.setItem("link_token", data.link_token);
    }
  }, [setToken]);

  // Fetch balance data
  const getBalance = useCallback(async () => {
    setLoading(true);
    const response = await axiosPrivate.get("/plaid/balance", {});

    const { data } = response;
    const { Balance } = data;

    setItemId(Balance.item.item_id);

    setData(data);
    setLoading(false);
  }, [setData, setLoading]);

  const getTransactions = async () => {
    setLoading(true);
    const response = await axiosPrivate.post("/plaid/transactions", {
      itemId: itemId,
    });

    const { data } = response;

    setTransactions(data.transactions);
    setLoading(false);
  };

  let isOauth = false;

  const config = {
    token,
    onSuccess,
  };

  // For OAuth, configure the received redirect URI
  if (window.location.href.includes("?oauth_state_id=")) {
    config.receivedRedirectUri = window.location.href;
    isOauth = true;
  }
  const { open, ready } = usePlaidLink(config);

  useEffect(() => {
    if (token == null) {
      createLinkToken();
    }
    if (isOauth && ready) {
      open();
    }
  }, [token, isOauth, ready, open]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="dash-container">
      <h1>Dashboard</h1>
      <span className="greeting">Hello, {name}</span>

      <div>
        <button onClick={() => open()} disabled={!ready}>
          <strong>Link account</strong>
        </button>

        {!loading &&
          data != null &&
          Object.entries(data).map((entry, i) => (
            <pre key={i}>
              <code>{JSON.stringify(entry[1], null, 2)}</code>
            </pre>
          ))}
      </div>
      <div>
        <h2>Transaction List</h2>
        <ul>
          {transactions &&
            transactions.map((transaction) => (
              <li key={transaction.transactionId}>
                <p>Merchant: {transaction.merchant}</p>
                <p>Date: {transaction.date}</p>
                <p>Amount: {transaction.amount}</p>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default DashBoard;
