import { createContext, useEffect, useState } from "react";
import axios from "../api/axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchUserProfile = async () => {  // ✅ renamed clearly to fetchUserProfile
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await axios.get('/users/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(res.data);
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, fetchUserProfile }}> {/* ✅ Add fetchUserProfile here */}
      {children}
    </UserContext.Provider>
  );
};
