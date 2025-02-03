import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Components/Home";
import Login from "./Components/Login"
import SignupSuccess from "./Components/SignupSuccess";
import CreateProfile from "./Components/CreateProfile";
import Header from "./Components/Header";
import Experience from "./Components/Experience";
const App = () => {
  return (
    <Router>
      <Header/>
      <Routes>
        {/* Home page route */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login /> }  />
        <Route path="/SignupSuccess" element={<SignupSuccess /> }  />
        <Route path="/CreateProfile" element={<CreateProfile /> }  />
        <Route path="/Experience" element={<Experience /> }  />


      </Routes>
    </Router>
  );
};

export default App;
