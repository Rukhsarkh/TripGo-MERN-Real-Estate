import Header from "./components/Header";
import Listings from "./screens/Listings";
import LoginScreen from "./screens/LoginScreen";
import NewListingForm from "./screens/newListingForm";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ShowListing from "./screens/ShowListing";
import SignUpScreen from "./screens/SignUpScreen";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Listings />} />
        <Route path="/new-form" element={<NewListingForm />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="sign-up" element={<SignUpScreen />} />
        <Route path="/show-List/:id" element={<ShowListing />} />
      </Routes>
    </Router>
  );
}

export default App;
