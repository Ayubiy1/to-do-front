import { Route, Routes } from "react-router-dom";
import MainComp from "./components/main";
import ListPage from "./components/pages/lists/Lists";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainComp />}>
          <Route path="/:name" element={<ListPage />} />
        </Route>
      </Routes>
    </>
  );
}
export default App;
