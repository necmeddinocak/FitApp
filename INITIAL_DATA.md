# Initial Data (Başlangıç Verileri)

Bu dosya, Fitness uygulaması için başlangıç verilerini içerir. `SUPABASE_SETUP.md` tamamlandıktan sonra bu verileri ekleyin.

## 1. EGZERSİZ KÜTÜPHANESİ (Exercise Library)

```sql
INSERT INTO exercise_library (name, muscle_group, equipment, difficulty) VALUES
  -- Göğüs Egzersizleri
  ('Bench Press', 'Göğüs', 'Barbell', 'Orta'),
  ('Incline Bench Press', 'Göğüs', 'Barbell', 'Orta'),
  ('Decline Bench Press', 'Göğüs', 'Barbell', 'Orta'),
  ('Dumbbell Press', 'Göğüs', 'Dumbbell', 'Başlangıç'),
  ('Incline Dumbbell Press', 'Göğüs', 'Dumbbell', 'Orta'),
  ('Cable Fly', 'Göğüs', 'Cable', 'Orta'),
  ('Push Up', 'Göğüs', 'Bodyweight', 'Başlangıç'),
  ('Dips', 'Göğüs', 'Bodyweight', 'Orta'),
  
  -- Sırt Egzersizleri
  ('Deadlift', 'Sırt', 'Barbell', 'İleri'),
  ('Barbell Row', 'Sırt', 'Barbell', 'Orta'),
  ('T-Bar Row', 'Sırt', 'Barbell', 'Orta'),
  ('Lat Pulldown', 'Sırt', 'Cable', 'Başlangıç'),
  ('Pull Up', 'Sırt', 'Bodyweight', 'Orta'),
  ('Chin Up', 'Sırt', 'Bodyweight', 'Orta'),
  ('Seated Cable Row', 'Sırt', 'Cable', 'Başlangıç'),
  ('One Arm Dumbbell Row', 'Sırt', 'Dumbbell', 'Orta'),
  
  -- Bacak Egzersizleri
  ('Squat', 'Bacak', 'Barbell', 'Orta'),
  ('Front Squat', 'Bacak', 'Barbell', 'İleri'),
  ('Leg Press', 'Bacak', 'Machine', 'Başlangıç'),
  ('Romanian Deadlift', 'Bacak', 'Barbell', 'Orta'),
  ('Leg Curl', 'Bacak', 'Machine', 'Başlangıç'),
  ('Leg Extension', 'Bacak', 'Machine', 'Başlangıç'),
  ('Lunges', 'Bacak', 'Dumbbell', 'Başlangıç'),
  ('Bulgarian Split Squat', 'Bacak', 'Dumbbell', 'Orta'),
  
  -- Omuz Egzersizleri
  ('Overhead Press', 'Omuz', 'Barbell', 'Orta'),
  ('Dumbbell Shoulder Press', 'Omuz', 'Dumbbell', 'Başlangıç'),
  ('Lateral Raise', 'Omuz', 'Dumbbell', 'Başlangıç'),
  ('Front Raise', 'Omuz', 'Dumbbell', 'Başlangıç'),
  ('Rear Delt Fly', 'Omuz', 'Dumbbell', 'Orta'),
  ('Face Pull', 'Omuz', 'Cable', 'Orta'),
  ('Arnold Press', 'Omuz', 'Dumbbell', 'Orta'),
  
  -- Kol Egzersizleri (Biceps)
  ('Barbell Curl', 'Biceps', 'Barbell', 'Başlangıç'),
  ('Dumbbell Curl', 'Biceps', 'Dumbbell', 'Başlangıç'),
  ('Hammer Curl', 'Biceps', 'Dumbbell', 'Başlangıç'),
  ('Cable Curl', 'Biceps', 'Cable', 'Başlangıç'),
  ('Preacher Curl', 'Biceps', 'Barbell', 'Orta'),
  
  -- Kol Egzersizleri (Triceps)
  ('Triceps Pushdown', 'Triceps', 'Cable', 'Başlangıç'),
  ('Overhead Triceps Extension', 'Triceps', 'Dumbbell', 'Başlangıç'),
  ('Skull Crusher', 'Triceps', 'Barbell', 'Orta'),
  ('Close Grip Bench Press', 'Triceps', 'Barbell', 'Orta'),
  ('Triceps Dips', 'Triceps', 'Bodyweight', 'Orta'),
  
  -- Karın Egzersizleri
  ('Plank', 'Karın', 'Bodyweight', 'Başlangıç'),
  ('Crunches', 'Karın', 'Bodyweight', 'Başlangıç'),
  ('Leg Raise', 'Karın', 'Bodyweight', 'Orta'),
  ('Russian Twist', 'Karın', 'Bodyweight', 'Başlangıç'),
  ('Cable Crunch', 'Karın', 'Cable', 'Orta');
```

