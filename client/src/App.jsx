import Header from "./components/Header";
import Listings from "./screens/Listings";
import LoginScreen from "./screens/LoginScreen";
import NewListingForm from "./screens/newListingForm";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ShowListing from "./screens/ShowListing";
import SignUpScreen from "./screens/SignUpScreen";
import VerificationScreen from "./screens/VerificationScreen";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Listings />} />
          <Route path="/new-form" element={<NewListingForm />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="sign-up" element={<SignUpScreen />} />
          <Route path="/show-List/:id" element={<ShowListing />} />
          <Route path="/verify" element={<VerificationScreen />} />;
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
