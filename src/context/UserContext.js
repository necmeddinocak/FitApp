import React, { createContext, useState, useEffect, useContext } from 'react';
import { initializeUser, getUserId } from '../utils/deviceId';
import { supabase } from '../config/supabase';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Kullanıcıyı başlat
  useEffect(() => {
    initUser();
  }, []);

  const initUser = async () => {
    try {
      setLoading(true);
      setError(null);

      // Kullanıcıyı başlat veya mevcut olanı al
      let id = await getUserId();
      
      if (!id) {
        id = await initializeUser();
      }

      setUserId(id);

      // Kullanıcı bilgilerini çek
      await fetchUserData(id);
    } catch (err) {
      console.error('Init user error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async (id) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setUserData(data);
    } catch (err) {
      console.error('Fetch user data error:', err);
    }
  };

  const updateUserData = async (updates) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      setUserData(data);
      return data;
    } catch (err) {
      console.error('Update user data error:', err);
      throw err;
    }
  };

  const refreshUserData = async () => {
    if (userId) {
      await fetchUserData(userId);
    }
  };

  const value = {
    userId,
    userData,
    loading,
    error,
    updateUserData,
    refreshUserData,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

