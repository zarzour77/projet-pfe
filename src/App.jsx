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
import StatConsultant from "./Components/StatConsultant";
import ConsultantPropositions from "./Components/ConsultantPropositions";
import Header from "./Components/Header";
import VirtualAssistant from "./Components/VirtualAssistant";
import StatEntreprise from "./Components/StatEntreprise";
import StatAdmin from "./Components/StatAdmin";
import Footer from "./Components/Footer";
import ProtectedRoute from "./services/ProtectedRoute";
import AddCollaborator from "./Components/AddCollaborator";
import CollaboratorsList from "./Components/CollaboratorsList";
import EntrepriseProfilePage from "./Components/EntrepriseProfilePage";
import VoirProfileEntreprise from "./Components/VoirProfileEntreprise";
import Settings from "./Components/Settings";
import Dispute from "./Components/Dispute";
import AdminDispute from "./Components/Admindispute";
import { AuthProvider } from "./Services/AuthContext";
import VoirAllUsers from "./Components/VoirAllUsers";
import StatEntreprisessi from "./Components/StatEntreprisessi";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route
            path="/VoirAllUsers"
            element={
              <ProtectedRoute allowedRoles={[ "Admin"]}>
                <Header />
                <VirtualAssistant />
                <VoirAllUsers />
              </ProtectedRoute>
            }
          />         <Route path="/login" element={<Login />} />
          <Route path="/UserInformation" element={<UserInformation />} />
          <Route path="/Notification" element={<Notification />} />
          <Route path="/StatEntreprisessi" element={<StatEntreprisessi />} />

          <Route
            path="/Dispute"
            element={
              <ProtectedRoute allowedRoles={[ "Entreprise","Consultant","Admin"]}>
                <Header />
                <VirtualAssistant />
                <Dispute />
              </ProtectedRoute>
            }
          />           
          <Route
            path="/AdminDispute"
            element={
              <ProtectedRoute allowedRoles={[ "Admin"]}>
                <Header />
                <AdminDispute />
              </ProtectedRoute>
            }
          />          {/* Updated Stat Routes */}
          <Route
            path="/StatConsultant"
            element={
              <ProtectedRoute allowedRoles={["Consultant", "Admin"]}>
                <Header />
                <VirtualAssistant />
                <StatConsultant />
              </ProtectedRoute>
            }
          />
          <Route
            path="/StatEntreprise"
            element={
              <ProtectedRoute allowedRoles={["Entreprise", "Admin"]}>
                <Header />
                <VirtualAssistant />
                <StatEntreprise />
              </ProtectedRoute>
            }
          />
          <Route
            path="/StatAdmin"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <Header />
                <VirtualAssistant />
                <StatAdmin />
              </ProtectedRoute>
            }
          />

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
<Route
            path="/mission/:missoinId"
            element={
              <ProtectedRoute allowedRoles={["Entreprise", "Consultant", "Admin"]}>
                <Header />
                <VirtualAssistant />
                <SearchMission />
              </ProtectedRoute>
            }
          />
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
                <Footer />
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
                <Footer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute allowedRoles={["Consultant", "Entreprise", "Admin"]}>
                <Header />
                <TransactionsHistory />
                <VirtualAssistant />
              </ProtectedRoute>
            }
          />

          {/* ConsultantPropositions Route */}
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

          {/* Messenger Route */}
          <Route
            path="/Messenger"
            element={
              <ProtectedRoute allowedRoles={["Consultant", "Entreprise", "Admin"]}>
                <Header />
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