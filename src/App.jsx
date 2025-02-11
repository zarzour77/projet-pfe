import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Components/Home";
import Login from "./Components/Login"
import SignupSuccess from "./Components/SignupSuccess";
import CreateProfile from "./Components/CreateProfile";
import Header from "./Components/Header";
import Experience from "./Components/Experience";
import Subscription from "./Components/Subscription";
import PaymentSuccess from "./Components/PaymentSuccess";
import PaymentFailed from "./Components/PaymentFailed";
import TradeForTalent from "./Components/TradeForTalent";
import ProfileSelection from "./Components/ProfileSelection";
const App = () => {
  return (
    <Router>
      <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login /> }  />
        <Route path="/SignupSuccess" element={<SignupSuccess /> }  />
        <Route path="/CreateProfile" element={<CreateProfile /> }  />
        <Route path="/Experience" element={<Experience /> }  />
        <Route path="/Subscription" element={<Subscription /> }  />
        <Route path="/PaymentSuccess" element={<PaymentSuccess /> }  />
        <Route path="/PaymentFailed" element={<PaymentFailed /> }  />
        <Route path="/TradeForTalent" element={<TradeForTalent /> }  />
        <Route path="/ProfileSelection" element={<ProfileSelection /> }  />

      </Routes>
    </Router>
  );
};

export default App;