## 2. ANTRENMAN ŞABLONLARI (Workout Templates)

```sql
-- Şablonları Ekle
INSERT INTO workout_templates (name, description, is_global, exercise_count, estimated_duration, category) VALUES
  ('Tam Vücut', 'Tüm vücut için kapsamlı program', true, 8, 60, 'Tam Vücut'),
  ('Push Day', 'İtme kasları (göğüs, omuz, triceps)', true, 6, 45, 'Push'),
  ('Pull Day', 'Çekme kasları (sırt, biceps)', true, 6, 45, 'Pull'),
  ('Leg Day', 'Bacak kasları', true, 7, 50, 'Legs'),
  ('Upper Body', 'Üst vücut (göğüs, sırt, omuz, kol)', true, 7, 55, 'Upper'),
  ('Lower Body', 'Alt vücut (bacak, kalça)', true, 6, 50, 'Lower');
```

## 3. ŞABLON EGZERSİZLERİ (Template Exercises)

### 3.1 Tam Vücut Şablonu

```sql
-- Önce template_id'yi alalım
DO $$
DECLARE
  v_template_id UUID;
  v_bench_press UUID;
  v_squat UUID;
  v_barbell_row UUID;
  v_overhead_press UUID;
  v_deadlift UUID;
  v_pull_up UUID;
  v_dips UUID;
  v_plank UUID;
BEGIN
  -- Template ID'yi al
  SELECT id INTO v_template_id FROM workout_templates WHERE name = 'Tam Vücut' AND is_global = true;
  
  -- Exercise ID'leri al
  SELECT id INTO v_bench_press FROM exercise_library WHERE name = 'Bench Press';
  SELECT id INTO v_squat FROM exercise_library WHERE name = 'Squat';
  SELECT id INTO v_barbell_row FROM exercise_library WHERE name = 'Barbell Row';
  SELECT id INTO v_overhead_press FROM exercise_library WHERE name = 'Overhead Press';
  SELECT id INTO v_deadlift FROM exercise_library WHERE name = 'Deadlift';
  SELECT id INTO v_pull_up FROM exercise_library WHERE name = 'Pull Up';
  SELECT id INTO v_dips FROM exercise_library WHERE name = 'Dips';
  SELECT id INTO v_plank FROM exercise_library WHERE name = 'Plank';
  
  -- Egzersizleri ekle
  INSERT INTO template_exercises (template_id, exercise_id, order_index, sets, reps, rest_seconds) VALUES
    (v_template_id, v_bench_press, 1, 4, '8-10', 90),
    (v_template_id, v_squat, 2, 4, '8-10', 120),
    (v_template_id, v_barbell_row, 3, 4, '8-10', 90),
    (v_template_id, v_overhead_press, 4, 3, '10-12', 60),
    (v_template_id, v_deadlift, 5, 3, '6-8', 120),
    (v_template_id, v_pull_up, 6, 3, '8-12', 90),
    (v_template_id, v_dips, 7, 3, '10-12', 60),
    (v_template_id, v_plank, 8, 3, '60sn', 45);
END $$;
```

### 3.2 Push Day Şablonu

```sql
DO $$
DECLARE
  v_template_id UUID;
  v_bench_press UUID;
  v_incline_press UUID;
  v_overhead_press UUID;
  v_lateral_raise UUID;
  v_triceps_pushdown UUID;
  v_overhead_triceps UUID;
BEGIN
  SELECT id INTO v_template_id FROM workout_templates WHERE name = 'Push Day' AND is_global = true;
  
  SELECT id INTO v_bench_press FROM exercise_library WHERE name = 'Bench Press';
  SELECT id INTO v_incline_press FROM exercise_library WHERE name = 'Incline Dumbbell Press';
  SELECT id INTO v_overhead_press FROM exercise_library WHERE name = 'Overhead Press';
  SELECT id INTO v_lateral_raise FROM exercise_library WHERE name = 'Lateral Raise';
  SELECT id INTO v_triceps_pushdown FROM exercise_library WHERE name = 'Triceps Pushdown';
  SELECT id INTO v_overhead_triceps FROM exercise_library WHERE name = 'Overhead Triceps Extension';
  
  INSERT INTO template_exercises (template_id, exercise_id, order_index, sets, reps, rest_seconds) VALUES
    (v_template_id, v_bench_press, 1, 4, '8-10', 90),
    (v_template_id, v_incline_press, 2, 3, '10-12', 60),
    (v_template_id, v_overhead_press, 3, 4, '8-10', 90),
    (v_template_id, v_lateral_raise, 4, 3, '12-15', 45),
    (v_template_id, v_triceps_pushdown, 5, 3, '12-15', 45),
    (v_template_id, v_overhead_triceps, 6, 3, '12-15', 45);
END $$;
```

