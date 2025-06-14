import {
  createContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "react-toastify";
import axios from "axios";

interface ProfileResponse {
  // Define the expected user profile fields here, for example:
  id: string;
  name: string;
  email: string;
  // Add more fields as needed
}

interface AppContextType {
   loading: boolean;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  userData: any;
  setUserData: React.Dispatch<React.SetStateAction<any>>;
  backendUrl: string;
  getUserData: () => Promise<any>;
}

export const AppContext = createContext<AppContextType>({
   loading: true,
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
    const [loading, setLoading] = useState(true);


    
const getUserData = async (): Promise<ProfileResponse | null> => {
  setLoading(true);

  try {
    const response = await axios.get(`${backendUrl}/profile`, {
      withCredentials: true
    });

    if (response.status === 200) {
      setUserData(response.data);
      setIsLoggedIn(true);
      return response.data;
    } else {
      setIsLoggedIn(false);
      return null;
    }
  } catch (error: any) {
    setIsLoggedIn(false);
    if (error.response?.status === 401) {
      toast.error("Session expired. Please login again.");
    } else if (isLoggedIn) {
      toast.error(error.message || "An unknown error occurred");
    }
    return null;
  } finally {
    setLoading(false);
  }
};

 useEffect(() => {
    getUserData();
  
}, []);

  const contextValue: AppContextType = {
    loading,
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
