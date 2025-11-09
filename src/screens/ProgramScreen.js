import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Text, Button, FAB, Badge, Modal, Input } from '../components/common';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../constants/theme';
import { useUser, useData } from '../context';
import { workoutService } from '../services';
import { supabase } from '../config/supabase';

const WEEK_DAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

export const ProgramScreen = () => {
  const { userId } = useUser();
  const { exerciseLibrary, workoutTemplates, refreshExerciseLibrary, refreshWorkoutTemplates } = useData();
  
  const [selectedDay, setSelectedDay] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showCreateTemplateModal, setShowCreateTemplateModal] = useState(false);
  const [showExerciseDetail, setShowExerciseDetail] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [activeProgram, setActiveProgram] = useState(null);
  const [todayExercises, setTodayExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form states - Manuel egzersiz ekleme
  const [exerciseName, setExerciseName] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [restTime, setRestTime] = useState('');
  const [notes, setNotes] = useState('');
  
  // Form states - Şablon oluşturma
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [templateCategory, setTemplateCategory] = useState('');
  const [templateExercises, setTemplateExercises] = useState([]);

  // Veri yükleme
  useEffect(() => {
    if (userId) {
      loadData();
    }
  }, [userId]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      console.log('🔄 Veriler yükleniyor...');
      
      // Egzersiz kütüphanesini yükle
      const exercises = await workoutService.getExerciseLibrary();
      refreshExerciseLibrary(exercises);
      console.log('📚 Egzersiz kütüphanesi yüklendi:', exercises.length);
      
      // Şablonları yükle
      const templates = await workoutService.getWorkoutTemplates(userId);
      refreshWorkoutTemplates(templates);
      console.log('📋 Şablonlar yüklendi:', templates.length);
      
      // Aktif programı yükle
      const program = await workoutService.getActiveProgram(userId);
      setActiveProgram(program);
      console.log('💪 Aktif program:', program);
      
      // Bugünün egzersizlerini ayarla
      if (program && program.program_workouts) {
        console.log('📅 Program workouts:', program.program_workouts);
        const todayWorkout = program.program_workouts.find(
          w => w.day_of_week === selectedDay + 1
        );
        console.log(`🎯 Seçili gün ${selectedDay + 1} için workout:`, todayWorkout);
        
        if (todayWorkout && todayWorkout.program_exercises) {
          console.log('✅ Egzersizler bulundu:', todayWorkout.program_exercises.length);
          setTodayExercises(todayWorkout.program_exercises);
        } else {
          console.log('❌ Bu gün için egzersiz yok');
          setTodayExercises([]);
        }
      } else {
        console.log('⚠️ Program yok veya workouts yok');
        setTodayExercises([]);
      }
    } catch (error) {
      console.error('❌ Veri yükleme hatası:', error);
      Alert.alert('Hata', 'Veriler yüklenemedi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Gün değiştiğinde egzersizleri güncelle
  useEffect(() => {
    if (activeProgram && activeProgram.program_workouts) {
      const todayWorkout = activeProgram.program_workouts.find(
        w => w.day_of_week === selectedDay + 1
      );
      if (todayWorkout && todayWorkout.program_exercises) {
        setTodayExercises(todayWorkout.program_exercises);
      } else {
        setTodayExercises([]);
      }
    }
  }, [selectedDay, activeProgram]);

  const handleExercisePress = (exercise) => {
    setSelectedExercise(exercise);
    setShowExerciseDetail(true);
  };

  // Şablondan program oluştur
  const handleCreateFromTemplate = async (template) => {
    try {
      setShowTemplateModal(false);
      setLoading(true);

      const dayNames = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
      const selectedDayName = dayNames[selectedDay];

      console.log('🎯 Şablon seçildi:', template.name, 'Seçili gün:', selectedDayName, 'Day of week:', selectedDay + 1);

      await workoutService.createProgramFromTemplate(
        userId, 
        template.id, 
        template.name,
        selectedDay + 1 // selectedDay 0-based, database 1-based
      );
      
      Alert.alert(
        '✅ Başarılı!',
        `"${template.name}" şablonu ${selectedDayName} gününe eklendi!`,
        [
          {
            text: 'Tamam',
            onPress: () => loadData(), // Verileri yenile
          }
        ]
      );
    } catch (error) {
      console.error('❌ Program oluşturma hatası:', error);
      Alert.alert('Hata', 'Program oluşturulurken bir hata oluştu: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Şablon oluştur
  const handleCreateTemplate = async () => {
    try {
      // Validasyon
      if (!templateName.trim()) {
        Alert.alert('Uyarı', 'Lütfen şablon adı girin');
        return;
      }

      if (templateExercises.length === 0) {
        Alert.alert('Uyarı', 'Lütfen en az bir egzersiz ekleyin');
        return;
      }

      setLoading(true);
      console.log('🔵 Şablon oluşturuluyor:', {
        name: templateName,
        exercises: templateExercises.length
      });

      // Önce şablonu oluştur
      const { data: newTemplate, error: templateError } = await supabase
        .from('workout_templates')
        .insert({
          user_id: userId,
          name: templateName,
          description: templateDescription || null,
          category: templateCategory || 'Özel',
          is_global: false,
          exercise_count: templateExercises.length,
          estimated_duration: templateExercises.length * 5, // Her egzersiz ~5dk
        })
        .select()
        .single();

      if (templateError) throw templateError;
      console.log('✅ Şablon oluşturuldu:', newTemplate.id);

      // Egzersizleri ekle
      const exercisesToInsert = templateExercises.map((ex, index) => ({
        template_id: newTemplate.id,
        exercise_id: ex.exercise_id,
        order_index: index,
        sets: ex.sets,
        reps: ex.reps,
        rest_seconds: ex.rest_seconds,
        notes: ex.notes || null,
      }));

      const { error: exercisesError } = await supabase
        .from('template_exercises')
        .insert(exercisesToInsert);

      if (exercisesError) throw exercisesError;
      console.log('✅ Egzersizler eklendi');

      // Form'u temizle
      setTemplateName('');
      setTemplateDescription('');
      setTemplateCategory('');
      setTemplateExercises([]);
      
      // Modal'ı kapat
      setShowCreateTemplateModal(false);
      
      // Verileri yenile
      await loadData();

      Alert.alert(
        '✅ Başarılı!',
        `"${templateName}" şablonu oluşturuldu! Artık Hazır Programlar bölümünden kullanabilirsiniz.`
      );
    } catch (error) {
      console.error('❌ Şablon oluşturma hatası:', error);
      Alert.alert('Hata', 'Şablon oluşturulurken bir hata oluştu: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Şablona egzersiz ekle
  const handleAddExerciseToTemplate = (exercise) => {
    setTemplateExercises([
      ...templateExercises,
      {
        exercise_id: exercise.id,
        exercise_name: exercise.name,
        sets: 3,
        reps: '8-12',
        rest_seconds: 60,
        notes: '',
      },
    ]);
  };

  // Şablondan egzersiz çıkar
  const handleRemoveExerciseFromTemplate = (index) => {
    const newExercises = templateExercises.filter((_, i) => i !== index);
    setTemplateExercises(newExercises);
  };

  // Manuel egzersiz ekle
  const handleAddExercise = async () => {
    try {
      // Validasyon
      if (!exerciseName || !sets || !reps) {
        Alert.alert('Uyarı', 'Lütfen en azından egzersiz adı, set ve tekrar bilgilerini girin');
        return;
      }

      setLoading(true);

      // Aktif program var mı kontrol et
      if (!activeProgram) {
        Alert.alert('Uyarı', 'Önce bir program oluşturmalısınız. Şablonlardan birini seçebilirsiniz.');
        setShowAddModal(false);
        return;
      }

      // Egzersiz verisini hazırla
      const exerciseData = {
        exercise_name: exerciseName,
        sets: parseInt(sets),
        reps: reps,
        rest_seconds: restTime ? parseInt(restTime) : 60,
        notes: notes || null,
      };

      // Egzersizi ekle
      console.log('🔵 Egzersiz ekleniyor:', {
        programId: activeProgram.id,
        dayOfWeek: selectedDay + 1,
        exerciseData
      });

      const result = await workoutService.addExerciseToProgram(
        activeProgram.id,
        selectedDay + 1, // selectedDay 0-based, database 1-based
        exerciseData
      );

      console.log('✅ Egzersiz eklendi:', result);

      // Form'u temizle
      setExerciseName('');
      setSets('');
      setReps('');
      setWeight('');
      setRestTime('');
      setNotes('');
      
      // Modal'ı kapat
      setShowAddModal(false);
      
      // Verileri yenile
      await loadData();

      Alert.alert('✅ Başarılı!', 'Egzersiz programa eklendi!');
    } catch (error) {
      console.error('Egzersiz ekleme hatası:', error);
      Alert.alert('Hata', 'Egzersiz eklenirken bir hata oluştu: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Haftalık Takvim Şeridi */}
      <View style={styles.calendarStrip}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.calendarContent}
        >
          {WEEK_DAYS.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayButton,
                selectedDay === index && styles.dayButtonActive
              ]}
              onPress={() => setSelectedDay(index)}
            >
              <Text 
                variant="caption" 
                color={selectedDay === index ? COLORS.surface : COLORS.textSecondary}
                weight="semibold"
              >
                {day}
              </Text>
              <View style={[
                styles.dayDot,
                index < 5 && styles.dayDotActive
              ]} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Hazır Programlar Butonu */}
      <View style={styles.actionBar}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.templateButton]}
          onPress={() => setShowTemplateModal(true)}
        >
          <Ionicons name="albums-outline" size={20} color={COLORS.primary} />
          <Text variant="body" color={COLORS.primary} weight="semibold">Hazır Programlar</Text>
        </TouchableOpacity>
      </View>

      {/* Egzersiz Listesi */}
      <ScrollView 
        style={styles.exerciseList}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text variant="body" style={styles.loadingText}>Yükleniyor...</Text>
          </View>
        ) : todayExercises.length > 0 ? (
          <>
            <View style={styles.sectionHeader}>
              <Text variant="heading3">{WEEK_DAYS[selectedDay]} Antrenmanı</Text>
              <Text variant="caption">{todayExercises.length} egzersiz</Text>
            </View>

            {todayExercises.map((item, index) => {
              const exercise = item.exercise;
              return (
                <Card 
                  key={item.id} 
                  style={styles.exerciseCard}
                  onPress={() => handleExercisePress(item)}
                >
                  <View style={styles.exerciseHeader}>
                    <View style={styles.dragHandle}>
                      <Ionicons name="menu" size={20} color={COLORS.textLight} />
                    </View>
                    <View style={styles.exerciseNumber}>
                      <Text variant="caption" weight="bold">{index + 1}</Text>
                    </View>
                    <View style={styles.exerciseInfo}>
                      <Text variant="body" weight="semibold">{exercise?.name || 'Egzersiz'}</Text>
                      <View style={styles.exerciseTags}>
                        {exercise?.muscle_group && (
                          <Badge label={exercise.muscle_group} variant="primary" />
                        )}
                        {exercise?.equipment && (
                          <Badge label={exercise.equipment} variant="secondary" />
                        )}
                      </View>
                    </View>
                  </View>

                  <View style={styles.exerciseStats}>
                    <View style={styles.statItem}>
                      <Ionicons name="repeat-outline" size={16} color={COLORS.textSecondary} />
                      <Text variant="caption">{item.sets} set</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Ionicons name="barbell-outline" size={16} color={COLORS.textSecondary} />
                      <Text variant="caption">{item.reps} tekrar</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Ionicons name="time-outline" size={16} color={COLORS.textSecondary} />
                      <Text variant="caption">{item.rest_seconds || 60}sn dinlenme</Text>
                    </View>
                  </View>

                  {item.notes && (
                    <Text variant="caption" color={COLORS.textSecondary} style={styles.exerciseNotes}>
                      💡 {item.notes}
                    </Text>
                  )}

                  <TouchableOpacity style={styles.moreButton}>
                    <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.textSecondary} />
                  </TouchableOpacity>
                </Card>
              );
            })}
          </>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="barbell-outline" size={64} color={COLORS.textLight} />
            <Text variant="heading3" style={styles.emptyTitle}>
              Program Yok
            </Text>
            <Text variant="body" color={COLORS.textSecondary} style={styles.emptyText}>
              {WEEK_DAYS[selectedDay]} günü için henüz bir antrenman planınız yok.
            </Text>
            <Button
              title="Şablondan Başla"
              variant="primary"
              icon={<Ionicons name="add-circle-outline" size={20} color={COLORS.surface} />}
              onPress={() => setShowTemplateModal(true)}
              style={styles.emptyButton}
            />
          </View>
        )}

        {/* Boş Alan */}
        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* FAB - Egzersiz Ekle */}
      <FAB 
        icon="add" 
        onPress={() => setShowAddModal(true)} 
      />

      {/* Egzersiz Ekle Modal */}
      <Modal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Egzersiz Ekle"
      >
        <Input
          label="Egzersiz Adı"
          placeholder="Örn: Bench Press"
          value={exerciseName}
          onChangeText={setExerciseName}
        />
        
        <View style={styles.modalRow}>
          <Input
            label="Set Sayısı"
            placeholder="4"
            keyboardType="numeric"
            value={sets}
            onChangeText={setSets}
            style={{ flex: 1, marginRight: SPACING.sm }}
          />
          <Input
            label="Tekrar"
            placeholder="8-10"
            value={reps}
            onChangeText={setReps}
            style={{ flex: 1 }}
          />
        </View>

        <View style={styles.modalRow}>
          <Input
            label="Ağırlık (kg)"
            placeholder="80"
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
            style={{ flex: 1, marginRight: SPACING.sm }}
          />
          <Input
            label="Dinlenme (sn)"
            placeholder="90"
            keyboardType="numeric"
            value={restTime}
            onChangeText={setRestTime}
            style={{ flex: 1 }}
          />
        </View>

        <Input
          label="Not (opsiyonel)"
          placeholder="Egzersiz hakkında not..."
          multiline
          numberOfLines={3}
          value={notes}
          onChangeText={setNotes}
        />

        <View style={styles.modalActions}>
          <Button 
            title="İptal" 
            variant="outline" 
            onPress={() => {
              setShowAddModal(false);
              // Form'u temizle
              setExerciseName('');
              setSets('');
              setReps('');
              setWeight('');
              setRestTime('');
              setNotes('');
            }}
            style={{ flex: 1, marginRight: SPACING.sm }}
          />
          <Button 
            title="Kaydet" 
            variant="primary"
            onPress={handleAddExercise}
            style={{ flex: 1 }}
          />
        </View>
      </Modal>

      {/* Şablonlar Modal */}
      <Modal
        visible={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        title="Antrenman Şablonları"
      >
        <Text variant="caption" style={styles.modalDescription}>
          Hazır şablonlardan birini seçerek hızlıca başlayabilirsiniz
        </Text>

        {workoutTemplates.length > 0 ? (
          workoutTemplates.map((template) => (
            <Card 
              key={template.id}
              style={styles.templateCard}
              onPress={() => handleCreateFromTemplate(template)}
            >
              <View style={styles.templateIcon}>
                <Ionicons name="barbell" size={28} color={COLORS.primary} />
              </View>
              <View style={styles.templateInfo}>
                <Text variant="body" weight="semibold">{template.name}</Text>
                <Text variant="caption">
                  {template.template_exercises?.length || 0} egzersiz
                  {template.estimated_duration ? ` • ${template.estimated_duration} dk` : ''}
                </Text>
                {template.category && (
                  <Badge label={template.category} variant="primary" style={{ marginTop: 4 }} />
                )}
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
            </Card>
          ))
        ) : (
          <View style={styles.emptyTemplates}>
            <Text variant="body" color={COLORS.textSecondary}>
              Henüz şablon bulunmuyor
            </Text>
          </View>
        )}

        <Button
          title="Kendi Şablonumu Oluştur"
          variant="outline"
          icon={<Ionicons name="add-circle-outline" size={20} color={COLORS.primary} />}
          style={styles.createTemplateButton}
          onPress={() => {
            setShowTemplateModal(false);
            setShowCreateTemplateModal(true);
          }}
        />
      </Modal>

      {/* Şablon Oluşturma Modal */}
      <Modal
        visible={showCreateTemplateModal}
        onClose={() => {
          setShowCreateTemplateModal(false);
          setTemplateName('');
          setTemplateDescription('');
          setTemplateCategory('');
          setTemplateExercises([]);
        }}
        title="Kendi Şablonumu Oluştur"
      >
        <Text variant="caption" style={styles.modalDescription}>
          Kendi antrenman şablonunuzu oluşturun ve dilediğiniz zaman kullanın
        </Text>

        <Input
          label="Şablon Adı *"
          placeholder="Örn: Benim Push Day Programım"
          value={templateName}
          onChangeText={setTemplateName}
        />

        <Input
          label="Açıklama (opsiyonel)"
          placeholder="Şablon hakkında kısa açıklama..."
          multiline
          numberOfLines={2}
          value={templateDescription}
          onChangeText={setTemplateDescription}
        />

        <Input
          label="Kategori (opsiyonel)"
          placeholder="Örn: Push, Pull, Legs, Özel..."
          value={templateCategory}
          onChangeText={setTemplateCategory}
        />

        {/* Eklenen Egzersizler */}
        {templateExercises.length > 0 && (
          <View style={styles.templateExercisesSection}>
            <Text variant="body" weight="semibold" style={{ marginBottom: SPACING.sm }}>
              Egzersizler ({templateExercises.length})
            </Text>
            {templateExercises.map((ex, index) => (
              <Card key={index} style={styles.miniExerciseCard}>
                <View style={styles.miniExerciseHeader}>
                  <Text variant="body" weight="semibold">{ex.exercise_name}</Text>
                  <TouchableOpacity onPress={() => handleRemoveExerciseFromTemplate(index)}>
                    <Ionicons name="close-circle" size={24} color={COLORS.danger} />
                  </TouchableOpacity>
                </View>
                <Text variant="caption" color={COLORS.textSecondary}>
                  {ex.sets} set × {ex.reps} tekrar • {ex.rest_seconds}sn dinlenme
                </Text>
              </Card>
            ))}
          </View>
        )}

        {/* Egzersiz Kütüphanesinden Seç */}
        <View style={styles.exerciseLibrarySection}>
          <Text variant="body" weight="semibold" style={{ marginBottom: SPACING.sm }}>
            Egzersiz Ekle
          </Text>
          <ScrollView 
            style={styles.exerciseLibraryScroll}
            showsVerticalScrollIndicator={false}
          >
            {exerciseLibrary.slice(0, 10).map((exercise) => (
              <TouchableOpacity
                key={exercise.id}
                style={styles.exerciseLibraryItem}
                onPress={() => handleAddExerciseToTemplate(exercise)}
              >
                <View style={{ flex: 1 }}>
                  <Text variant="body">{exercise.name}</Text>
                  <Text variant="caption" color={COLORS.textSecondary}>
                    {exercise.muscle_group}
                  </Text>
                </View>
                <Ionicons name="add-circle-outline" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.modalActions}>
          <Button 
            title="İptal" 
            variant="outline" 
            onPress={() => {
              setShowCreateTemplateModal(false);
              setTemplateName('');
              setTemplateDescription('');
              setTemplateCategory('');
              setTemplateExercises([]);
            }}
            style={{ flex: 1, marginRight: SPACING.sm }}
          />
          <Button 
            title="Şablonu Kaydet" 
            variant="primary"
            onPress={handleCreateTemplate}
            style={{ flex: 1 }}
          />
        </View>
      </Modal>

      {/* Egzersiz Detay Modal */}
      {selectedExercise && (
        <Modal
          visible={showExerciseDetail}
          onClose={() => setShowExerciseDetail(false)}
          title="Egzersiz Detayı"
        >
          <View style={styles.detailHeader}>
            <View style={styles.detailIcon}>
              <Ionicons name="barbell" size={48} color={COLORS.primary} />
            </View>
            <Text variant="heading3" style={styles.detailTitle}>
              {selectedExercise.exercise?.name || 'Egzersiz'}
            </Text>
            {selectedExercise.exercise?.muscle_group && (
              <Badge 
                label={selectedExercise.exercise.muscle_group} 
                variant="primary" 
                style={{ marginTop: SPACING.xs }} 
              />
            )}
          </View>

          <View style={styles.detailSection}>
            <Text variant="body" weight="semibold" style={styles.detailLabel}>
              📊 Egzersiz Bilgileri
            </Text>
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text variant="caption" color={COLORS.textSecondary}>Set</Text>
                <Text variant="heading3" weight="bold">{selectedExercise.sets}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text variant="caption" color={COLORS.textSecondary}>Tekrar</Text>
                <Text variant="heading3" weight="bold">{selectedExercise.reps}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text variant="caption" color={COLORS.textSecondary}>Dinlenme</Text>
                <Text variant="heading3" weight="bold">{selectedExercise.rest_seconds || 60}sn</Text>
              </View>
            </View>
          </View>

          {selectedExercise.notes && (
            <View style={styles.detailSection}>
              <Text variant="body" weight="semibold" style={styles.detailLabel}>
                💡 Notlar
              </Text>
              <Text variant="body" color={COLORS.textSecondary}>
                {selectedExercise.notes}
              </Text>
            </View>
          )}

          {selectedExercise.exercise?.description && (
            <View style={styles.detailSection}>
              <Text variant="body" weight="semibold" style={styles.detailLabel}>
                📝 Açıklama
              </Text>
              <Text variant="body" color={COLORS.textSecondary}>
                {selectedExercise.exercise.description}
              </Text>
            </View>
          )}

          <View style={styles.modalActions}>
            <Button
              title="Sil"
              variant="outline"
              icon={<Ionicons name="trash-outline" size={20} color={COLORS.danger} />}
              onPress={async () => {
                Alert.alert(
                  'Emin misiniz?',
                  'Bu egzersizi programdan silmek istediğinize emin misiniz?',
                  [
                    { text: 'İptal', style: 'cancel' },
                    {
                      text: 'Sil',
                      style: 'destructive',
                      onPress: async () => {
                        try {
                          await workoutService.deleteProgramExercise(selectedExercise.id);
                          setShowExerciseDetail(false);
                          loadData();
                          Alert.alert('✅ Başarılı', 'Egzersiz silindi');
                        } catch (error) {
                          Alert.alert('Hata', 'Egzersiz silinemedi: ' + error.message);
                        }
                      }
                    }
                  ]
                );
              }}
              style={{ flex: 1, marginRight: SPACING.sm }}
            />
            <Button
              title="Kapat"
              variant="primary"
              onPress={() => setShowExerciseDetail(false)}
              style={{ flex: 1 }}
            />
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  calendarStrip: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  calendarContent: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  dayButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    minWidth: 50,
    gap: SPACING.xs,
  },
  dayButtonActive: {
    backgroundColor: COLORS.primary,
  },
  dayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.border,
  },
  dayDotActive: {
    backgroundColor: COLORS.secondary,
  },
  actionBar: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: SPACING.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  exerciseList: {
    flex: 1,
    padding: SPACING.lg,
  },
  sectionHeader: {
    marginBottom: SPACING.lg,
  },
  exerciseCard: {
    position: 'relative',
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  dragHandle: {
    marginRight: SPACING.sm,
  },
  exerciseNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primaryLight + '30',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  exerciseInfo: {
    flex: 1,
    gap: SPACING.xs,
  },
  exerciseTags: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  exerciseStats: {
    flexDirection: 'row',
    gap: SPACING.lg,
    paddingLeft: 52,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  moreButton: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
  },
  bottomSpace: {
    height: 80,
  },
  modalRow: {
    flexDirection: 'row',
  },
  modalActions: {
    flexDirection: 'row',
    marginTop: SPACING.lg,
  },
  modalDescription: {
    marginBottom: SPACING.lg,
    color: COLORS.textSecondary,
  },
  templateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  templateIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primaryLight + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  templateInfo: {
    flex: 1,
  },
  createTemplateButton: {
    marginTop: SPACING.md,
  },
  detailHeader: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  detailIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryLight + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  detailTitle: {
    textAlign: 'center',
  },
  detailSection: {
    marginBottom: SPACING.lg,
  },
  detailLabel: {
    marginBottom: SPACING.sm,
  },
  detailRow: {
    flexDirection: 'row',
  },
  alternatives: {
    flexDirection: 'row',
  },
  alternativeBadge: {
    marginRight: SPACING.sm,
  },
  detailNote: {
    textAlign: 'center',
    marginBottom: SPACING.lg,
    color: COLORS.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xl * 2,
  },
  loadingText: {
    marginTop: SPACING.md,
    color: COLORS.textSecondary,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xl * 3,
    paddingHorizontal: SPACING.lg,
  },
  emptyTitle: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  emptyButton: {
    minWidth: 200,
  },
  exerciseNotes: {
    marginTop: SPACING.sm,
    paddingLeft: 52,
  },
  emptyTemplates: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
  },
  infoItem: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  templateButton: {
    flex: 1,
    justifyContent: 'center',
  },
  templateExercisesSection: {
    marginTop: SPACING.md,
    marginBottom: SPACING.md,
  },
  miniExerciseCard: {
    marginBottom: SPACING.sm,
    padding: SPACING.md,
  },
  miniExerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  exerciseLibrarySection: {
    marginTop: SPACING.md,
  },
  exerciseLibraryScroll: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
  },
  exerciseLibraryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
});
