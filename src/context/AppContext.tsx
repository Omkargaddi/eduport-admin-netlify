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
  const backendUrl = 'https://eduport-backend-production.up.railway.app/admin';

const getUserData = async (): Promise<any | null> => {
  try {
    const response = await axios.get(`${backendUrl}/profile`, {
      withCredentials: true,
    });
    if (response.status === 200) {
      setUserData(response.data);
      setIsLoggedIn(true);
      return response.data;
    }
  } catch (err: any) {
    setIsLoggedIn(false);
    if (err.response?.status === 401) {
      toast.error("Session expired. Please login again.");
    }
  }
  return null; 
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
