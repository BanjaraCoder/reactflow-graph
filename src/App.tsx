import {
  Route,
  Routes,
  BrowserRouter as Router,
  Navigate,
} from "react-router-dom";
import VerticalNavbar from "./components/sidebarnew";
import TopNavbar from "./components/navbarnew";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import GraphExplorer from "./pages/testing/index";
import Query from "./pages/testing/query/index";

function App() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleNavbar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="flex w-[100%]">
      <Router>
        <TopNavbar isExpanded={isExpanded} />
        <div className="w-[6%]">
          <VerticalNavbar
            isExpanded={isExpanded}
            toggleNavbar={toggleNavbar}
          />
        </div>

        <div
          className={`${
            isExpanded ? "w-[88%]" : "w-[94%]"
          } px-2  mt-[7rem] ml-auto transition-width duration-300`}
        >
          <Routes>
            <Route
              path="/"
              element={<Navigate to="/graph/explore" replace />}
            />
            <Route path="/graph/explore" element={<GraphExplorer />} />
            <Route path="/graph/query" element={<Query />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;