import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Login from "./Components/Login"
import SignupSuccess from "./Components/SignupSuccess";
import CreateProfile from "./Components/CreateProfile";
import Header from "./components/Header";
import Experience from "./Components/Experience";
import Subscription from "./Components/Subscription";
import PaymentSuccess from "./Components/PaymentSuccess";
import PaymentFailed from "./Components/PaymentFailed";
import UserInformation from "./components/UserInformation";
import MissionTinder from "./components/MissionTinder";
import SearchMission from "./components/SearchMission";
import Messenger from "./components/Messenger";
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
        <Route path="/UserInformation" element={<UserInformation /> }  />
        <Route path="/MissionTinder" element={<MissionTinder /> }  />
        <Route path="/SearchMission" element={<SearchMission /> }  />
        <Route path="/Messenger" element={<Messenger /> }  />
      </Routes>
    </Router>
  );
};

export default App;
