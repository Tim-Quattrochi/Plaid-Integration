import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuthContext from "../../hooks/useAuthContext";
import LoadingSpinner from "../../components/Loading/LoadingSpinner";
import "./dashBoard.css";

const DashBoard = () => {
  const [list, setList] = useState("");
  const axiosPrivate = useAxiosPrivate();
  const { authState } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const {
    user: { email },
  } = authState;
  /**
   * @description Right now this axios call is just a test
   * to test protected endpoints
   */

  useEffect(() => {
    setLoading(true);
    axiosPrivate
      .get("/auth/list")
      .then((res) => {
        const { data } = res;

        const { list } = data;
        setList(list);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingSpinner />;
  return (
    <div className="dash-container">
      <h1>Dashboard</h1>
      <span className="greeting">Hello,{email}</span>

      <span>{list} </span>
    </div>
  );
};

export default DashBoard;
