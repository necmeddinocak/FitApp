import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../config/supabase';

const DEVICE_ID_KEY = '@fitness_device_id';
const USER_ID_KEY = '@fitness_user_id';

/**
 * Device ID'yi al veya oluştur
 */
export const getOrCreateDeviceId = async () => {
  try {
    let deviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);
    
    if (!deviceId) {
      deviceId = generateRandomId();
      await AsyncStorage.setItem(DEVICE_ID_KEY, deviceId);
      console.log('New device ID created:', deviceId);
    }
    
    return deviceId;
  } catch (error) {
    console.error('Device ID error:', error);
    return generateRandomId();
  }
};

/**
 * Kullanıcıyı başlat (uygulama açılışında)
 */
export const initializeUser = async () => {
  try {
    const deviceId = await getOrCreateDeviceId();
    
    // Supabase'de kullanıcıyı bul veya oluştur
    const { data, error } = await supabase
      .rpc('get_or_create_user', { p_device_id: deviceId });
    
    if (error) {
      console.error('User initialization error:', error);
      throw error;
    }
    
    // User ID'yi kaydet
    await AsyncStorage.setItem(USER_ID_KEY, data);
    
    console.log('User initialized:', data);
    return data; // user_id
  } catch (error) {
    console.error('User initialization failed:', error);
    throw error;
  }
};

/**
 * Mevcut user ID'yi al
 */
export const getUserId = async () => {
  try {
    const userId = await AsyncStorage.getItem(USER_ID_KEY);
    return userId;
  } catch (error) {
    console.error('Get user ID error:', error);
    return null;
  }
};

/**
 * Device ID'yi al
 */
export const getDeviceId = async () => {
  try {
    const deviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);
    return deviceId;
  } catch (error) {
    console.error('Get device ID error:', error);
    return null;
  }
};

/**
 * Kullanıcı verilerini temizle (çıkış veya sıfırlama için)
 */
export const clearUserData = async () => {
  try {
    await AsyncStorage.multiRemove([DEVICE_ID_KEY, USER_ID_KEY]);
    console.log('User data cleared');
  } catch (error) {
    console.error('Clear user data error:', error);
  }
};

/**
 * Random UUID v4 oluştur
 */
const generateRandomId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

