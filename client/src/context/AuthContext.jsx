import { useContext, useState, createContext } from "react";

const AuthContext = createContext(null);

export const useAuth = () => {
  const auth = useContext(AuthContext);
  return auth;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [messages, setMessages] = useState("");

  const checkAuthStatus = async () => {
    try {
      setIsloading(true);
      const response = await axios.get("http://localhost:5000/user/auth");
      setIsLoggedIn(response.data.isAuthenticated);
    } catch (error) {
      console.error("Error Checking Auth status", error);
    } finally {
      setIsloading(false);
    }
  };
  const value = {
    isLoggedIn,
    setIsLoggedIn,
    isLoading,
    setIsloading,
    messages,
    setMessages,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
