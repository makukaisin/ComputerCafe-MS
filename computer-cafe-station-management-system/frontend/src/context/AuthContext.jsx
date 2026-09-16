import {
    createContext,
    useContext,
    useState
  } from "react";
  
  const AuthContext = createContext(null);
  
  const STORAGE_KEY = "computer-cafe-authenticated";
  
  export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] =
      useState(
        () =>
          localStorage.getItem(STORAGE_KEY) === "true"
      );
  
    function login(username, password) {
      const valid =
        username === "cafe_admin" &&
        password === "pccafe2026";
  
      if (valid) {
        localStorage.setItem(STORAGE_KEY, "true");
        setIsAuthenticated(true);
      }
  
      return valid;
    }
  
    function logout() {
      localStorage.removeItem(STORAGE_KEY);
      setIsAuthenticated(false);
    }
  
    return (
      <AuthContext.Provider
        value={{
          isAuthenticated,
          login,
          logout
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }
  
  export function useAuth() {
    return useContext(AuthContext);
  }