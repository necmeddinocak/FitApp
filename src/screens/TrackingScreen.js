import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, TouchableOpacity, ActivityIndicator, Alert, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { Card, Text, Button, Input, Tabs, Modal, Badge } from '../components/common';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../constants/theme';
import { useUser, useData } from '../context';
import { trackingService } from '../services';

const { width } = Dimensions.get('window');

export const TrackingScreen = () => {
  const { userId } = useUser();
  const { exerciseLibrary, refreshExerciseLibrary } = useData();

  const [activeTab, setActiveTab] = useState('weight');
  const [showAddWeightModal, setShowAddWeightModal] = useState(false);
  const [showAddBodyWeightModal, setShowAddBodyWeightModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [unit, setUnit] = useState('kg');
  const [loading, setLoading] = useState(true);

  // Data states
  const [weightHistory, setWeightHistory] = useState([]);
  const [bodyWeightHistory, setBodyWeightHistory] = useState([]);
  const [personalRecord, setPersonalRecord] = useState(null);
  const [monthlyStats, setMonthlyStats] = useState(null);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [workoutDates, setWorkoutDates] = useState([]);
  const [currentBodyWeight, setCurrentBodyWeight] = useState(null);
  const [weeklyAverage, setWeeklyAverage] = useState(null);

  // Form states
  const [formWeight, setFormWeight] = useState('');
  const [formReps, setFormReps] = useState('');
  const [formRpe, setFormRpe] = useState(null);
  const [formBodyWeight, setFormBodyWeight] = useState('');
  const [formNotes, setFormNotes] = useState('');
  
  // Modal states
  const [showExercisePickerModal, setShowExercisePickerModal] = useState(false);
  
  // Calendar states
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // İlk egzersizi seç
  useEffect(() => {
    if (exerciseLibrary.length > 0 && !selectedExercise) {
      const benchPress = exerciseLibrary.find(ex => ex.name === 'Bench Press');
      setSelectedExercise(benchPress || exerciseLibrary[0]);
    }
  }, [exerciseLibrary]);

  // Veri yükle
  useEffect(() => {
    if (userId) {
      loadData();
    }
  }, [userId, selectedExercise, activeTab, currentMonth, currentYear]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Egzersiz kütüphanesi henüz yüklenmediyse yükle
      if (exerciseLibrary.length === 0) {
        const { workoutService } = require('../services');
        const exercises = await workoutService.getExerciseLibrary();
        refreshExerciseLibrary(exercises);
      }

      if (activeTab === 'weight' && selectedExercise) {
        // Ağırlık takibi verilerini yükle
        const [history, pr] = await Promise.all([
          trackingService.getWeightTrackingHistory(userId, selectedExercise.id, 10),
          trackingService.getPersonalRecord(userId, selectedExercise.id),
        ]);
        setWeightHistory(history || []);
        setPersonalRecord(pr);
      } else if (activeTab === 'bodyweight') {
        // Kilo takibi verilerini yükle
        const [history, average] = await Promise.all([
          trackingService.getBodyWeightHistory(userId),
          trackingService.getWeeklyWeightAverage(userId),
        ]);
        setBodyWeightHistory(history || []);
        setWeeklyAverage(average);
        if (history && history.length > 0) {
          setCurrentBodyWeight(history[0]);
        }
      } else if (activeTab === 'frequency') {
        // Sıklık verilerini yükle
        const [stats, streak, longest, dates] = await Promise.all([
          trackingService.getMonthlyWorkoutStats(userId),
          trackingService.getCurrentStreak(userId),
          trackingService.getLongestStreak(userId),
          trackingService.getWorkoutCalendar(userId, currentYear, currentMonth),
        ]);
        setMonthlyStats(stats);
        setCurrentStreak(streak);
        setLongestStreak(longest);
        setWorkoutDates(dates);
      }
    } catch (error) {
      console.error('Veri yükleme hatası:', error);
      Alert.alert('Hata', 'Veriler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  // Ağırlık kaydet
  const handleSaveWeight = async () => {
    try {
      if (!selectedExercise || !formWeight || !formReps) {
        Alert.alert('Uyarı', 'Lütfen tüm alanları doldurun');
        return;
      }

      setLoading(true);

      await trackingService.saveWeightTracking(userId, {
        exercise_id: selectedExercise.id,
        weight: parseFloat(formWeight),
        reps: parseInt(formReps),
        rpe: formRpe,
      });

      Alert.alert('✅ Başarılı!', 'Ağırlık kaydedildi');
      
      // Form'u temizle
      setFormWeight('');
      setFormReps('');
      setFormRpe(null);
      setShowAddWeightModal(false);
      
      // Verileri yenile
      loadData();
    } catch (error) {
      console.error('Ağırlık kaydetme hatası:', error);
      Alert.alert('Hata', 'Ağırlık kaydedilemedi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Kilo kaydet
  const handleSaveBodyWeight = async () => {
    try {
      if (!formBodyWeight) {
        Alert.alert('Uyarı', 'Lütfen kilonuzu girin');
        return;
      }

      setLoading(true);

      await trackingService.saveBodyWeight(userId, parseFloat(formBodyWeight), formNotes || null);

      Alert.alert('✅ Başarılı!', 'Kilo kaydedildi');
      
      // Form'u temizle
      setFormBodyWeight('');
      setFormNotes('');
      setShowAddBodyWeightModal(false);
      
      // Verileri yenile
      loadData();
    } catch (error) {
      console.error('Kilo kaydetme hatası:', error);
      Alert.alert('Hata', 'Kilo kaydedilemedi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Ay değiştirme fonksiyonları
  const handlePreviousMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Ayın gün sayısını hesapla
  const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  // Ay adlarını Türkçe göster
  const getMonthName = (month) => {
    const months = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];
    return months[month - 1];
  };

  // İlerlemeyi paylaş
  const handleShareProgress = async () => {
    try {
      const message = `💪 Bu Ay Antrenman İstatistiklerim\n\n` +
        `✅ Tamamlanan: ${monthlyStats?.totalWorkouts || 0} antrenman\n` +
        `⏱️ Toplam Süre: ${monthlyStats ? (monthlyStats.totalDuration / 60).toFixed(1) : 0} saat\n` +
        `🔥 Mevcut Seri: ${currentStreak} gün\n` +
        `🏆 En Uzun Seri: ${longestStreak} gün\n` +
        `💪 Toplam Set: ${monthlyStats?.totalSets || 0}\n\n` +
        `#fitness #workout #motivation`;

      await Share.share({ message });
    } catch (error) {
      console.log('Paylaşma hatası:', error);
    }
  };

      const tabs = [
    { key: 'weight', label: 'Ağırlık Takibi' },
    { key: 'bodyweight', label: 'Kilo Takibi' },
    { key: 'frequency', label: 'Sıklık' },
  ];

  const chartConfig = {
    backgroundColor: COLORS.surface,
    backgroundGradientFrom: COLORS.surface,
    backgroundGradientTo: COLORS.surface,
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(108, 92, 231, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(99, 110, 114, ${opacity})`,
    style: {
      borderRadius: RADIUS.md,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: COLORS.primary,
    },
  };

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Ağırlık Takibi */}
        {activeTab === 'weight' && (
          <>
            {/* Egzersiz Seçici */}
            <Card style={styles.exerciseSelector}>
              <Text variant="body" weight="semibold" style={styles.label}>
                Egzersiz Seç
              </Text>
              <TouchableOpacity 
                style={styles.exerciseSearch}
                onPress={() => setShowExercisePickerModal(true)}
              >
                <Ionicons name="search" size={20} color={COLORS.textLight} />
                <Text variant="body" style={styles.selectedExercise}>
                  {selectedExercise?.name || 'Egzersiz seçin'}
                </Text>
                <Ionicons name="chevron-down" size={20} color={COLORS.textLight} />
              </TouchableOpacity>
            </Card>

            {/* Grafik */}
            <Card>
              <View style={styles.chartHeader}>
                <Text variant="heading3">İlerleme Grafiği</Text>
                <View style={styles.unitToggle}>
                  <Text 
                    variant="caption" 
                    color={unit === 'kg' ? COLORS.primary : COLORS.textSecondary}
                    weight={unit === 'kg' ? 'bold' : 'regular'}
                    onPress={() => setUnit('kg')}
                  >
                    KG
                  </Text>
                  <Text variant="caption" color={COLORS.textLight}> / </Text>
                  <Text 
                    variant="caption" 
                    color={unit === 'lbs' ? COLORS.primary : COLORS.textSecondary}
                    weight={unit === 'lbs' ? 'bold' : 'regular'}
                    onPress={() => setUnit('lbs')}
                  >
                    LBS
                  </Text>
                </View>
              </View>

              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
              ) : weightHistory.length > 0 ? (
                <>
                  <LineChart
                    data={{
                      labels: weightHistory.slice(0, 7).reverse().map(item => 
                        new Date(item.workout_date).getDate().toString()
                      ),
                      datasets: [{
                        data: weightHistory.slice(0, 7).reverse().map(item => item.weight),
                      }],
                    }}
                    width={width - SPACING.lg * 4}
                    height={220}
                    chartConfig={chartConfig}
                    bezier
                    style={styles.chart}
                  />

                  {/* İstatistikler */}
                  <View style={styles.stats}>
                    <View style={styles.statBox}>
                      <Text variant="caption">Son</Text>
                      <Text variant="heading3" color={COLORS.primary}>
                        {weightHistory[0]?.weight || 0}kg
                      </Text>
                    </View>
                    <View style={styles.statBox}>
                      <Text variant="caption">PR (Kişisel Rekor)</Text>
                      <Text variant="heading3" color={COLORS.success}>
                        {personalRecord?.weight || 0}kg
                      </Text>
                    </View>
                    <View style={styles.statBox}>
                      <Text variant="caption">E1RM</Text>
                      <Text variant="heading3" color={COLORS.warning}>
                        {weightHistory[0]?.e1rm || 0}kg
                      </Text>
                    </View>
                  </View>
                </>
              ) : (
                <View style={styles.emptyState}>
                  <Ionicons name="barbell-outline" size={64} color={COLORS.textLight} />
                  <Text variant="body" color={COLORS.textSecondary} style={{marginTop: SPACING.md}}>
                    Henüz kayıt yok
                  </Text>
                </View>
              )}
            </Card>

            {/* Son Kayıtlar */}
            <Card>
              <Text variant="heading3" style={styles.sectionTitle}>Son Kayıtlar</Text>
              
              {weightHistory.length > 0 ? weightHistory.map((record, index) => (
                <View key={record.id || index} style={styles.recordItem}>
                  <View style={styles.recordDate}>
                    <Ionicons name="calendar-outline" size={16} color={COLORS.textSecondary} />
                    <Text variant="caption">
                      {new Date(record.workout_date).toLocaleDateString('tr-TR')}
                    </Text>
                  </View>
                  <View style={styles.recordDetails}>
                    <View style={styles.recordStat}>
                      <Ionicons name="barbell" size={16} color={COLORS.primary} />
                      <Text variant="body" weight="semibold">{record.weight}kg</Text>
                    </View>
                    <View style={styles.recordStat}>
                      <Ionicons name="repeat-outline" size={16} color={COLORS.secondary} />
                      <Text variant="body">{record.reps} tekrar</Text>
                    </View>
                    {record.rpe && (
                      <View style={styles.recordStat}>
                        <Text variant="caption">RPE: {record.rpe}</Text>
                      </View>
                    )}
                  </View>
                </View>
              )) : (
                <Text variant="body" color={COLORS.textSecondary} style={{textAlign: 'center', padding: SPACING.lg}}>
                  Henüz kayıt yok
                    </Text>
                  )}
                </Card>
              </>
        )}

        {/* Kilo Takibi */}
        {activeTab === 'bodyweight' && (
          <>
            {/* Mevcut Kilo Kartı */}
            <Card style={styles.currentWeightCard}>
              <View style={styles.currentWeightHeader}>
                <View>
                  <Text variant="caption">Mevcut Kilonuz</Text>
                  <Text variant="heading1" color={COLORS.primary}>
                    {currentBodyWeight?.weight || '-'} kg
                  </Text>
                </View>
                {bodyWeightHistory.length > 1 && (
                  <View style={styles.weightChange}>
                    {bodyWeightHistory[0].weight < bodyWeightHistory[1].weight ? (
                      <>
                        <Ionicons name="trending-down" size={24} color={COLORS.success} />
                        <Text variant="body" weight="bold" color={COLORS.success}>
                          {(bodyWeightHistory[1].weight - bodyWeightHistory[0].weight).toFixed(1)} kg
                        </Text>
                      </>
                    ) : (
                      <>
                        <Ionicons name="trending-up" size={24} color={COLORS.warning} />
                        <Text variant="body" weight="bold" color={COLORS.warning}>
                          +{(bodyWeightHistory[0].weight - bodyWeightHistory[1].weight).toFixed(1)} kg
                        </Text>
                      </>
                    )}
                  </View>
                )}
              </View>

              {/* Hedef Progress */}
              {weeklyAverage && (
                <View style={styles.goalProgress}>
                  <Text variant="caption" style={{marginBottom: SPACING.xs}}>
                    7 Günlük Ortalama: {weeklyAverage} kg
                  </Text>
                </View>
              )}
            </Card>

            {/* Grafik */}
            <Card>
              <View style={styles.chartHeader}>
                <Text variant="heading3">Kilo Trendi</Text>
                {weeklyAverage && <Badge label={`Ort: ${weeklyAverage}kg`} variant="info" />}
              </View>

              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
              ) : bodyWeightHistory.length > 0 ? (
                <LineChart
                  data={{
                    labels: bodyWeightHistory.slice(0, 7).reverse().map(item => 
                      new Date(item.measurement_date).getDate().toString()
                    ),
                    datasets: [
                      {
                        data: bodyWeightHistory.slice(0, 7).reverse().map(item => item.weight),
                        color: (opacity = 1) => `rgba(0, 184, 148, ${opacity})`,
                      },
                    ],
                  }}
                  width={width - SPACING.lg * 4}
                  height={220}
                  chartConfig={{
                    ...chartConfig,
                    color: (opacity = 1) => `rgba(0, 184, 148, ${opacity})`,
                  }}
                  bezier
                  style={styles.chart}
                />
              ) : (
                <View style={styles.emptyState}>
                  <Ionicons name="body-outline" size={64} color={COLORS.textLight} />
                  <Text variant="body" color={COLORS.textSecondary} style={{marginTop: SPACING.md}}>
                    Henüz kilo kaydı yok
                  </Text>
                </View>
              )}
            </Card>

            {/* Haftalık Özet */}
            {bodyWeightHistory.length > 0 && (
              <Card>
                <Text variant="heading3" style={styles.sectionTitle}>Bu Hafta</Text>
                <View style={styles.weeklyStats}>
                  <View style={styles.weeklyStat}>
                    <Text variant="caption">Ortalama</Text>
                    <Text variant="heading3">
                      {weeklyAverage ? `${weeklyAverage} kg` : '-'}
                    </Text>
                  </View>
                  <View style={styles.weeklyStat}>
                    <Text variant="caption">Güncel</Text>
                    <Text variant="heading3" color={COLORS.primary}>
                      {bodyWeightHistory[0]?.weight || '-'} kg
                    </Text>
                  </View>
                  <View style={styles.weeklyStat}>
                    <Text variant="caption">Değişim</Text>
                    <Text 
                      variant="heading3" 
                      color={
                        bodyWeightHistory.length > 1 
                          ? (bodyWeightHistory[0].weight < bodyWeightHistory[bodyWeightHistory.length - 1].weight 
                              ? COLORS.success 
                              : COLORS.warning)
                          : COLORS.text
                      }
                    >
                      {bodyWeightHistory.length > 1 
                        ? `${(bodyWeightHistory[0].weight - bodyWeightHistory[bodyWeightHistory.length - 1].weight).toFixed(1)} kg`
                        : '-'}
                    </Text>
                  </View>
                </View>
              </Card>
            )}

            {/* Son Ölçümler */}
            <Card>
              <Text variant="heading3" style={styles.sectionTitle}>Son Ölçümler</Text>
              
              {bodyWeightHistory.length > 0 ? bodyWeightHistory.slice(0, 10).map((record, index) => {
                const prevRecord = bodyWeightHistory[index + 1];
                const diff = prevRecord ? (record.weight - prevRecord.weight).toFixed(1) : null;
                
                return (
                  <View key={record.id || index} style={styles.weightRecord}>
                    <View style={styles.weightRecordLeft}>
                      <Text variant="body" weight="semibold">{record.weight} kg</Text>
                      <Text variant="caption">
                        {new Date(record.measurement_date).toLocaleDateString('tr-TR')}
                      </Text>
                    </View>
                    <View style={styles.weightRecordRight}>
                      {diff && (
                        <View style={styles.weightDiff}>
                          <Ionicons 
                            name={parseFloat(diff) > 0 ? "arrow-up" : "arrow-down"} 
                            size={14} 
                            color={parseFloat(diff) > 0 ? COLORS.warning : COLORS.success} 
                          />
                          <Text 
                            variant="caption" 
                            color={parseFloat(diff) > 0 ? COLORS.warning : COLORS.success}
                          >
                            {parseFloat(diff) > 0 ? '+' : ''}{diff} kg
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                );
              }) : (
                <Text variant="body" color={COLORS.textSecondary} style={{textAlign: 'center', padding: SPACING.lg}}>
                  Henüz ölçüm yok
                </Text>
              )}
            </Card>
          </>
        )}

        {/* Antrenman Sıklığı */}
        {activeTab === 'frequency' && (
          <>
            {/* Hedef Kartı */}
            <Card>
              <View style={styles.frequencyHeader}>
                <View>
                  <Text variant="caption">Bu Ay</Text>
                  <Text variant="heading2">{monthlyStats?.totalWorkouts || 0} Antrenman</Text>
                </View>
                <View style={styles.frequencyBadge}>
                  <Ionicons name="flame" size={28} color={COLORS.warning} />
                  <Text variant="body" weight="bold">{currentStreak} Gün Seri</Text>
                </View>
              </View>
            </Card>

            {/* Isı Haritası (Heatmap) */}
            <Card>
              <View style={styles.heatmapHeader}>
                <Text variant="heading3">{getMonthName(currentMonth)} {currentYear}</Text>
                <View style={styles.monthNav}>
                  <TouchableOpacity onPress={handlePreviousMonth}>
                    <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleNextMonth}>
                    <Ionicons name="chevron-forward" size={24} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Hafta Günleri */}
              <View style={styles.weekDaysRow}>
                {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((day) => (
                  <Text key={day} variant="caption" style={styles.weekDayLabel}>
                    {day}
                  </Text>
                ))}
              </View>

              {/* Takvim Grid */}
              <View style={styles.calendarGrid}>
                {Array.from({ length: getDaysInMonth(currentYear, currentMonth) }, (_, i) => {
                  const date = new Date(currentYear, currentMonth - 1, i + 1);
                  const dateStr = date.toISOString().split('T')[0];
                  const isWorkout = workoutDates.includes(dateStr);
                  
                  return (
                    <View
                      key={i}
                      style={[
                        styles.calendarDay,
                        isWorkout && styles.calendarDayActive,
                      ]}
                    >
                      <Text 
                        variant="caption" 
                        color={isWorkout ? COLORS.surface : COLORS.textSecondary}
                        style={styles.calendarDayText}
                      >
                        {i + 1}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </Card>

            {/* İstatistikler */}
            <Card>
              <Text variant="heading3" style={styles.sectionTitle}>İstatistikler</Text>
              
              <View style={styles.statRow}>
                <View style={styles.statItem}>
                  <Ionicons name="checkmark-circle" size={32} color={COLORS.success} />
                  <View style={styles.statContent}>
                    <Text variant="caption">Tamamlanan</Text>
                    <Text variant="heading3">{monthlyStats?.totalWorkouts || 0} gün</Text>
                  </View>
                </View>

                <View style={styles.statItem}>
                  <Ionicons name="time" size={32} color={COLORS.warning} />
                  <View style={styles.statContent}>
                    <Text variant="caption">Toplam Süre</Text>
                    <Text variant="heading3">
                      {monthlyStats ? (monthlyStats.totalDuration / 60).toFixed(1) : 0} saat
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.statRow}>
                <View style={styles.statItem}>
                  <Ionicons name="trophy" size={32} color={COLORS.primary} />
                  <View style={styles.statContent}>
                    <Text variant="caption">En Uzun Seri</Text>
                    <Text variant="heading3">{longestStreak} gün</Text>
                  </View>
                </View>

                <View style={styles.statItem}>
                  <Ionicons name="flame" size={32} color={COLORS.secondary} />
                  <View style={styles.statContent}>
                    <Text variant="caption">Toplam Set</Text>
                    <Text variant="heading3">{monthlyStats?.totalSets || 0}</Text>
                  </View>
                </View>
              </View>
            </Card>

            {/* Paylaş Butonu */}
            <Button
              title="İlerlemeyi Paylaş"
              variant="primary"
              icon={<Ionicons name="share-social-outline" size={20} color={COLORS.surface} />}
              onPress={handleShareProgress}
              style={styles.shareButton}
            />
          </>
        )}

        {/* Alt Boşluk - FAB için yer bırak */}
        <View style={{ height: 60 }} />
      </ScrollView>

      {/* FAB */}
      {activeTab === 'weight' && (
        <Button
          title="Ağırlık Kaydet"
          variant="primary"
          icon={<Ionicons name="add" size={20} color={COLORS.surface} />}
          onPress={() => setShowAddWeightModal(true)}
          style={styles.fab}
        />
      )}

      {activeTab === 'bodyweight' && (
        <Button
          title="Kilo Gir"
          variant="primary"
          icon={<Ionicons name="add" size={20} color={COLORS.surface} />}
          onPress={() => setShowAddBodyWeightModal(true)}
          style={styles.fab}
        />
      )}

      {/* Ağırlık Kaydet Modal */}
      <Modal
        visible={showAddWeightModal}
        onClose={() => setShowAddWeightModal(false)}
        title="Ağırlık Kaydet"
      >
        <Input
          label="Egzersiz"
          value={selectedExercise?.name || ''}
          placeholder="Egzersiz seçin"
          editable={false}
        />

        <View style={styles.modalRow}>
          <Input
            label="Ağırlık (kg)"
            placeholder="80"
            keyboardType="numeric"
            value={formWeight}
            onChangeText={setFormWeight}
            style={{ flex: 1, marginRight: SPACING.sm }}
          />
          <Input
            label="Tekrar"
            placeholder="8"
            keyboardType="numeric"
            value={formReps}
            onChangeText={setFormReps}
            style={{ flex: 1 }}
          />
        </View>

        <View style={styles.rpeSection}>
          <Text variant="body" weight="semibold" style={styles.rpeLabel}>
            RPE (Algılanan Zorluk) - Opsiyonel
          </Text>
          <View style={styles.rpeButtons}>
            {[6, 7, 8, 9, 10].map((value) => (
              <TouchableOpacity 
                key={value} 
                style={[
                  styles.rpeButton,
                  formRpe === value && styles.rpeButtonActive
                ]}
                onPress={() => setFormRpe(value)}
              >
                <Text 
                  variant="body" 
                  weight="semibold"
                  color={formRpe === value ? COLORS.surface : COLORS.text}
                >
                  {value}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {formWeight && formReps && (
            <Text variant="caption" color={COLORS.textSecondary}>
              💡 E1RM tahmini: ~{trackingService.calculateE1RM(parseFloat(formWeight), parseInt(formReps))}kg
            </Text>
          )}
        </View>

        <Button
          title="Kaydet"
          variant="primary"
          onPress={handleSaveWeight}
          disabled={loading}
        />
      </Modal>

      {/* Kilo Gir Modal */}
      <Modal
        visible={showAddBodyWeightModal}
        onClose={() => setShowAddBodyWeightModal(false)}
        title="Kilo Gir"
      >
        <Input
          label="Kilonuz (kg)"
          placeholder="81.0"
          keyboardType="decimal-pad"
          value={formBodyWeight}
          onChangeText={setFormBodyWeight}
        />

        <Input
          label="Tarih"
          value={new Date().toLocaleDateString('tr-TR')}
          editable={false}
        />

        <Input
          label="Not (opsiyonel)"
          placeholder="Sabah açlık, antrenman öncesi..."
          multiline
          numberOfLines={3}
          value={formNotes}
          onChangeText={setFormNotes}
        />

        <Button
          title="Kaydet"
          variant="primary"
          onPress={handleSaveBodyWeight}
          disabled={loading}
        />
      </Modal>

      {/* Egzersiz Seçici Modal */}
      <Modal
        visible={showExercisePickerModal}
        onClose={() => setShowExercisePickerModal(false)}
        title="Egzersiz Seç"
      >
        {exerciseLibrary.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text variant="body" color={COLORS.textSecondary} style={{ marginTop: SPACING.md }}>
              Egzersizler yükleniyor...
            </Text>
          </View>
        ) : (
          <ScrollView style={{ maxHeight: 400 }} showsVerticalScrollIndicator={false}>
            {exerciseLibrary.map((exercise) => (
              <TouchableOpacity
                key={exercise.id}
                style={[
                  styles.exerciseItem,
                  selectedExercise?.id === exercise.id && styles.exerciseItemActive
                ]}
                onPress={() => {
                  setSelectedExercise(exercise);
                  setShowExercisePickerModal(false);
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text variant="body" weight="semibold">{exercise.name}</Text>
                  <Text variant="caption" color={COLORS.textSecondary}>
                    {exercise.muscle_group}
                  </Text>
                </View>
                {selectedExercise?.id === exercise.id && (
                  <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  exerciseSelector: {
    marginBottom: SPACING.md,
  },
  label: {
    marginBottom: SPACING.sm,
  },
  exerciseSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
  },
  selectedExercise: {
    flex: 1,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  unitToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chart: {
    marginVertical: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.md,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  sectionTitle: {
    marginBottom: SPACING.md,
  },
  recordItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  recordDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  recordDetails: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  recordStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  currentWeightCard: {
    backgroundColor: COLORS.primaryLight + '20',
  },
  currentWeightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  weightChange: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  goalProgress: {
    marginTop: SPACING.md,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.xs,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.secondary,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weeklyStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  weeklyStat: {
    alignItems: 'center',
  },
  weightRecord: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  weightRecordLeft: {
    gap: SPACING.xs,
  },
  weightRecordRight: {},
  weightDiff: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  reminderCard: {
    marginTop: SPACING.md,
  },
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  reminderInfo: {
    flex: 1,
  },
  frequencyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  frequencyBadge: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  heatmapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  monthNav: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.sm,
  },
  weekDayLabel: {
    width: 40,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  calendarDay: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarDayActive: {
    backgroundColor: COLORS.success,
  },
  calendarDayText: {
    fontSize: 12,
  },
  statRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
  },
  statContent: {},
  shareButton: {
    marginTop: SPACING.md,
  },
  bottomSpace: {
    height: 100,
  },
  fab: {
    position: 'absolute',
    bottom: SPACING.xl,
    left: SPACING.lg,
    right: SPACING.lg,
  },
  modalRow: {
    flexDirection: 'row',
  },
  rpeSection: {
    marginBottom: SPACING.lg,
  },
  rpeLabel: {
    marginBottom: SPACING.sm,
  },
  rpeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  rpeButton: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rpeButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  loadingContainer: {
    padding: SPACING.xl * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    padding: SPACING.xl * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    marginBottom: SPACING.xs,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  exerciseItemActive: {
    backgroundColor: COLORS.primaryLight + '20',
    borderColor: COLORS.primary,
  },
});
