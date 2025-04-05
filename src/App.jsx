import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import SignupSuccess from "./components/SignupSuccess";
import CreateProfile from "./components/CreateProfile";
import Experience from "./components/Experience";
import Subscription from "./components/Subscription";
import PaymentSuccess from "./components/PaymentSuccess";
import PaymentFailed from "./components/PaymentFailed";
import UserInformation from "./components/UserInformation";
import Messenger from "./components/Messenger";
import MissioinTinder from "./components/MissionTinder";
import SearchMission from "./components/SearchMission";
import PublierMission from "./components/PublierMission";
import ProfilePage from "./components/ProfilePage";
import LandingEntreprise from "./components/LandingEntreprise";
import ProfessionalDetails from "./components/ProfessionalDetails";
import TransactionsHistory from "./components/TransactionsHistory"; 
import EntrepriseMission from "./components/EntrepriseMission";
import Notification from "./components/Notification";
import VoirProfileConsultant from "./components/VoirProfileConsultant";
import StatConsultant from "./components/StatConsultant";
// NEW: Import your ConsultantPropositions component
import ConsultantPropositions from "./components/ConsultantPropositions";
import Header from "./components/Header";
import VirtualAssistant from "./components/VirtualAssistant";
import StatEntreprise from "./components/StatEntreprise";
import StatAdmin from "./components/StatAdmin";
import Footer from "./components/Footer";
import ProtectedRoute from "./services/ProtectedRoute";
import AddCollaborator from "./components/AddCollaborator";
import CollaboratorsList from "./components/CollaboratorsList";
import EntrepriseProfilePage from "./components/EntrepriseProfilePage";
import VoirProfileEntreprise from "./components/VoirProfileEntreprise";
import Settings from "./components/Settings";
import Dispute from "./components/Dispute";
import AdminDispute from "./components/Admindispute";
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
          <Route path="/StatConsultant" element={<StatConsultant />} /> 
          <Route path="/StatEntreprise" element={<StatEntreprise />} />
          <Route path="/StatAdmin" element={<StatAdmin />} />
          <Route path="/Dispute" element={<Dispute />} />
          <Route path="/Admindispute" element={<AdminDispute />} />

          {/* Public routes */}
          <Route
            path="/consultant/:consultantId"
            element={
              <ProtectedRoute allowedRoles={["Entreprise", "Consultant", "Admin"]}>
                <Header />
                <VirtualAssistant />
                <VoirProfileConsultant />
              </ProtectedRoute>
            }
          />

          <Route path="/StatConsultant" element={<StatConsultant />} />
          
          <Route
            path="/entreprise/:entrepriseId"
            element={
              <ProtectedRoute allowedRoles={["Entreprise", "Consultant", "Admin"]}>
                <Header />
                <VirtualAssistant />
                <VoirProfileEntreprise />
              </ProtectedRoute>
            }
          />

          <Route
            path="/EntrepriseMission"
            element={
              <ProtectedRoute allowedRoles={["Entreprise", "Admin"]}>
                <Header />
                <EntrepriseMission />
              </ProtectedRoute>
            }
          />

          {/* Consultant routes */}
          <Route
            path="/SearchMission"
            element={
              <ProtectedRoute allowedRoles={["Consultant", "Entreprise", "Admin"]}>
                <Header />
                <VirtualAssistant />
                <SearchMission />
              </ProtectedRoute>
            }
          />
          <Route
            path="/MissionTinder"
            element={
              <ProtectedRoute allowedRoles={["Consultant", "Admin"]}>
                <MissioinTinder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/SignupSuccess"
            element={
              <ProtectedRoute allowedRoles={["Consultant", "Admin"]}>
                <SignupSuccess />
              </ProtectedRoute>
            }
          />
          <Route
            path="/CreateProfile"
            element={
              <ProtectedRoute allowedRoles={["Consultant", "Admin"]}>
                <CreateProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Experience"
            element={
              <ProtectedRoute allowedRoles={["Consultant", "Admin"]}>
                <Experience />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Subscription"
            element={
              <ProtectedRoute allowedRoles={["Consultant", "Admin"]}>
                <Header />
                <VirtualAssistant />
                <Subscription />
              </ProtectedRoute>
            }
          />
          <Route
            path="/PaymentSuccess"
            element={
              <ProtectedRoute allowedRoles={["Consultant","Entreprise", "Admin"]}>
                <PaymentSuccess />
              </ProtectedRoute>
            }
          />
          <Route
            path="/PaymentFailed"
            element={
              <ProtectedRoute allowedRoles={["Consultant", "Admin"]}>
                <PaymentFailed />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ProfessionalDetails"
            element={
              <ProtectedRoute allowedRoles={["Consultant", "Admin"]}>
                <ProfessionalDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ProfilePage"
            element={
              <ProtectedRoute allowedRoles={["Consultant", "Admin"]}>
                <Header />
                <VirtualAssistant />
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute allowedRoles={["Consultant", "Entreprise", "Admin"]}>
                <TransactionsHistory />
                <VirtualAssistant />
              </ProtectedRoute>
            }
          />

          {/* NEW Protected Route for ConsultantPropositions */}
          <Route
            path="/ConsultantPropositions"
            element={
              <ProtectedRoute allowedRoles={["Consultant", "Admin"]}>
                <Header />
                <VirtualAssistant />
                <ConsultantPropositions />
              </ProtectedRoute>
            }
          />

          {/* Entreprise routes */}
          <Route
            path="/PublierMission"
            element={
              <ProtectedRoute allowedRoles={["Entreprise", "Admin"]}>
                <Header />
                <VirtualAssistant />
                <PublierMission />
              </ProtectedRoute>
            }
          />
          <Route
            path="/LandingEntreprise"
            element={
              <ProtectedRoute allowedRoles={["Entreprise", "Admin"]}>
                <Header />
                <VirtualAssistant />
                <LandingEntreprise />
              </ProtectedRoute>
            }
          />

          {/* Messenger accessible by both roles */}
          <Route
            path="/Messenger"
            element={
              <ProtectedRoute allowedRoles={["Consultant", "Entreprise", "Admin"]}>
                <Messenger />
              </ProtectedRoute>
            }
          />
          <Route
            path="/AddCollaborator"
            element={
              <ProtectedRoute allowedRoles={["Entreprise", "Admin"]}>
                <Header />
                <VirtualAssistant />
                <AddCollaborator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/CollaboratorsList"
            element={
              <ProtectedRoute allowedRoles={["Entreprise", "Admin"]}>
                <Header />
                <VirtualAssistant />
                <CollaboratorsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/EntrepriseProfilePage"
            element={
              <ProtectedRoute allowedRoles={["Entreprise", "Admin"]}>
                <Header />
                <VirtualAssistant />
                <EntrepriseProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Settings"
            element={
              <ProtectedRoute allowedRoles={["Consultant", "Entreprise", "Admin"]}>
                <Header />
                <VirtualAssistant />
                <Settings />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};


export default App;