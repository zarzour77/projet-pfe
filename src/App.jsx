import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login"
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
import ProfessionalDetails from "./components/ProfessionalDetails"
import Notification from "./components/Notification";
import ProtectedRoute from "./services/ProtectedRoute";
import { AuthProvider } from "./services/AuthContext";
const App = () => {
  return (
    <AuthProvider>

    <Router>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login /> }  />
        <Route path="/UserInformation" element={<UserInformation /> }  />
        <Route path="/Notification" element={<Notification /> }  />
        <Route 
          path="/SearchMission" 
          element={
            <ProtectedRoute allowedRoles={['Consultant']}>
              <SearchMission />
            </ProtectedRoute>
          }/>
          <Route 
          path="/MissionTinder" 
          element={
            <ProtectedRoute allowedRoles={['Consultant']}>
              <MissioinTinder />
            </ProtectedRoute>
          }/>
          <Route 
          path="/SignupSuccess" 
          element={
            <ProtectedRoute allowedRoles={['Consultant']}>
              <SignupSuccess />
            </ProtectedRoute>
          }/>
          <Route 
          path="/CreateProfile" 
          element={
            <ProtectedRoute allowedRoles={['Consultant']}>
              <CreateProfile />
            </ProtectedRoute>
          }/>
          <Route 
          path="/Experience" 
          element={
            <ProtectedRoute allowedRoles={['Consultant']}>
              <Experience />
            </ProtectedRoute>
          }/>
          <Route 
          path="/Subscription" 
          element={
            <ProtectedRoute allowedRoles={['Consultant']}>
              <Subscription />
            </ProtectedRoute>
          }/>
          <Route 
          path="/PaymentSuccess" 
          element={
            <ProtectedRoute allowedRoles={['Consultant']}>
              <PaymentSuccess />
            </ProtectedRoute>
          }/>
          <Route 
          path="/PaymentFailed" 
          element={
            <ProtectedRoute allowedRoles={['Consultant']}>
              <PaymentFailed />
            </ProtectedRoute>
          }/>
          <Route 
          path="/ProfessionalDetails" 
          element={
            <ProtectedRoute allowedRoles={['Consultant']}>
              <ProfessionalDetails />
            </ProtectedRoute>
          }/>
          <Route 
          path="/Messenger" 
          element={
            <ProtectedRoute allowedRoles={['Consultant','Entreprise']}>
              <Messenger />
            </ProtectedRoute>
          }/>
          <Route 
          path="/ProfilePage" 
          element={
            <ProtectedRoute allowedRoles={['Consultant']}>
              <ProfilePage />
            </ProtectedRoute>
          }/>

        <Route 
          path="/PublierMission" 
          element={
            <ProtectedRoute allowedRoles={['Entreprise']}>
              <PublierMission />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/LandingEntreprise" 
          element={
            <ProtectedRoute allowedRoles={['Entreprise']}>
              <LandingEntreprise />
            </ProtectedRoute>
          } 
        />

      </Routes>
    </Router>
    </AuthProvider>
  );
};

export default App;