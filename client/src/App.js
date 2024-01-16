import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Sidebar from "./components/Sidebar";
import LiveFeed from "./pages/Alerts";
import Analytics from "./pages/Analytics"
import Test from "./pages/Test";
function App() {
  return (
    <>
     <Router>
    
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/alerts" element={<LiveFeed />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/test" element={<Test />} />
            </Routes>
    
  
      </Router>
    </>
  );
}

export default App;
