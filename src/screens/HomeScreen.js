import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Text, Button } from '../components/common';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/theme';
import { useUser } from '../context';
import { workoutService, trackingService, motivationService, userService, BannerAd, BannerAdSize, adMobService } from '../services';
import { useNavigation } from '@react-navigation/native';

export const HomeScreen = () => {
  const navigation = useNavigation();
  const { userId } = useUser();

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [todayWorkout, setTodayWorkout] = useState(null);
  const [weeklyStats, setWeeklyStats] = useState(null);
  const [currentBodyWeight, setCurrentBodyWeight] = useState(null);
  const [targetWeight, setTargetWeight] = useState(null);
  const [recentLifts, setRecentLifts] = useState([]);
  const [quoteOfTheDay, setQuoteOfTheDay] = useState(null);

  useEffect(() => {
    if (userId) {
      loadData();
    }
  }, [userId]);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('🏠 Ana sayfa verileri yükleniyor...');

      // Paralel olarak tüm verileri çek
      const [
        userProfile,
        activeProgram,
        monthlyStats,
        bodyWeightData,
        goals,
        weightTracking,
        todayQuote,
      ] = await Promise.all([
        userService.getUserProfile(userId).catch(() => null),
        workoutService.getActiveProgram(userId).catch(() => null),
        trackingService.getMonthlyWorkoutStats(userId).catch(() => null),
        trackingService.getBodyWeightHistory(userId).catch(() => []),
        userService.getUserGoals(userId).catch(() => []),
        trackingService.getRecentWeightTracking(userId, 3).catch(() => []),
        motivationService.getQuoteOfTheDay(userId).catch(() => null),
      ]);

      setUserData(userProfile);
      setWeeklyStats(monthlyStats);
      setRecentLifts(weightTracking);
      setQuoteOfTheDay(todayQuote);

      // Kilo bilgileri
      if (bodyWeightData.length > 0) {
        setCurrentBodyWeight(bodyWeightData[0].weight);
      }
      
      // Hedef kilo
      const weightGoal = goals.find(g => g.goal_type === 'weight');
      if (weightGoal) {
        setTargetWeight(weightGoal.target_value);
      }

      // Bugünkü antrenman
      if (activeProgram && activeProgram.program_workouts) {
        const today = new Date().getDay(); // 0=Pazar, 1=Pzt, ..., 6=Cmt
        const todayIndex = today === 0 ? 7 : today; // Veritabanında 1=Pzt, 7=Pazar
        
        const todayWorkoutData = activeProgram.program_workouts.find(
          w => w.day_of_week === todayIndex
        );
        
        if (todayWorkoutData && todayWorkoutData.program_exercises) {
          setTodayWorkout(todayWorkoutData);
        }
      }

      console.log('✅ Ana sayfa verileri yüklendi');
    } catch (error) {
      console.error('❌ Ana sayfa veri yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysSinceDate = (dateString) => {
    if (!dateString) return 0;
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text variant="body" style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header / Selamlama */}
      <View style={styles.header}>
        <View>
          <Text variant="caption">Merhaba,</Text>
          <Text variant="heading2">
            {userData?.name ? userData.name.split(' ')[0] : 'Kullanıcı'} 👋
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profil')}>
          <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {/* AdMob Banner Reklam */}
      {Platform.OS !== 'web' && BannerAd && adMobService.getBannerAdUnitId() && (
        <View style={styles.adContainer}>
          <BannerAd
            unitId={adMobService.getBannerAdUnitId()}
            size={BannerAdSize.BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
          />
        </View>
      )}

      {/* Günün Hedefi Kartı */}
      {weeklyStats && (
        <Card style={styles.goalCard}>
          <Text variant="heading3" style={styles.sectionTitle}>Bu Ay</Text>
          <View style={styles.goalStats}>
            <View style={styles.goalItem}>
              <Ionicons name="calendar-outline" size={32} color={COLORS.primary} />
              <Text variant="heading3" style={styles.goalValue}>
                {weeklyStats.totalWorkouts || 0}
              </Text>
              <Text variant="caption">Antrenman</Text>
            </View>
            <View style={styles.goalItem}>
              <Ionicons name="barbell-outline" size={32} color={COLORS.secondary} />
              <Text variant="heading3" style={styles.goalValue}>
                {weeklyStats.totalSets || 0}
              </Text>
              <Text variant="caption">Set</Text>
            </View>
            <View style={styles.goalItem}>
              <Ionicons name="time-outline" size={32} color={COLORS.warning} />
              <Text variant="heading3" style={styles.goalValue}>
                {weeklyStats.totalDuration ? Math.round(weeklyStats.totalDuration / 60) : 0}
              </Text>
              <Text variant="caption">Saat</Text>
            </View>
          </View>
        </Card>
      )}

      {/* Bugünkü Antrenman */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text variant="heading3">Bugünkü Antrenman</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Program')}>
            <Text variant="caption" color={COLORS.primary}>Tümünü Gör</Text>
          </TouchableOpacity>
        </View>
        
        {todayWorkout ? (
          <Card>
            <View style={styles.workoutCard}>
              <View style={styles.workoutIcon}>
                <Ionicons name="fitness-outline" size={28} color={COLORS.primary} />
              </View>
              <View style={styles.workoutInfo}>
                <Text variant="body" weight="semibold">
                  {todayWorkout.workout_name || 'Antrenman'}
                </Text>
                <Text variant="caption">
                  {todayWorkout.program_exercises.length} egzersiz
                  {todayWorkout.program_exercises.length > 0 && ` • ${todayWorkout.program_exercises.length * 5}-${todayWorkout.program_exercises.length * 7} dakika`}
                </Text>
              </View>
            </View>
            <Button 
              title="Antrenmana Başla" 
              variant="primary"
              style={styles.startButton}
              icon={<Ionicons name="play-circle-outline" size={20} color={COLORS.surface} />}
              onPress={() => navigation.navigate('Program')}
            />
          </Card>
        ) : (
          <Card>
            <View style={styles.emptyWorkout}>
              <Ionicons name="calendar-outline" size={48} color={COLORS.textLight} />
              <Text variant="body" color={COLORS.textSecondary} style={{marginTop: SPACING.md}}>
                Bugün için program yok
              </Text>
              <Button 
                title="Program Oluştur" 
                variant="outline"
                size="small"
                style={{marginTop: SPACING.md}}
                onPress={() => navigation.navigate('Program')}
              />
            </View>
          </Card>
        )}
      </View>

      {/* Hızlı Kısayollar */}
      <View style={styles.section}>
        <Text variant="heading3" style={styles.sectionTitle}>Hızlı İşlemler</Text>
        <View style={styles.quickActions}>
          <Card style={styles.quickActionCard} onPress={() => navigation.navigate('Program')}>
            <Ionicons name="add-circle-outline" size={32} color={COLORS.primary} />
            <Text variant="caption" style={styles.quickActionText}>Program Ekle</Text>
          </Card>
          
          <Card style={styles.quickActionCard} onPress={() => navigation.navigate('Takip')}>
            <Ionicons name="scale-outline" size={32} color={COLORS.secondary} />
            <Text variant="caption" style={styles.quickActionText}>Kilo Gir</Text>
          </Card>
          
          <Card style={styles.quickActionCard} onPress={() => navigation.navigate('Takip')}>
            <Ionicons name="barbell-outline" size={32} color={COLORS.warning} />
            <Text variant="caption" style={styles.quickActionText}>Ağırlık Kaydet</Text>
          </Card>
        </View>
      </View>

      {/* İlerleme Özeti */}
      <View style={styles.section}>
        <Text variant="heading3" style={styles.sectionTitle}>Bu Hafta</Text>
        
        {/* Antrenman Sıklığı */}
        {weeklyStats && (
          <Card>
            <View style={styles.progressHeader}>
              <Text variant="body" weight="semibold">Bu Ay Antrenmanlar</Text>
              <Text variant="caption" color={COLORS.success}>
                {weeklyStats.totalWorkouts || 0} antrenman
              </Text>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statItemSmall}>
                <Ionicons name="time-outline" size={20} color={COLORS.primary} />
                <Text variant="caption">
                  {weeklyStats.totalDuration ? `${Math.round(weeklyStats.totalDuration / 60)}h` : '0h'}
                </Text>
              </View>
              <View style={styles.statItemSmall}>
                <Ionicons name="barbell-outline" size={20} color={COLORS.secondary} />
                <Text variant="caption">{weeklyStats.totalSets || 0} set</Text>
              </View>
              <View style={styles.statItemSmall}>
                <Ionicons name="calendar-outline" size={20} color={COLORS.warning} />
                <Text variant="caption">{weeklyStats.totalWorkouts || 0} gün</Text>
              </View>
            </View>
          </Card>
        )}

        {/* Kilo Takibi */}
        {(currentBodyWeight || targetWeight) && (
          <Card>
            <View style={styles.progressHeader}>
              <Text variant="body" weight="semibold">Kilo Takibi</Text>
              {currentBodyWeight && targetWeight && currentBodyWeight !== targetWeight && (
                <Text variant="caption" color={currentBodyWeight < targetWeight ? COLORS.warning : COLORS.success}>
                  {currentBodyWeight < targetWeight ? '+' : ''}{(currentBodyWeight - targetWeight).toFixed(1)} kg
                </Text>
              )}
            </View>
            <View style={styles.weightInfo}>
              <View style={styles.weightItem}>
                <Text variant="caption">Mevcut</Text>
                <Text variant="heading3" color={COLORS.primary}>
                  {currentBodyWeight ? `${currentBodyWeight} kg` : '-'}
                </Text>
              </View>
              <Ionicons name="arrow-forward" size={24} color={COLORS.textLight} />
              <View style={styles.weightItem}>
                <Text variant="caption">Hedef</Text>
                <Text variant="heading3" color={COLORS.secondary}>
                  {targetWeight ? `${targetWeight} kg` : '-'}
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* Son Ağırlıklar */}
        <Card>
          <Text variant="body" weight="semibold" style={styles.sectionSubtitle}>
            Son Kaldırdığım Ağırlıklar
          </Text>
          {recentLifts.length > 0 ? (
            <View style={styles.exerciseList}>
              {recentLifts.map((lift, index) => {
                const colors = [COLORS.primary, COLORS.secondary, COLORS.warning];
                const daysSince = getDaysSinceDate(lift.workout_date);
                
                return (
                  <View key={lift.id} style={styles.exerciseItem}>
                    <Ionicons name="barbell" size={20} color={colors[index % 3]} />
                    <View style={styles.exerciseDetails}>
                      <Text variant="body">{lift.exercise?.name || 'Egzersiz'}</Text>
                      <Text variant="caption">
                        {daysSince === 0 ? 'Bugün' : daysSince === 1 ? 'Dün' : `${daysSince} gün önce`}
                      </Text>
                    </View>
                    <Text variant="body" weight="bold">
                      {lift.weight}kg × {lift.reps}
                    </Text>
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyExercises}>
              <Text variant="caption" color={COLORS.textSecondary}>
                Henüz ağırlık kaydı yok
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Takip')}>
                <Text variant="caption" color={COLORS.primary} style={{marginTop: SPACING.xs}}>
                  İlk kaydını ekle
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Card>
      </View>

      {/* Motivasyon Kartı */}
      {quoteOfTheDay && (
        <TouchableOpacity onPress={() => navigation.navigate('Motivasyon')}>
          <Card style={styles.motivationCard}>
            <Ionicons name="flame" size={32} color={COLORS.warning} />
            <Text variant="body" weight="semibold" style={styles.motivationText}>
              "{quoteOfTheDay.quote}"
            </Text>
            <Text variant="caption">- {quoteOfTheDay.author || 'Anonim'}</Text>
            <Text variant="caption" color={COLORS.primary} style={{marginTop: SPACING.sm}}>
              Tümünü Gör →
            </Text>
          </Card>
        </TouchableOpacity>
      )}

      {/* Alt boşluk */}
      <View style={styles.bottomSpace} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  adContainer: {
    alignItems: 'center',
    marginVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.sm,
  },
  goalCard: {
    marginHorizontal: SPACING.lg,
    backgroundColor: COLORS.primaryLight,
  },
  sectionTitle: {
    marginBottom: SPACING.md,
  },
  goalStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SPACING.md,
  },
  goalItem: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  goalValue: {
    color: COLORS.text,
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
  workoutCard: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  workoutIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primaryLight + '30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  workoutInfo: {
    flex: 1,
    gap: SPACING.xs,
  },
  tags: {
    flexDirection: 'row',
    gap: SPACING.xs,
    marginTop: SPACING.xs,
  },
  tag: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    backgroundColor: COLORS.background,
    borderRadius: 4,
  },
  startButton: {
    marginTop: SPACING.xs,
  },
  quickActions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  quickActionCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    gap: SPACING.xs,
  },
  quickActionText: {
    textAlign: 'center',
    color: COLORS.text,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.xs,
  },
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCompleted: {
    backgroundColor: COLORS.success,
  },
  weightInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  weightItem: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  sectionSubtitle: {
    marginBottom: SPACING.md,
  },
  exerciseList: {
    gap: SPACING.md,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  exerciseDetails: {
    flex: 1,
  },
  motivationCard: {
    marginHorizontal: SPACING.lg,
    backgroundColor: COLORS.warning + '20',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  motivationText: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
  bottomSpace: {
    height: SPACING.xxl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingVertical: SPACING.xl * 3,
  },
  loadingText: {
    marginTop: SPACING.md,
    color: COLORS.textSecondary,
  },
  emptyWorkout: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SPACING.md,
  },
  statItemSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  emptyExercises: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
});

