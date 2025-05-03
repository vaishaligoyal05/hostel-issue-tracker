// src/context/AdminContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../api/axios';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem('admin');
    return stored ? JSON.parse(stored) : null;
  });

  const [loading, setLoading] = useState(!admin); // Load only if not in localStorage

  useEffect(() => {
    if (!admin) {
      const fetchAdmin = async () => {
        try {
          const res = await axios.get('/admin/me'); // ✅ Fetch from correct route
          setAdmin(res.data);
          localStorage.setItem('admin', JSON.stringify(res.data));
        } catch (err) {
          console.error('Error fetching admin profile:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchAdmin();
    }
  }, [admin]);

  const updateAdmin = (newData) => {
    const updatedAdmin = { ...admin, ...newData };
    setAdmin(updatedAdmin);
    localStorage.setItem('admin', JSON.stringify(updatedAdmin));
  };

  return (
    <AdminContext.Provider value={{ admin, updateAdmin, loading }}>
      {children}
    </AdminContext.Provider>
  );
};
