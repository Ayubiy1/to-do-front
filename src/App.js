import { Route, Routes, useNavigate } from "react-router-dom";
import MainComp from "./components/main";
import ListPage from "./components/pages/lists/Lists";
import Login from "./components/pages/login/Login";
import Register from "./components/pages/register/Register";
import { useEffect } from "react";

function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) navigate("/register");
  });

  return (
    <>
      <Routes>
        <Route path="/" element={<MainComp />}>
          <Route path="/:_id" element={<ListPage />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}
export default App;
