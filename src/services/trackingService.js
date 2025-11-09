import { supabase } from '../config/supabase';

/**
 * Ağırlık kaydet
 */
export const saveWeightTracking = async (userId, tracking) => {
  const { data, error } = await supabase
    .from('weight_tracking')
    .insert({
      user_id: userId,
      workout_date: new Date().toISOString().split('T')[0],
      ...tracking,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Egzersiz için ağırlık geçmişini getir
 */
export const getWeightTrackingHistory = async (userId, exerciseId, limit = 20) => {
  const { data, error } = await supabase
    .from('weight_tracking')
    .select(`
      *,
      exercise:exercise_library (name, muscle_group)
    `)
    .eq('user_id', userId)
    .eq('exercise_id', exerciseId)
    .order('workout_date', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
};

/**
 * Son ağırlık kayıtlarını getir (tüm egzersizler)
 */
export const getRecentWeightTracking = async (userId, limit = 10) => {
  const { data, error } = await supabase
    .from('weight_tracking')
    .select(`
      *,
      exercise:exercise_library (name, muscle_group)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
};

/**
 * Kilo kaydet
 */
export const saveBodyWeight = async (userId, weight, notes = null) => {
  const { data, error } = await supabase
    .from('body_weight_tracking')
    .insert({
      user_id: userId,
      weight: weight,
      measurement_date: new Date().toISOString().split('T')[0],
      notes: notes,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Kilo geçmişini getir
 */
export const getBodyWeightHistory = async (userId, startDate = null, endDate = null) => {
  let query = supabase
    .from('body_weight_tracking')
    .select('*')
    .eq('user_id', userId)
    .order('measurement_date', { ascending: false });

  if (startDate) {
    query = query.gte('measurement_date', startDate);
  }
  if (endDate) {
    query = query.lte('measurement_date', endDate);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
};

/**
 * Son 7 günlük kilo ortalaması
 */
export const getWeeklyWeightAverage = async (userId) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const { data, error } = await supabase
    .from('body_weight_tracking')
    .select('weight')
    .eq('user_id', userId)
    .gte('measurement_date', sevenDaysAgo.toISOString().split('T')[0]);

  if (error) throw error;

  if (data.length === 0) return null;

  const average = data.reduce((sum, item) => sum + parseFloat(item.weight), 0) / data.length;
  return Math.round(average * 10) / 10;
};

/**
 * E1RM hesapla
 */
export const calculateE1RM = (weight, reps) => {
  // Epley formülü: weight * (1 + reps/30)
  return Math.round(weight * (1 + reps / 30) * 10) / 10;
};

/**
 * PR (Personal Record) getir
 */
export const getPersonalRecord = async (userId, exerciseId) => {
  const { data, error } = await supabase
    .from('weight_tracking')
    .select('*')
    .eq('user_id', userId)
    .eq('exercise_id', exerciseId)
    .order('e1rm', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

/**
 * Ağırlık kaydını güncelle
 */
export const updateWeightTracking = async (trackingId, updates) => {
  const { data, error } = await supabase
    .from('weight_tracking')
    .update(updates)
    .eq('id', trackingId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Ağırlık kaydını sil
 */
export const deleteWeightTracking = async (trackingId) => {
  const { error } = await supabase
    .from('weight_tracking')
    .delete()
    .eq('id', trackingId);

  if (error) throw error;
};

/**
 * Kilo kaydını güncelle
 */
export const updateBodyWeight = async (recordId, updates) => {
  const { data, error } = await supabase
    .from('body_weight_tracking')
    .update(updates)
    .eq('id', recordId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Kilo kaydını sil
 */
export const deleteBodyWeight = async (recordId) => {
  const { error } = await supabase
    .from('body_weight_tracking')
    .delete()
    .eq('id', recordId);

  if (error) throw error;
};

/**
 * Antrenman sıklığı istatistikleri (bu ay)
 */
export const getMonthlyWorkoutStats = async (userId) => {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  
  const { data, error } = await supabase
    .from('workout_sessions')
    .select('*')
    .eq('user_id', userId)
    .gte('workout_date', startOfMonth.toISOString().split('T')[0])
    .eq('completed', true);

  if (error) throw error;

  return {
    totalWorkouts: data.length,
    totalDuration: data.reduce((sum, session) => sum + (session.duration_minutes || 0), 0),
    totalSets: data.reduce((sum, session) => sum + (session.total_sets || 0), 0),
  };
};

/**
 * Takvim verisi (heatmap için)
 */
export const getWorkoutCalendar = async (userId, year, month) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  const { data, error } = await supabase
    .from('workout_sessions')
    .select('workout_date')
    .eq('user_id', userId)
    .eq('completed', true)
    .gte('workout_date', startDate.toISOString().split('T')[0])
    .lte('workout_date', endDate.toISOString().split('T')[0]);

  if (error) throw error;

  // Tarihleri date object'ine çevir
  return data.map(item => item.workout_date);
};

/**
 * Streak hesapla
 */
export const getCurrentStreak = async (userId) => {
  const { data, error } = await supabase
    .rpc('calculate_user_streak', { p_user_id: userId });

  if (error) throw error;
  return data || 0;
};

/**
 * En uzun streak getir
 */
export const getLongestStreak = async (userId) => {
  const { data, error } = await supabase
    .from('workout_sessions')
    .select('workout_date')
    .eq('user_id', userId)
    .eq('completed', true)
    .order('workout_date', { ascending: true });

  if (error) throw error;
  if (!data || data.length === 0) return 0;

  let longestStreak = 1;
  let currentStreak = 1;
  let previousDate = new Date(data[0].workout_date);

  for (let i = 1; i < data.length; i++) {
    const currentDate = new Date(data[i].workout_date);
    const diffDays = Math.floor((currentDate - previousDate) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else if (diffDays > 1) {
      currentStreak = 1;
    }

    previousDate = currentDate;
  }

  return longestStreak;
};

