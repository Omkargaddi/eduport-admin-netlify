import {
  createContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "react-toastify";
import axios from "axios";

interface AppContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  userData: any;
  setUserData: React.Dispatch<React.SetStateAction<any>>;
  backendUrl: string;
  getUserData: () => Promise<any>;
}

export const AppContext = createContext<AppContextType>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  userData: null,
  setUserData: () => {},
  backendUrl: '',
  getUserData: async () => null,
});

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const backendUrl = 'http://localhost:8080/admin';

  const getUserData = async () => {
   
    try {
      const response = await axios.get(`${backendUrl}/profile`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setUserData(response.data);
        setIsLoggedIn(true);
        console.log(response.data);
        return response.data;
      } else {
        setIsLoggedIn(false);
        console.log("Failed to fetch user data")
      }
    } catch (error: any) {
      setIsLoggedIn(false);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      } else {
        if(isLoggedIn){
          toast.error(error?.message || "An unknown error occurred");
        }
      }
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const contextValue: AppContextType = {
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    backendUrl,
    getUserData,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
