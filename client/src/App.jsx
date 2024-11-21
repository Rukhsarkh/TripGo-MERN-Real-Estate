import Header from "./components/Header";
import Listings from "./screens/Listings";
import LoginScreen from "./screens/LoginScreen";
import NewListingForm from "./screens/newListingForm";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ShowListing from "./screens/ShowListing";
import SignUpScreen from "./screens/SignUpScreen";
import VerificationScreen from "./screens/VerificationScreen";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./context/ProtectedRoute";
function App() {
  return (
    <Router>
      <AuthProvider>
        <div>
          <Header />
          <Routes>
            <Route path="/" element={<Listings />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/Sign-up" element={<SignUpScreen />} />
            <Route path="/verify" element={<VerificationScreen />} />
            <Route
              path="/new-form"
              element={
                <ProtectedRoute>
                  <NewListingForm />
                </ProtectedRoute>
              }
            />
            <Route path="/show-List/:id" element={<ShowListing />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
