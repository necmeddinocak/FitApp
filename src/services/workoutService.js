import { supabase } from '../config/supabase';

/**
 * Egzersiz kütüphanesini getir
 */
export const getExerciseLibrary = async () => {
  const { data, error } = await supabase
    .from('exercise_library')
    .select('*')
    .eq('is_global', true)
    .order('name', { ascending: true });

  if (error) throw error;
  return data;
};

/**
 * Antrenman şablonlarını getir (global + user's)
 */
export const getWorkoutTemplates = async (userId) => {
  const { data, error } = await supabase
    .from('workout_templates')
    .select(`
      *,
      template_exercises (
        *,
        exercise:exercise_library (*)
      )
    `)
    .or(`is_global.eq.true,user_id.eq.${userId}`)
    .order('is_global', { ascending: false });

  if (error) throw error;
  return data;
};

/**
 * Kullanıcı şablonu oluştur
 */
export const createWorkoutTemplate = async (userId, template) => {
  const { data, error } = await supabase
    .from('workout_templates')
    .insert({
      user_id: userId,
      ...template,
      is_global: false,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Kullanıcının aktif programını getir
 */
export const getActiveProgram = async (userId) => {
  console.log('🔍 getActiveProgram çağrıldı, userId:', userId);
  
  const { data, error } = await supabase
    .from('workout_programs')
    .select(`
      *,
      program_workouts (
        *,
        program_exercises (
          *,
          exercise:exercise_library (*)
        )
      )
    `)
    .eq('user_id', userId)
    .eq('is_active', true)
    .single();

  console.log('📦 getActiveProgram response:', { data, error });
  
  if (error && error.code !== 'PGRST116') {
    console.error('❌ getActiveProgram hatası:', error);
    throw error;
  }
  
  // Eğer data varsa ama program_workouts boşsa, ayrı bir query ile çekelim
  if (data && (!data.program_workouts || data.program_workouts.length === 0)) {
    console.log('⚠️ program_workouts boş, ayrı query ile çekiliyor...');
    
    const { data: workouts, error: workoutsError } = await supabase
      .from('program_workouts')
      .select(`
        *,
        program_exercises (
          *,
          exercise:exercise_library (*)
        )
      `)
      .eq('program_id', data.id);
    
    console.log('📋 Ayrı workout query sonucu:', { workouts, workoutsError });
    
    if (!workoutsError && workouts) {
      data.program_workouts = workouts;
    }
  }
  
  return data;
};

/**
 * Antrenman programı oluştur
 */
export const createWorkoutProgram = async (userId, program) => {
  const { data, error } = await supabase
    .from('workout_programs')
    .insert({
      user_id: userId,
      ...program,
      is_active: true,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Program günü ekle
 */
export const addProgramWorkout = async (programId, workout) => {
  const { data, error } = await supabase
    .from('program_workouts')
    .insert({
      program_id: programId,
      ...workout,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Program egzersizi ekle
 */
export const addProgramExercise = async (programWorkoutId, exercise) => {
  const { data, error } = await supabase
    .from('program_exercises')
    .insert({
      program_workout_id: programWorkoutId,
      ...exercise,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Antrenman oturumu kaydet
 */
export const saveWorkoutSession = async (userId, session) => {
  const { data, error } = await supabase
    .from('workout_sessions')
    .insert({
      user_id: userId,
      workout_date: new Date().toISOString().split('T')[0],
      ...session,
      completed: true,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Kullanıcının antrenman oturumlarını getir
 */
export const getWorkoutSessions = async (userId, startDate, endDate) => {
  let query = supabase
    .from('workout_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('workout_date', { ascending: false });

  if (startDate) {
    query = query.gte('workout_date', startDate);
  }
  if (endDate) {
    query = query.lte('workout_date', endDate);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
};

/**
 * Kullanıcının streak'ini hesapla
 */
export const calculateStreak = async (userId) => {
  const { data, error } = await supabase
    .rpc('calculate_user_streak', { p_user_id: userId });

  if (error) throw error;
  return data;
};

/**
 * Şablondan program oluştur veya mevcut programa egzersiz ekle
 */
export const createProgramFromTemplate = async (userId, templateId, programName, dayOfWeek = 1) => {
  try {
    console.log('🔵 createProgramFromTemplate çağrıldı:', { userId, templateId, programName, dayOfWeek });
    
    // 1. Şablonu detaylarıyla getir
    const { data: template, error: templateError } = await supabase
      .from('workout_templates')
      .select(`
        *,
        template_exercises (
          *,
          exercise:exercise_library (*)
        )
      `)
      .eq('id', templateId)
      .single();

    if (templateError) throw templateError;
    console.log('📋 Şablon yüklendi:', template.name, 'Egzersiz sayısı:', template.template_exercises?.length);

    if (!template.template_exercises || template.template_exercises.length === 0) {
      throw new Error('Bu şablonda egzersiz bulunmuyor!');
    }

    // 2. Aktif program var mı kontrol et
    const { data: existingProgram, error: programError } = await supabase
      .from('workout_programs')
      .select('id, name')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single();

    let programId;

    if (programError && programError.code === 'PGRST116') {
      // Program yok, yeni oluştur
      console.log('⚠️ Aktif program yok, yeni oluşturuluyor...');
      const { data: newProgram, error: createError } = await supabase
        .from('workout_programs')
        .insert({
          user_id: userId,
          name: programName || 'Antrenman Programım',
          is_active: true,
          start_date: new Date().toISOString().split('T')[0],
        })
        .select()
        .single();

      if (createError) throw createError;
      programId = newProgram.id;
      console.log('✅ Yeni program oluşturuldu:', programId);
    } else if (existingProgram) {
      // Mevcut program var, ona ekle
      programId = existingProgram.id;
      console.log('✅ Mevcut programa eklenecek:', existingProgram.name, programId);
    } else {
      throw programError;
    }

    // 3. O güne ait workout var mı kontrol et
    const { data: existingWorkout, error: workoutCheckError } = await supabase
      .from('program_workouts')
      .select('id')
      .eq('program_id', programId)
      .eq('day_of_week', dayOfWeek)
      .single();

    let workoutId;

    if (workoutCheckError && workoutCheckError.code === 'PGRST116') {
      // Workout yok, yeni oluştur
      console.log(`⚠️ Gün ${dayOfWeek} için workout yok, oluşturuluyor...`);
      const { data: newWorkout, error: createWorkoutError } = await supabase
        .from('program_workouts')
        .insert({
          program_id: programId,
          day_of_week: dayOfWeek,
          workout_name: template.name,
        })
        .select()
        .single();

      if (createWorkoutError) throw createWorkoutError;
      workoutId = newWorkout.id;
      console.log('✅ Yeni workout oluşturuldu:', workoutId);
    } else if (existingWorkout) {
      // Workout var, onu kullan (üzerine ekle)
      workoutId = existingWorkout.id;
      console.log('⚠️ Bu günde zaten workout var, üzerine egzersiz eklenecek:', workoutId);
      
      // Mevcut egzersiz sayısını al (order_index için)
      const { count } = await supabase
        .from('program_exercises')
        .select('*', { count: 'exact', head: true })
        .eq('program_workout_id', workoutId);
      
      console.log('📊 Mevcut egzersiz sayısı:', count);
    } else {
      throw workoutCheckError;
    }

    // 4. Mevcut egzersiz sayısını al
    const { count: currentCount } = await supabase
      .from('program_exercises')
      .select('*', { count: 'exact', head: true })
      .eq('program_workout_id', workoutId);

    // 5. Şablondaki egzersizleri ekle
    const exercisesToInsert = template.template_exercises.map((ex, index) => ({
      program_workout_id: workoutId,
      exercise_id: ex.exercise_id,
      sets: ex.sets,
      reps: ex.reps,
      rest_seconds: ex.rest_seconds,
      notes: ex.notes,
      order_index: (currentCount || 0) + index, // Mevcut egzersizlerin sonuna ekle
    }));

    console.log('➕ Eklenecek egzersiz sayısı:', exercisesToInsert.length);

    const { error: exercisesError } = await supabase
      .from('program_exercises')
      .insert(exercisesToInsert);

    if (exercisesError) throw exercisesError;

    console.log('✅ Şablondan egzersizler eklendi!');
    
    return { programId, workoutId };
  } catch (error) {
    console.error('❌ Şablondan program oluşturma hatası:', error);
    throw error;
  }
};

/**
 * Programa egzersiz ekle
 */
export const addExerciseToProgram = async (programId, dayOfWeek, exerciseData) => {
  try {
    console.log('🔵 addExerciseToProgram çağrıldı:', { programId, dayOfWeek, exerciseData });
    
    // 1. O güne ait workout var mı kontrol et
    let { data: workout, error: workoutError } = await supabase
      .from('program_workouts')
      .select('*')
      .eq('program_id', programId)
      .eq('day_of_week', dayOfWeek)
      .single();
    
    console.log('📋 Workout sorgusu sonucu:', { workout, workoutError });

    // 2. Workout yoksa oluştur
    if (workoutError && workoutError.code === 'PGRST116') {
      console.log('⚠️ Workout yok, yeni oluşturuluyor...');
      const { data: newWorkout, error: createError } = await supabase
        .from('program_workouts')
        .insert({
          program_id: programId,
          day_of_week: dayOfWeek,
          workout_name: `Gün ${dayOfWeek}`,
        })
        .select()
        .single();

      if (createError) {
        console.error('❌ Workout oluşturma hatası:', createError);
        throw createError;
      }
      console.log('✅ Yeni workout oluşturuldu:', newWorkout);
      workout = newWorkout;
    } else if (workoutError) {
      console.error('❌ Workout sorgu hatası:', workoutError);
      throw workoutError;
    }

    // 3. Egzersiz ID'sini bul veya oluştur (eğer yeni egzersizse)
    let exerciseId = exerciseData.exercise_id;

    if (!exerciseId && exerciseData.exercise_name) {
      console.log('🆕 Yeni egzersiz oluşturuluyor:', exerciseData.exercise_name);
      // Yeni egzersiz oluştur
      const { data: newExercise, error: exerciseError } = await supabase
        .from('exercise_library')
        .insert({
          name: exerciseData.exercise_name,
          muscle_group: exerciseData.muscle_group || 'Diğer',
          equipment: exerciseData.equipment || 'Ağırlık',
          is_global: false,
        })
        .select()
        .single();

      if (exerciseError) {
        console.error('❌ Egzersiz oluşturma hatası:', exerciseError);
        throw exerciseError;
      }
      console.log('✅ Yeni egzersiz oluşturuldu:', newExercise);
      exerciseId = newExercise.id;
    }

    // 4. Mevcut egzersiz sayısını bul (order_index için)
    const { count, error: countError } = await supabase
      .from('program_exercises')
      .select('*', { count: 'exact', head: true })
      .eq('program_workout_id', workout.id);

    if (countError) {
      console.error('❌ Count hatası:', countError);
      throw countError;
    }
    console.log('🔢 Mevcut egzersiz sayısı:', count);

    // 5. Egzersizi programa ekle
    const exerciseToInsert = {
      program_workout_id: workout.id,
      exercise_id: exerciseId,
      order_index: count || 0,
      sets: exerciseData.sets || 3,
      reps: exerciseData.reps || '8-12',
      rest_seconds: exerciseData.rest_seconds || 60,
      notes: exerciseData.notes,
    };
    console.log('➕ Program exercise eklenecek:', exerciseToInsert);

    const { data: programExercise, error: addError } = await supabase
      .from('program_exercises')
      .insert(exerciseToInsert)
      .select(`
        *,
        exercise:exercise_library (*)
      `)
      .single();

    if (addError) {
      console.error('❌ Program exercise ekleme hatası:', addError);
      throw addError;
    }
    console.log('✅ Program exercise başarıyla eklendi:', programExercise);
    return programExercise;
  } catch (error) {
    console.error('Egzersiz ekleme hatası:', error);
    throw error;
  }
};

/**
 * Program egzersizini sil
 */
export const deleteProgramExercise = async (exerciseId) => {
  const { error } = await supabase
    .from('program_exercises')
    .delete()
    .eq('id', exerciseId);

  if (error) throw error;
};

/**
 * Program egzersizini güncelle
 */
export const updateProgramExercise = async (exerciseId, updates) => {
  const { data, error } = await supabase
    .from('program_exercises')
    .update(updates)
    .eq('id', exerciseId)
    .select(`
      *,
      exercise:exercise_library (*)
    `)
    .single();

  if (error) throw error;
  return data;
};

