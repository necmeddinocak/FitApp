import React, { createContext, useState, useContext, useCallback } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // Workout Programs
  const [workoutPrograms, setWorkoutPrograms] = useState([]);
  const [activeProgram, setActiveProgram] = useState(null);

  // Weight Tracking
  const [weightTracking, setWeightTracking] = useState([]);
  
  // Body Weight Tracking
  const [bodyWeightTracking, setBodyWeightTracking] = useState([]);
  
  // Workout Sessions
  const [workoutSessions, setWorkoutSessions] = useState([]);
  
  // Motivational Quotes
  const [motivationalQuotes, setMotivationalQuotes] = useState([]);
  
  // User Goals
  const [userGoals, setUserGoals] = useState([]);
  
  // User Achievements
  const [userAchievements, setUserAchievements] = useState([]);
  
  // User Settings
  const [userSettings, setUserSettings] = useState(null);

  // Exercise Library (global)
  const [exerciseLibrary, setExerciseLibrary] = useState([]);
  
  // Workout Templates (global + user's)
  const [workoutTemplates, setWorkoutTemplates] = useState([]);

  // Loading states
  const [loadingStates, setLoadingStates] = useState({});

  // Update loading state for a specific key
  const setLoading = useCallback((key, value) => {
    setLoadingStates(prev => ({ ...prev, [key]: value }));
  }, []);

  // Refresh functions (to be called from services)
  const refreshWorkoutPrograms = useCallback((data) => {
    setWorkoutPrograms(data);
  }, []);

  const refreshWeightTracking = useCallback((data) => {
    setWeightTracking(data);
  }, []);

  const refreshBodyWeightTracking = useCallback((data) => {
    setBodyWeightTracking(data);
  }, []);

  const refreshWorkoutSessions = useCallback((data) => {
    setWorkoutSessions(data);
  }, []);

  const refreshMotivationalQuotes = useCallback((data) => {
    setMotivationalQuotes(data);
  }, []);

  const refreshUserGoals = useCallback((data) => {
    setUserGoals(data);
  }, []);

  const refreshUserAchievements = useCallback((data) => {
    setUserAchievements(data);
  }, []);

  const refreshUserSettings = useCallback((data) => {
    setUserSettings(data);
  }, []);

  const refreshExerciseLibrary = useCallback((data) => {
    setExerciseLibrary(data);
  }, []);

  const refreshWorkoutTemplates = useCallback((data) => {
    setWorkoutTemplates(data);
  }, []);

  const value = {
    // Data
    workoutPrograms,
    activeProgram,
    weightTracking,
    bodyWeightTracking,
    workoutSessions,
    motivationalQuotes,
    userGoals,
    userAchievements,
    userSettings,
    exerciseLibrary,
    workoutTemplates,
    
    // Setters
    setActiveProgram,
    
    // Refresh functions
    refreshWorkoutPrograms,
    refreshWeightTracking,
    refreshBodyWeightTracking,
    refreshWorkoutSessions,
    refreshMotivationalQuotes,
    refreshUserGoals,
    refreshUserAchievements,
    refreshUserSettings,
    refreshExerciseLibrary,
    refreshWorkoutTemplates,
    
    // Loading states
    loadingStates,
    setLoading,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

