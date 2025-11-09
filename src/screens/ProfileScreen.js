import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Text, Button, Input, Modal, Badge } from '../components/common';
import { COLORS, SPACING, RADIUS, SHADOWS, TYPOGRAPHY } from '../constants/theme';
import { useUser } from '../context';
import { userService } from '../services';

// Hedef ikonları
const GOAL_ICONS = {
  weight: 'scale-outline',
  body_fat: 'analytics-outline',
  weekly_workout: 'fitness-outline',
};

// Hedef başlıkları
const GOAL_TITLES = {
  weight: 'Hedef Kilo',
  body_fat: 'Yağ Oranı',
  weekly_workout: 'Haftalık Antrenman',
};

// Rozet renkleri
const ACHIEVEMENT_COLORS = {
  '7_day_streak': COLORS.warning,
  'first_workout': COLORS.success,
  '50_workouts': COLORS.primary,
  '100_workouts': COLORS.secondary,
};

export const ProfileScreen = () => {
  const { userId } = useUser();

  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);

  // Data states
  const [userData, setUserData] = useState(null);
  const [goalsData, setGoalsData] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [settings, setSettings] = useState(null);
  const [syncCode, setSyncCode] = useState(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formCurrentValue, setFormCurrentValue] = useState('');
  const [formTargetValue, setFormTargetValue] = useState('');

  // Veri yükleme
  useEffect(() => {
    if (userId) {
      loadData();
    }
  }, [userId]);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Profil verileri yükleniyor...');

      const [user, goals, userAchievements, userSettings] = await Promise.all([
        userService.getUserProfile(userId),
        userService.getUserGoals(userId),
        userService.getUserAchievements(userId),
        userService.getUserSettings(userId),
      ]);

      setUserData(user);
      setGoalsData(goals);
      setAchievements(userAchievements);
      setSettings(userSettings);

      console.log('✅ Profil verileri yüklendi:', {
        user: user?.name,
        goalsCount: goals.length,
        achievementsCount: userAchievements.length,
      });
    } catch (error) {
      console.error('❌ Profil veri yükleme hatası:', error);
      Alert.alert('Hata', 'Veriler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  // Profil güncelleme
  const handleSaveProfile = async () => {
    try {
      setLoading(true);

      await userService.updateUserProfile(userId, {
        name: formName,
        email: formEmail,
      });

      Alert.alert('✅ Başarılı!', 'Profil güncellendi');
      setShowEditModal(false);
      loadData();
    } catch (error) {
      console.error('Profil güncelleme hatası:', error);
      Alert.alert('Hata', 'Profil güncellenemedi');
    } finally {
      setLoading(false);
    }
  };

  // Hedef güncelleme
  const handleSaveGoal = async () => {
    try {
      if (!selectedGoal || !formCurrentValue || !formTargetValue) {
        Alert.alert('Uyarı', 'Lütfen tüm alanları doldurun');
        return;
      }

      setLoading(true);

      const currentValue = parseFloat(formCurrentValue);
      const targetValue = parseFloat(formTargetValue);

      await userService.updateUserGoal(selectedGoal.id, {
        current_value: currentValue,
        target_value: targetValue,
      });

      Alert.alert('✅ Başarılı!', 'Hedef güncellendi');
      setShowGoalModal(false);
      loadData();
    } catch (error) {
      console.error('Hedef güncelleme hatası:', error);
      Alert.alert('Hata', 'Hedef güncellenemedi');
    } finally {
      setLoading(false);
    }
  };

  // Ayar güncelleme
  const handleUpdateSettings = async (updates) => {
    try {
      await userService.updateUserSettings(userId, updates);
      setSettings({ ...settings, ...updates });
    } catch (error) {
      console.error('Ayar güncelleme hatası:', error);
      Alert.alert('Hata', 'Ayarlar güncellenemedi');
    }
  };

  // Sync code oluştur
  const handleGenerateSyncCode = async () => {
    try {
      setLoading(true);
      const code = await userService.generateSyncCode(userId);
      setSyncCode(code);
      setShowSyncModal(true);
    } catch (error) {
      console.error('Sync code oluşturma hatası:', error);
      Alert.alert('Hata', 'Senkronizasyon kodu oluşturulamadı');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Çıkış yapmak istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Çıkış Yap', style: 'destructive', onPress: () => console.log('Logout') },
      ]
    );
  };

  const handleEditGoal = (goal) => {
    setSelectedGoal(goal);
    setFormCurrentValue(goal.current_value.toString());
    setFormTargetValue(goal.target_value.toString());
    setShowGoalModal(true);
  };

  const handleOpenEditModal = () => {
    setFormName(userData?.name || '');
    setFormEmail(userData?.email || '');
    setShowEditModal(true);
  };

  // Üyelik tarihini formatla
  const formatMemberSince = (dateString) => {
    if (!dateString) return 'Yeni Üye';
    const date = new Date(dateString);
    const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
                    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  if (loading && !userData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text variant="body" style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profil Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={48} color={COLORS.surface} />
            </View>
            <TouchableOpacity style={styles.avatarEdit}>
              <Ionicons name="camera" size={16} color={COLORS.surface} />
            </TouchableOpacity>
          </View>

          <Text variant="heading2" style={styles.userName}>
            {userData?.name || 'Kullanıcı'}
          </Text>
          <Text variant="body" color={COLORS.textSecondary}>
            {userData?.email || 'E-posta yok'}
          </Text>
          <Badge 
            label={`Üye: ${formatMemberSince(userData?.member_since)}`} 
            variant="primary" 
            style={styles.memberBadge} 
          />

          <Button
            title="Profili Düzenle"
            variant="outline"
            size="small"
            icon={<Ionicons name="create-outline" size={18} color={COLORS.primary} />}
            onPress={handleOpenEditModal}
            style={styles.editButton}
          />
        </View>

        {/* Hedefler */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="heading3">Hedeflerim</Text>
            <TouchableOpacity>
              <Text variant="caption" color={COLORS.primary}>Düzenle</Text>
            </TouchableOpacity>
          </View>

          {goalsData.length > 0 ? goalsData.map((goal) => {
            const progress = userService.calculateGoalProgress(
              goal.current_value, 
              goal.target_value, 
              goal.goal_type
            );

            return (
              <Card 
                key={goal.id} 
                style={styles.goalCard}
                onPress={() => handleEditGoal(goal)}
              >
                <View style={styles.goalHeader}>
                  <View style={styles.goalIcon}>
                    <Ionicons 
                      name={GOAL_ICONS[goal.goal_type] || 'trophy-outline'} 
                      size={24} 
                      color={COLORS.primary} 
                    />
                  </View>
                  <View style={styles.goalInfo}>
                    <Text variant="body" weight="semibold">
                      {GOAL_TITLES[goal.goal_type] || goal.goal_type}
                    </Text>
                    <Text variant="caption" color={COLORS.textSecondary}>
                      {goal.current_value} {goal.unit} → {goal.target_value} {goal.unit}
                    </Text>
                  </View>
                  <Text variant="heading3" color={COLORS.primary}>
                    {progress}%
                  </Text>
                </View>

                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${progress}%` }]} />
                </View>
              </Card>
            );
          }) : (
            <Text variant="body" color={COLORS.textSecondary} style={{textAlign: 'center', padding: SPACING.lg}}>
              Henüz hedef yok
            </Text>
          )}
        </View>

        {/* Başarılar */}
        <View style={styles.section}>
          <Text variant="heading3" style={styles.sectionTitle}>Rozetler & Başarılar</Text>
          
          <View style={styles.achievementsGrid}>
            {achievements.length > 0 ? achievements.map((achievement) => {
              const color = ACHIEVEMENT_COLORS[achievement.achievement_type] || COLORS.primary;
              
              return (
                <Card 
                  key={achievement.id}
                  style={[
                    styles.achievementCard,
                    !achievement.is_unlocked && styles.achievementCardLocked
                  ]}
                >
                  <View style={[
                    styles.achievementIcon,
                    { backgroundColor: color + '20' }
                  ]}>
                    <Ionicons 
                      name={achievement.icon_name || 'trophy'} 
                      size={32} 
                      color={achievement.is_unlocked ? color : COLORS.textLight} 
                    />
                  </View>
                  <Text 
                    variant="caption" 
                    style={styles.achievementTitle}
                    color={achievement.is_unlocked ? COLORS.text : COLORS.textLight}
                  >
                    {achievement.title}
                  </Text>
                  {achievement.is_unlocked && (
                    <Ionicons 
                      name="checkmark-circle" 
                      size={16} 
                      color={COLORS.success} 
                      style={styles.achievementCheck}
                    />
                  )}
                </Card>
              );
            }) : (
              <Text variant="body" color={COLORS.textSecondary} style={{textAlign: 'center', padding: SPACING.lg, width: '100%'}}>
                Henüz rozet yok
              </Text>
            )}
          </View>
        </View>

        {/* Ayarlar */}
        <View style={styles.section}>
          <Text variant="heading3" style={styles.sectionTitle}>Ayarlar</Text>

          {/* Tema */}
          <Card style={styles.settingCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons name="moon-outline" size={24} color={COLORS.primary} />
                <View style={styles.settingInfo}>
                  <Text variant="body" weight="semibold">Tema</Text>
                  <Text variant="caption" color={COLORS.textSecondary}>
                    {settings?.theme === 'system' ? 'Sistem' : settings?.theme === 'dark' ? 'Karanlık' : 'Açık'}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
            </View>
          </Card>

          {/* Ölçü Birimleri */}
          <Card style={styles.settingCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons name="calculator-outline" size={24} color={COLORS.secondary} />
                <View style={styles.settingInfo}>
                  <Text variant="body" weight="semibold">Ölçü Birimleri</Text>
                  <Text variant="caption" color={COLORS.textSecondary}>
                    {settings?.unit_system === 'metric' ? 'Metrik (kg, cm)' : 'İmperial (lbs, inch)'}
                  </Text>
                </View>
              </View>
              <View style={styles.unitToggle}>
                <TouchableOpacity
                  style={[styles.unitButton, settings?.unit_system === 'metric' && styles.unitButtonActive]}
                  onPress={() => handleUpdateSettings({ unit_system: 'metric' })}
                >
                  <Text 
                    variant="caption" 
                    weight="semibold"
                    color={settings?.unit_system === 'metric' ? COLORS.surface : COLORS.textSecondary}
                  >
                    KG
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.unitButton, settings?.unit_system === 'imperial' && styles.unitButtonActive]}
                  onPress={() => handleUpdateSettings({ unit_system: 'imperial' })}
                >
                  <Text 
                    variant="caption" 
                    weight="semibold"
                    color={settings?.unit_system === 'imperial' ? COLORS.surface : COLORS.textSecondary}
                  >
                    LBS
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Card>

          {/* Bildirimler */}
          <Card style={styles.settingCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons name="notifications-outline" size={24} color={COLORS.warning} />
                <View style={styles.settingInfo}>
                  <Text variant="body" weight="semibold">Bildirimler</Text>
                  <Text variant="caption" color={COLORS.textSecondary}>
                    Antrenman hatırlatmaları
                  </Text>
                </View>
              </View>
              <TouchableOpacity 
                style={[
                  styles.toggle,
                  settings?.notifications_enabled && styles.toggleActive
                ]}
                onPress={() => handleUpdateSettings({ 
                  notifications_enabled: !settings?.notifications_enabled 
                })}
              >
                <View style={[
                  styles.toggleThumb,
                  settings?.notifications_enabled && styles.toggleThumbActive
                ]} />
              </TouchableOpacity>
            </View>
          </Card>
        </View>

        {/* Veri Yönetimi */}
        <View style={styles.section}>
          <Text variant="heading3" style={styles.sectionTitle}>Verilerim</Text>

          <Card style={styles.dataCard}>
            <TouchableOpacity style={styles.dataItem}>
              <Ionicons name="cloud-download-outline" size={24} color={COLORS.info} />
              <Text variant="body" weight="semibold" style={styles.dataText}>
                Verileri İçe Aktar
              </Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
            </TouchableOpacity>

            <View style={styles.dataDivider} />

            <TouchableOpacity style={styles.dataItem}>
              <Ionicons name="cloud-upload-outline" size={24} color={COLORS.success} />
              <Text variant="body" weight="semibold" style={styles.dataText}>
                Verileri Dışa Aktar
              </Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
            </TouchableOpacity>

            <View style={styles.dataDivider} />

            <TouchableOpacity 
              style={styles.dataItem}
              onPress={handleGenerateSyncCode}
            >
              <Ionicons name="sync-outline" size={24} color={COLORS.primary} />
              <Text variant="body" weight="semibold" style={styles.dataText}>
                Senkronizasyon
              </Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </Card>
        </View>

        {/* Yardım & Geri Bildirim */}
        <View style={styles.section}>
          <Text variant="heading3" style={styles.sectionTitle}>Destek</Text>

          <Card style={styles.supportCard}>
            <TouchableOpacity style={styles.supportItem}>
              <Ionicons name="help-circle-outline" size={24} color={COLORS.info} />
              <Text variant="body" style={styles.supportText}>
                Sıkça Sorulan Sorular
              </Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.supportItem}>
              <Ionicons name="chatbubble-outline" size={24} color={COLORS.secondary} />
              <Text variant="body" style={styles.supportText}>
                Geri Bildirim Gönder
              </Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.supportItem}>
              <Ionicons name="shield-checkmark-outline" size={24} color={COLORS.primary} />
              <Text variant="body" style={styles.supportText}>
                Gizlilik Politikası
              </Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.supportItem}>
              <Ionicons name="document-text-outline" size={24} color={COLORS.warning} />
              <Text variant="body" style={styles.supportText}>
                Kullanım Koşulları
              </Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </Card>
        </View>

        {/* Çıkış Yap */}
        <Button
          title="Çıkış Yap"
          variant="outline"
          icon={<Ionicons name="log-out-outline" size={20} color={COLORS.error} />}
          onPress={handleLogout}
          style={[styles.logoutButton, { borderColor: COLORS.error }]}
        />

        {/* Versiyon */}
        <Text variant="caption" color={COLORS.textLight} style={styles.version}>
          Versiyon 1.0.0
        </Text>

        {/* Alt Boşluk */}
        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Profil Düzenle Modal */}
      <Modal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Profili Düzenle"
      >
        <Input
          label="İsim"
          value={formName}
          onChangeText={setFormName}
          placeholder="İsminiz"
        />

        <Input
          label="E-posta"
          value={formEmail}
          onChangeText={setFormEmail}
          placeholder="E-posta adresiniz"
          keyboardType="email-address"
        />

        <View style={styles.modalActions}>
          <Button 
            title="İptal" 
            variant="outline" 
            onPress={() => setShowEditModal(false)}
            style={{ flex: 1, marginRight: SPACING.sm }}
          />
          <Button 
            title="Kaydet" 
            variant="primary"
            onPress={handleSaveProfile}
            disabled={loading}
            style={{ flex: 1 }}
          />
        </View>
      </Modal>

      {/* Hedef Düzenle Modal */}
      {selectedGoal && (
        <Modal
          visible={showGoalModal}
          onClose={() => setShowGoalModal(false)}
          title={`${GOAL_TITLES[selectedGoal.goal_type] || 'Hedef'} Düzenle`}
        >
          <View style={styles.goalModalContent}>
            <View style={styles.goalModalIcon}>
              <Ionicons 
                name={GOAL_ICONS[selectedGoal.goal_type] || 'trophy-outline'} 
                size={48} 
                color={COLORS.primary} 
              />
            </View>

            <Input
              label={`Mevcut ${GOAL_TITLES[selectedGoal.goal_type]}`}
              value={formCurrentValue}
              onChangeText={setFormCurrentValue}
              keyboardType="decimal-pad"
            />

            <Input
              label={`Hedef ${GOAL_TITLES[selectedGoal.goal_type]}`}
              value={formTargetValue}
              onChangeText={setFormTargetValue}
              keyboardType="decimal-pad"
            />

            <View style={styles.goalProgress}>
              <Text variant="caption" color={COLORS.textSecondary}>
                İlerleme
              </Text>
              <Text variant="heading2" color={COLORS.primary}>
                {userService.calculateGoalProgress(
                  parseFloat(formCurrentValue) || selectedGoal.current_value,
                  parseFloat(formTargetValue) || selectedGoal.target_value,
                  selectedGoal.goal_type
                )}%
              </Text>
            </View>

            <Button
              title="Kaydet"
              variant="primary"
              onPress={handleSaveGoal}
              disabled={loading}
            />
          </View>
        </Modal>
      )}

      {/* Senkronizasyon Modal */}
      <Modal
        visible={showSyncModal}
        onClose={() => setShowSyncModal(false)}
        title="Cihaz Senkronizasyonu"
      >
        <View style={styles.syncModalContent}>
          <Ionicons name="qr-code-outline" size={120} color={COLORS.primary} />
          
          <Text variant="heading2" color={COLORS.primary} style={styles.syncCode}>
            {syncCode}
          </Text>
          
          <Text variant="body" color={COLORS.textSecondary} style={styles.syncDescription}>
            Bu kodu diğer cihazınızdaki uygulamada girerek verilerinizi senkronize edebilirsiniz.
          </Text>

          <Button
            title="Tamam"
            variant="primary"
            onPress={() => setShowSyncModal(false)}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  profileHeader: {
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  avatarEdit: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.surface,
  },
  userName: {
    marginBottom: SPACING.xs,
  },
  memberBadge: {
    marginTop: SPACING.md,
  },
  editButton: {
    marginTop: SPACING.md,
  },
  section: {
    padding: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    marginBottom: SPACING.md,
  },
  goalCard: {
    marginBottom: SPACING.md,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  goalIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  goalInfo: {
    flex: 1,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.xs,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  achievementCard: {
    width: '47%',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    position: 'relative',
  },
  achievementCardLocked: {
    opacity: 0.5,
  },
  achievementIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  achievementTitle: {
    textAlign: 'center',
  },
  achievementCheck: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
  },
  settingCard: {
    marginBottom: SPACING.md,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
  },
  settingInfo: {
    flex: 1,
  },
  unitToggle: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: 2,
  },
  unitButton: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.sm,
  },
  unitButtonActive: {
    backgroundColor: COLORS.primary,
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.border,
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: COLORS.success,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    ...SHADOWS.small,
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  dataCard: {
    padding: 0,
  },
  dataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    padding: SPACING.md,
  },
  dataText: {
    flex: 1,
  },
  dataDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.md,
  },
  supportCard: {
    padding: 0,
  },
  supportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  supportText: {
    flex: 1,
  },
  logoutButton: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  version: {
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  bottomSpace: {
    height: SPACING.xl,
  },
  modalActions: {
    flexDirection: 'row',
    marginTop: SPACING.lg,
  },
  goalModalContent: {
    alignItems: 'center',
  },
  goalModalIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryLight + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  goalProgress: {
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: SPACING.md,
    color: COLORS.textSecondary,
  },
  syncModalContent: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  syncCode: {
    marginVertical: SPACING.xl,
    letterSpacing: 4,
  },
  syncDescription: {
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
});