### 3.3 Pull Day Şablonu

```sql
DO $$
DECLARE
  v_template_id UUID;
  v_deadlift UUID;
  v_barbell_row UUID;
  v_lat_pulldown UUID;
  v_pull_up UUID;
  v_barbell_curl UUID;
  v_hammer_curl UUID;
BEGIN
  SELECT id INTO v_template_id FROM workout_templates WHERE name = 'Pull Day' AND is_global = true;
  
  SELECT id INTO v_deadlift FROM exercise_library WHERE name = 'Deadlift';
  SELECT id INTO v_barbell_row FROM exercise_library WHERE name = 'Barbell Row';
  SELECT id INTO v_lat_pulldown FROM exercise_library WHERE name = 'Lat Pulldown';
  SELECT id INTO v_pull_up FROM exercise_library WHERE name = 'Pull Up';
  SELECT id INTO v_barbell_curl FROM exercise_library WHERE name = 'Barbell Curl';
  SELECT id INTO v_hammer_curl FROM exercise_library WHERE name = 'Hammer Curl';
  
  INSERT INTO template_exercises (template_id, exercise_id, order_index, sets, reps, rest_seconds) VALUES
    (v_template_id, v_deadlift, 1, 4, '6-8', 120),
    (v_template_id, v_barbell_row, 2, 4, '8-10', 90),
    (v_template_id, v_lat_pulldown, 3, 3, '10-12', 60),
    (v_template_id, v_pull_up, 4, 3, '8-12', 90),
    (v_template_id, v_barbell_curl, 5, 3, '10-12', 45),
    (v_template_id, v_hammer_curl, 6, 3, '12-15', 45);
END $$;
```

### 3.4 Leg Day Şablonu

```sql
DO $$
DECLARE
  v_template_id UUID;
  v_squat UUID;
  v_romanian UUID;
  v_leg_press UUID;
  v_leg_curl UUID;
  v_leg_extension UUID;
  v_lunges UUID;
  v_calf_raise UUID;
BEGIN
  SELECT id INTO v_template_id FROM workout_templates WHERE name = 'Leg Day' AND is_global = true;
  
  SELECT id INTO v_squat FROM exercise_library WHERE name = 'Squat';
  SELECT id INTO v_romanian FROM exercise_library WHERE name = 'Romanian Deadlift';
  SELECT id INTO v_leg_press FROM exercise_library WHERE name = 'Leg Press';
  SELECT id INTO v_leg_curl FROM exercise_library WHERE name = 'Leg Curl';
  SELECT id INTO v_leg_extension FROM exercise_library WHERE name = 'Leg Extension';
  SELECT id INTO v_lunges FROM exercise_library WHERE name = 'Lunges';
  
  INSERT INTO template_exercises (template_id, exercise_id, order_index, sets, reps, rest_seconds) VALUES
    (v_template_id, v_squat, 1, 4, '8-10', 120),
    (v_template_id, v_romanian, 2, 4, '8-10', 90),
    (v_template_id, v_leg_press, 3, 3, '12-15', 60),
    (v_template_id, v_leg_curl, 4, 3, '12-15', 45),
    (v_template_id, v_leg_extension, 5, 3, '12-15', 45),
    (v_template_id, v_lunges, 6, 3, '10-12', 60);
END $$;
```

## 4. DOĞRULAMA

Verilerin başarıyla eklendiğini kontrol edin:

```sql
-- Egzersiz sayısını kontrol et
SELECT COUNT(*) as exercise_count FROM exercise_library;
-- Sonuç: 46+ egzersiz olmalı

-- Şablon sayısını kontrol et
SELECT COUNT(*) as template_count FROM workout_templates WHERE is_global = true;
-- Sonuç: 6 şablon olmalı

-- Şablon egzersizlerini kontrol et
SELECT 
  wt.name as template_name,
  COUNT(te.id) as exercise_count
FROM workout_templates wt
LEFT JOIN template_exercises te ON te.template_id = wt.id
WHERE wt.is_global = true
GROUP BY wt.name;
-- Her şablon için egzersiz sayısını gösterir
```

## Tamamlandı!

Başlangıç verileri başarıyla eklendi. Artık uygulama kullanıma hazır!

### Sonraki Adımlar:

1. `.env` dosyasına Supabase URL ve Key'i ekleyin
2. Uygulamayı yeniden başlatın: `npm start`
3. İlk kullanıcı otomatik olarak oluşturulacak
4. Default motivasyon sözleri, hedefler ve rozetler otomatik eklenecek

