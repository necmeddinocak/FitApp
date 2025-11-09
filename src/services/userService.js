import { supabase } from '../config/supabase';

/**
 * Kullanıcı profil bilgilerini getir
 */
export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
};

/**
 * Kullanıcı profilini güncelle
 */
export const updateUserProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Kullanıcı hedeflerini getir
 */
export const getUserGoals = async (userId) => {
  const { data, error } = await supabase
    .from('user_goals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
};

/**
 * Kullanıcı hedefini güncelle
 */
export const updateUserGoal = async (goalId, updates) => {
  const { data, error } = await supabase
    .from('user_goals')
    .update(updates)
    .eq('id', goalId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Hedef ilerlemesini hesapla
 */
export const calculateGoalProgress = (current, target, goalType) => {
  // Kilo ve yağ oranı için azalma hedefi
  if (goalType === 'weight' || goalType === 'body_fat') {
    if (current <= target) return 100;
    const diff = current - target;
    const progress = ((current - target) / current) * 100;
    return Math.max(0, Math.min(100, Math.round(progress)));
  }
  
  // Haftalık antrenman için artış hedefi
  if (goalType === 'weekly_workout') {
    if (current >= target) return 100;
    const progress = (current / target) * 100;
    return Math.max(0, Math.min(100, Math.round(progress)));
  }
  
  return 0;
};

/**
 * Kullanıcı başarılarını getir
 */
export const getUserAchievements = async (userId) => {
  const { data, error } = await supabase
    .from('user_achievements')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
};

/**
 * Kullanıcı ayarlarını getir
 */
export const getUserSettings = async (userId) => {
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

/**
 * Kullanıcı ayarlarını güncelle
 */
export const updateUserSettings = async (userId, updates) => {
  // Önce mevcut ayarları kontrol et
  const { data: existing } = await supabase
    .from('user_settings')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (existing) {
    // Güncelle
    const { data, error } = await supabase
      .from('user_settings')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } else {
    // Oluştur
    const { data, error } = await supabase
      .from('user_settings')
      .insert({ user_id: userId, ...updates })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

/**
 * Sync code oluştur
 */
export const generateSyncCode = async (userId) => {
  // Supabase function'ını çağır
  const { data: code, error: codeError } = await supabase.rpc('generate_sync_code');
  
  if (codeError) throw codeError;

  // Kullanıcıya sync code'u ekle
  const { data, error } = await supabase
    .from('users')
    .update({ sync_code: code })
    .eq('id', userId)
    .select('sync_code')
    .single();

  if (error) throw error;
  return data.sync_code;
};

/**
 * Sync code ile kullanıcı bul ve bağlan
 */
export const connectWithSyncCode = async (syncCode, newDeviceId) => {
  // Sync code ile kullanıcıyı bul
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('sync_code', syncCode)
    .single();

  if (userError) throw userError;

  // Yeni cihazı kaydet
  const { error: syncError } = await supabase
    .from('device_sync')
    .insert({
      user_id: user.id,
      device_id: newDeviceId,
      device_name: 'New Device',
    });

  if (syncError) throw syncError;

  return user.id;
};

/**
 * Kullanıcının tüm cihazlarını getir
 */
export const getUserDevices = async (userId) => {
  const { data, error } = await supabase
    .from('device_sync')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('last_sync_at', { ascending: false });

  if (error) throw error;
  return data;
};

/**
 * Cihazı sil/deaktif et
 */
export const removeDevice = async (deviceId) => {
  const { error } = await supabase
    .from('device_sync')
    .update({ is_active: false })
    .eq('id', deviceId);

  if (error) throw error;
};

/**
 * Son senkronizasyon zamanını güncelle
 */
export const updateLastSync = async (userId, deviceId) => {
  const { error } = await supabase
    .from('device_sync')
    .update({ last_sync_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('device_id', deviceId);

  if (error) throw error;
};
