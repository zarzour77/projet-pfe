import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login"
import SignupSuccess from "./components/SignupSuccess";
import CreateProfile from "./components/CreateProfile";
import Experience from "./components/Experience";
import Subscription from "./components/Subscription";
import PaymentSuccess from "./components/PaymentSuccess";
import PaymentFailed from "./components/PaymentFailed";
import TradeForTalent from "./components/TradeForTalent";
import ProfileSelection from "./components/ProfileSelection";
import UserInformation from "./components/UserInformation";
import Messenger from "./components/Messenger";
import MissioinTinder from "./components/MissionTinder";
import SearchMission from "./components/SearchMission";
import StatsConsultant from "./components/statsconsultant";
import PublierMission from "./components/PublierMission";
import Home from "./components/Home";
import LandingEntreprise from "./components/LandingEntreprise";
import ProfilePage from "./components/ProfilePage";
import Header from "./components/Header";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home /> }  />
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
        <Route path="/StatsConsultant" element={<StatsConsultant /> }  />
        <Route path="/PublierMission" element={<PublierMission /> }  />
        <Route path="/Home" element={<Home /> }  />
        <Route path="/LandingEntreprise" element={<LandingEntreprise /> }  />
        <Route path="/ProfilePage" element={<ProfilePage /> }  />

      </Routes>
      
    </Router>
  );
};

export default App;
