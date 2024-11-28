import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import config from "../config";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${config.API_URL}/user/auth`, {
        withCredentials: true,
      });
      setIsLoggedIn(response.data.isAuthenticated);
      return response.data.id;
    } catch (error) {
      console.error("Error checking auth status", error);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const response = await axios.get(`${config.API_URL}/user/logout`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setIsLoggedIn(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error logging out:", error);
      return false;
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value = {
    isLoggedIn,
    isLoading,
    setIsLoggedIn,
    logout,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
