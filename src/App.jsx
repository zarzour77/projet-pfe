import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Components/Home";
import Login from "./components/Login"
import SignupSuccess from "./Components/SignupSuccess";
import CreateProfile from "./Components/CreateProfile";
import Header from "./Components/Header";
import Experience from "./Components/Experience";
import Subscription from "./components/Subscription";
import PaymentSuccess from "./Components/PaymentSuccess";
import PaymentFailed from "./Components/PaymentFailed";
import TradeForTalent from "./Components/TradeForTalent";
import ProfileSelection from "./Components/ProfileSelection";
import UserInformation from "./components/UserInformation";
import Messenger from "./components/Messenger";
import MissioinTinder from "./components/MissionTinder";
import SearchMission from "./components/SearchMission";


const App = () => {
  return (
    <Router>
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
        <Route path="/UserInformation" element={<UserInformation /> }  />
        <Route path="/Messenger" element={<Messenger /> }  />
        <Route path="/MissionTinder" element={<MissioinTinder /> }  />
        <Route path="/SearchMission" element={<SearchMission /> }  />

      </Routes>
    </Router>
  );
};

export default App;
