import React, { useState } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Modal, Text, Input, Button } from './common';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { userService } from '../services';
import { getOrCreateDeviceId } from '../utils/deviceId';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_ID_KEY = '@fitness_user_id';

export const SyncModal = ({ visible, onClose, userId }) => {
  const [mode, setMode] = useState('generate'); // 'generate' or 'connect'
  const [syncCode, setSyncCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [loading, setLoading] = useState(false);

  // Sync code oluştur ve QR kod göster
  const handleGenerateCode = async () => {
    try {
      setLoading(true);
      const code = await userService.generateSyncCode(userId);
      setSyncCode(code);
    } catch (error) {
      console.error('Generate sync code error:', error);
      Alert.alert('Hata', 'Senkronizasyon kodu oluşturulamadı');
    } finally {
      setLoading(false);
    }
  };

  // Kod ile bağlan
  const handleConnect = async () => {
    if (!inputCode || inputCode.length !== 6) {
      Alert.alert('Uyarı', 'Lütfen 6 haneli kodu girin');
      return;
    }

    try {
      setLoading(true);
      
      // Kodu kullanarak kullanıcıyı bul
      const user = await userService.getUserBySyncCode(inputCode.toUpperCase());
      
      if (!user) {
        Alert.alert('Hata', 'Geçersiz kod');
        return;
      }

      // Mevcut cihaz ID'sini al
      const deviceId = await getOrCreateDeviceId();
      
      // Cihazı kullanıcıya ekle
      await userService.addDevice(user.id, deviceId, 'New Device');
      
      // User ID'yi kaydet
      await AsyncStorage.setItem(USER_ID_KEY, user.id);
      
      Alert.alert(
        'Başarılı',
        'Cihaz başarıyla senkronize edildi. Uygulama yeniden başlatılacak.',
        [
          {
            text: 'Tamam',
            onPress: () => {
              onClose();
              // Uygulama yeniden başlatılmalı (expo için Updates.reloadAsync() kullanılabilir)
            },
          },
        ]
      );
    } catch (error) {
      console.error('Connect with sync code error:', error);
      Alert.alert('Hata', 'Bağlantı kurulamadı');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} onClose={onClose} title="Cihaz Senkronizasyonu">
      <View style={styles.container}>
        {/* Mode Selection */}
        <View style={styles.modeSelector}>
          <Button
            title="Kod Oluştur"
            variant={mode === 'generate' ? 'primary' : 'outline'}
            size="small"
            onPress={() => setMode('generate')}
            style={styles.modeButton}
          />
          <Button
            title="Kod Gir"
            variant={mode === 'connect' ? 'primary' : 'outline'}
            size="small"
            onPress={() => setMode('connect')}
            style={styles.modeButton}
          />
        </View>

        {/* Generate Mode */}
        {mode === 'generate' && (
          <View style={styles.generateSection}>
            {!syncCode ? (
              <>
                <Text variant="body" style={styles.description}>
                  Yeni cihazınızda bu kodu tarayarak verilerinizi senkronize edebilirsiniz.
                </Text>
                <Button
                  title="Kod Oluştur"
                  variant="primary"
                  onPress={handleGenerateCode}
                  loading={loading}
                  style={styles.generateButton}
                />
              </>
            ) : (
              <>
                <View style={styles.qrContainer}>
                  <QRCode
                    value={syncCode}
                    size={200}
                    backgroundColor={COLORS.surface}
                    color={COLORS.text}
                  />
                </View>
                <View style={styles.codeDisplay}>
                  <Text variant="heading2" style={styles.code}>
                    {syncCode}
                  </Text>
                </View>
                <Text variant="caption" style={styles.codeHint} color={COLORS.textSecondary}>
                  Bu kodu yeni cihazınızda girin veya QR kodu taratın
                </Text>
                <Text variant="caption" style={styles.warning} color={COLORS.warning}>
                  ⚠️ Bu kodu kimseyle paylaşmayın!
                </Text>
              </>
            )}
          </View>
        )}

        {/* Connect Mode */}
        {mode === 'connect' && (
          <View style={styles.connectSection}>
            <Text variant="body" style={styles.description}>
              Diğer cihazınızda oluşturduğunuz 6 haneli kodu girin.
            </Text>
            <Input
              label="Senkronizasyon Kodu"
              placeholder="ABC123"
              value={inputCode}
              onChangeText={(text) => setInputCode(text.toUpperCase())}
              maxLength={6}
              autoCapitalize="characters"
              style={styles.input}
            />
            <Button
              title="Bağlan"
              variant="primary"
              onPress={handleConnect}
              loading={loading}
              disabled={inputCode.length !== 6}
              style={styles.connectButton}
            />
          </View>
        )}

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.md,
  },
  modeSelector: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  modeButton: {
    flex: 1,
  },
  generateSection: {
    alignItems: 'center',
  },
  description: {
    textAlign: 'center',
    marginBottom: SPACING.lg,
    color: COLORS.textSecondary,
  },
  generateButton: {
    minWidth: 200,
  },
  qrContainer: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  codeDisplay: {
    backgroundColor: COLORS.primaryLight + '20',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
  },
  code: {
    letterSpacing: 4,
    textAlign: 'center',
    color: COLORS.primary,
  },
  codeHint: {
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  warning: {
    textAlign: 'center',
    fontWeight: '600',
  },
  connectSection: {
    width: '100%',
  },
  input: {
    marginBottom: SPACING.lg,
  },
  connectButton: {
    width: '100%',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.md,
  },
});

