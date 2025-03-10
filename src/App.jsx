import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Components/Home";
import Login from "./Components/Login";
import SignupSuccess from "./Components/SignupSuccess";
import CreateProfile from "./Components/CreateProfile";
import Experience from "./Components/Experience";
import Subscription from "./Components/Subscription";
import PaymentSuccess from "./Components/PaymentSuccess";
import PaymentFailed from "./Components/PaymentFailed";
import UserInformation from "./Components/UserInformation";
import Messenger from "./Components/Messenger";
import MissioinTinder from "./Components/MissionTinder";
import SearchMission from "./Components/SearchMission";
import PublierMission from "./Components/PublierMission";
import ProfilePage from "./Components/ProfilePage";
import LandingEntreprise from "./Components/LandingEntreprise";
import ProfessionalDetails from "./Components/ProfessionalDetails";
import TransactionsHistory from "./Components/TransactionsHistory"; 
import EntrepriseMission from "./Components/EntrepriseMission";
import Notification from "./Components/Notification";
import VoirProfileConsultant from "./Components/VoirProfileConsultant";

// NEW: Import your ConsultantPropositions component
import ConsultantPropositions from "./Components/ConsultantPropositions";

import ProtectedRoute from "./Services/ProtectedRoute";
import { AuthProvider } from "./Services/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/UserInformation" element={<UserInformation />} />
          <Route path="/Notification" element={<Notification />} />
          <Route path="/EntrepriseMission" element={<EntrepriseMission />} />
          <Route path="/consultant/:consultantId" element={<VoirProfileConsultant />} />
          
          {/* Consultant routes */}
          <Route
            path="/SearchMission"
            element={
              <ProtectedRoute allowedRoles={["Consultant"]}>
                <SearchMission />
              </ProtectedRoute>
            }
          />
          <Route
            path="/MissionTinder"
            element={
              <ProtectedRoute allowedRoles={["Consultant"]}>
                <MissioinTinder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/SignupSuccess"
            element={
              <ProtectedRoute allowedRoles={["Consultant"]}>
                <SignupSuccess />
              </ProtectedRoute>
            }
          />
          <Route
            path="/CreateProfile"
            element={
              <ProtectedRoute allowedRoles={["Consultant"]}>
                <CreateProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Experience"
            element={
              <ProtectedRoute allowedRoles={["Consultant"]}>
                <Experience />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Subscription"
            element={
              <ProtectedRoute allowedRoles={["Consultant"]}>
                <Subscription />
              </ProtectedRoute>
            }
          />
          <Route
            path="/PaymentSuccess"
            element={
              <ProtectedRoute allowedRoles={["Consultant"]}>
                <PaymentSuccess />
              </ProtectedRoute>
            }
          />
          <Route
            path="/PaymentFailed"
            element={
              <ProtectedRoute allowedRoles={["Consultant"]}>
                <PaymentFailed />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ProfessionalDetails"
            element={
              <ProtectedRoute allowedRoles={["Consultant"]}>
                <ProfessionalDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ProfilePage"
            element={
              <ProtectedRoute allowedRoles={["Consultant"]}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute allowedRoles={["Consultant"]}>
                <TransactionsHistory />
              </ProtectedRoute>
            }
          />
          
          {/* NEW Protected Route for ConsultantPropositions */}
          <Route
            path="/ConsultantPropositions"
            element={
              <ProtectedRoute allowedRoles={["Consultant"]}>
                <ConsultantPropositions />
              </ProtectedRoute>
            }
          />

          {/* Entreprise routes */}
          <Route
            path="/PublierMission"
            element={
              <ProtectedRoute allowedRoles={["Entreprise"]}>
                <PublierMission />
              </ProtectedRoute>
            }
          />
          <Route
            path="/LandingEntreprise"
            element={
              <ProtectedRoute allowedRoles={["Entreprise"]}>
                <LandingEntreprise />
              </ProtectedRoute>
            }
          />

          {/* Messenger accessible by both roles */}
          <Route
            path="/Messenger"
            element={
              <ProtectedRoute allowedRoles={["Consultant", "Entreprise"]}>
                <Messenger />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
