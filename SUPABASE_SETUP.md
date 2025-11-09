# Supabase Setup Guide

Bu rehber, Fitness uygulaması için Supabase database kurulumunu adım adım anlatır.

## 1. Supabase Projesi Oluşturma

1. [supabase.com](https://supabase.com) adresine gidin
2. "New Project" butonuna tıklayın
3. Proje adı ve şifreyi belirleyin
4. Bölge seçin (en yakın bölgeyi seçin)
5. Projenin oluşmasını bekleyin (1-2 dakika)

## 2. SQL Editor'ı Açma

1. Sol menüden "SQL Editor" seçeneğine tıklayın
2. "New Query" butonuna tıklayın
3. Aşağıdaki SQL kodlarını sırayla çalıştırın

---

## 3. DATABASE TABLOLARI

### Adım 1: Tabloları Oluştur

Aşağıdaki SQL'i çalıştırın:

```sql
-- 1.1 Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_id TEXT UNIQUE NOT NULL,
  sync_code TEXT UNIQUE,
  name TEXT DEFAULT 'Kullanıcı',
  email TEXT,
  avatar_url TEXT,
  member_since TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_device_id ON users(device_id);
CREATE INDEX idx_users_sync_code ON users(sync_code);

-- 1.2 User Goals
CREATE TABLE user_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  goal_type TEXT NOT NULL,
  current_value NUMERIC NOT NULL,
  target_value NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  progress INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, goal_type)
);

CREATE INDEX idx_user_goals_user_id ON user_goals(user_id);

-- 1.3 Exercise Library
CREATE TABLE exercise_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  muscle_group TEXT NOT NULL,
  equipment TEXT,
  difficulty TEXT,
  instructions TEXT,
  video_url TEXT,
  image_url TEXT,
  is_global BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_exercise_library_muscle_group ON exercise_library(muscle_group);
CREATE INDEX idx_exercise_library_equipment ON exercise_library(equipment);

-- 1.4 Workout Templates
CREATE TABLE workout_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_global BOOLEAN DEFAULT false,
  exercise_count INTEGER DEFAULT 0,
  estimated_duration INTEGER,
  difficulty TEXT,
  category TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_workout_templates_user_id ON workout_templates(user_id);
CREATE INDEX idx_workout_templates_global ON workout_templates(is_global);

-- 1.5 Template Exercises
CREATE TABLE template_exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id UUID REFERENCES workout_templates(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercise_library(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  sets INTEGER NOT NULL,
  reps TEXT NOT NULL,
  rest_seconds INTEGER DEFAULT 60,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_template_exercises_template_id ON template_exercises(template_id);

-- 1.6 Workout Programs
CREATE TABLE workout_programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_workout_programs_user_id ON workout_programs(user_id);
CREATE INDEX idx_workout_programs_active ON workout_programs(user_id, is_active);

-- 1.7 Program Workouts
CREATE TABLE program_workouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_id UUID REFERENCES workout_programs(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL,
  workout_name TEXT NOT NULL,
  template_id UUID REFERENCES workout_templates(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_program_workouts_program_id ON program_workouts(program_id);

-- 1.8 Program Exercises
CREATE TABLE program_exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_workout_id UUID REFERENCES program_workouts(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercise_library(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  sets INTEGER NOT NULL,
  reps TEXT NOT NULL,
  weight NUMERIC,
  rest_seconds INTEGER DEFAULT 60,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_program_exercises_workout_id ON program_exercises(program_workout_id);

-- 1.9 Workout Sessions
CREATE TABLE workout_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  program_workout_id UUID REFERENCES program_workouts(id) ON DELETE SET NULL,
  workout_date DATE NOT NULL,
  duration_minutes INTEGER,
  total_sets INTEGER DEFAULT 0,
  total_tonnage NUMERIC DEFAULT 0,
  notes TEXT,
  completed BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_workout_sessions_user_id ON workout_sessions(user_id);
CREATE INDEX idx_workout_sessions_date ON workout_sessions(user_id, workout_date);

-- 1.10 Weight Tracking
CREATE TABLE weight_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercise_library(id) ON DELETE CASCADE,
  session_id UUID REFERENCES workout_sessions(id) ON DELETE SET NULL,
  workout_date DATE NOT NULL,
  weight NUMERIC NOT NULL,
  reps INTEGER NOT NULL,
  rpe NUMERIC,
  e1rm NUMERIC,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_weight_tracking_user_exercise ON weight_tracking(user_id, exercise_id);
CREATE INDEX idx_weight_tracking_date ON weight_tracking(workout_date);

-- 1.11 Body Weight Tracking
CREATE TABLE body_weight_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  weight NUMERIC NOT NULL,
  body_fat_percentage NUMERIC,
  measurement_date DATE NOT NULL,
  measurement_time TIME DEFAULT CURRENT_TIME,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_body_weight_user_date ON body_weight_tracking(user_id, measurement_date);

-- 1.12 Motivational Quotes
CREATE TABLE motivational_quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  quote TEXT NOT NULL,
  author TEXT,
  category TEXT,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_motivational_quotes_user_id ON motivational_quotes(user_id);
CREATE INDEX idx_motivational_quotes_category ON motivational_quotes(user_id, category);
CREATE INDEX idx_motivational_quotes_favorite ON motivational_quotes(user_id, is_favorite);

-- 1.13 User Achievements
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon_name TEXT,
  unlocked_at TIMESTAMP,
  is_unlocked BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE UNIQUE INDEX idx_user_achievements_type ON user_achievements(user_id, achievement_type);

-- 1.14 User Settings
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  theme TEXT DEFAULT 'system',
  unit_system TEXT DEFAULT 'metric',
  notifications_enabled BOOLEAN DEFAULT true,
  workout_reminders BOOLEAN DEFAULT true,
  weight_reminders BOOLEAN DEFAULT true,
  weight_reminder_time TIME DEFAULT '08:00:00',
  motivation_notifications BOOLEAN DEFAULT true,
  motivation_time_morning TIME DEFAULT '08:00:00',
  motivation_time_evening TIME DEFAULT '20:00:00',
  do_not_disturb_start TIME DEFAULT '22:00:00',
  do_not_disturb_end TIME DEFAULT '08:00:00',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);

-- 1.15 Device Sync
CREATE TABLE device_sync (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  device_id TEXT NOT NULL,
  device_name TEXT,
  last_sync_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_device_sync_user_id ON device_sync(user_id);
CREATE INDEX idx_device_sync_device_id ON device_sync(device_id);
```

### Adım 2: RLS (Row Level Security) Aktifleştir

```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE body_weight_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE motivational_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_sync ENABLE ROW LEVEL SECURITY;
```

### Adım 3: RLS Policies Oluştur

```sql
-- Exercise Library (herkes okuyabilir, herkes kendi egzersizini ekleyebilir)
CREATE POLICY "Anyone can view exercise library"
  ON exercise_library FOR SELECT
  USING (is_global = true OR is_global = false);

CREATE POLICY "Anyone can insert custom exercises"
  ON exercise_library FOR INSERT
  WITH CHECK (is_global = false);

-- Users (herkes kendi kaydını görebilir)
CREATE POLICY "Users can view own record"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Users can update own record"
  ON users FOR UPDATE
  USING (true);

CREATE POLICY "Users can insert own record"
  ON users FOR INSERT
  WITH CHECK (true);

-- User Goals
CREATE POLICY "Users can manage own goals"
  ON user_goals FOR ALL
  USING (true);

-- Workout Templates
CREATE POLICY "Anyone can view global templates"
  ON workout_templates FOR SELECT
  USING (is_global = true OR true);

CREATE POLICY "Users can create own templates"
  ON workout_templates FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own templates"
  ON workout_templates FOR UPDATE
  USING (true);

CREATE POLICY "Users can delete own templates"
  ON workout_templates FOR DELETE
  USING (true);

-- Template Exercises
CREATE POLICY "Users can manage template exercises"
  ON template_exercises FOR ALL
  USING (true);

-- Workout Programs
CREATE POLICY "Users can manage own programs"
  ON workout_programs FOR ALL
  USING (true);

-- Program Workouts
CREATE POLICY "Users can manage program workouts"
  ON program_workouts FOR ALL
  USING (true);

-- Program Exercises
CREATE POLICY "Users can manage program exercises"
  ON program_exercises FOR ALL
  USING (true);

-- Workout Sessions
CREATE POLICY "Users can manage own sessions"
  ON workout_sessions FOR ALL
  USING (true);

-- Weight Tracking
CREATE POLICY "Users can manage own weight tracking"
  ON weight_tracking FOR ALL
  USING (true);

-- Body Weight Tracking
CREATE POLICY "Users can manage own body weight"
  ON body_weight_tracking FOR ALL
  USING (true);

-- Motivational Quotes
CREATE POLICY "Users can manage own quotes"
  ON motivational_quotes FOR ALL
  USING (true);

-- User Achievements
CREATE POLICY "Users can view own achievements"
  ON user_achievements FOR ALL
  USING (true);

-- User Settings
CREATE POLICY "Users can manage own settings"
  ON user_settings FOR ALL
  USING (true);

-- Device Sync
CREATE POLICY "Users can manage own devices"
  ON device_sync FOR ALL
  USING (true);
```

### Adım 4: Database Functions Oluştur

```sql
-- Get or Create User Function
CREATE OR REPLACE FUNCTION get_or_create_user(p_device_id TEXT)
RETURNS UUID AS $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT id INTO v_user_id FROM users WHERE device_id = p_device_id;
  
  IF v_user_id IS NULL THEN
    INSERT INTO users (device_id)
    VALUES (p_device_id)
    RETURNING id INTO v_user_id;
    
    INSERT INTO user_settings (user_id) VALUES (v_user_id);
    
    INSERT INTO user_goals (user_id, goal_type, current_value, target_value, unit)
    VALUES 
      (v_user_id, 'weight', 80, 75, 'kg'),
      (v_user_id, 'body_fat', 20, 15, '%'),
      (v_user_id, 'weekly_workout', 0, 5, 'days');
    
    INSERT INTO user_achievements (user_id, achievement_type, title, description, icon_name)
    VALUES
      (v_user_id, '7_day_streak', '7 Gün Seri', '7 gün üst üste antrenman yap', 'flame'),
      (v_user_id, 'first_workout', 'İlk Antrenman', 'İlk antrenmanını tamamla', 'trophy'),
      (v_user_id, '50_workouts', '50 Antrenman', '50 antrenman tamamla', 'medal'),
      (v_user_id, '100_workouts', '100 Antrenman', '100 antrenman tamamla', 'ribbon');
  END IF;
  
  RETURN v_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Generate Sync Code Function
CREATE OR REPLACE FUNCTION generate_sync_code()
RETURNS TEXT AS $$
DECLARE
  v_code TEXT;
  v_exists BOOLEAN;
BEGIN
  LOOP
    v_code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
    SELECT EXISTS(SELECT 1 FROM users WHERE sync_code = v_code) INTO v_exists;
    EXIT WHEN NOT v_exists;
  END LOOP;
  
  RETURN v_code;
END;
$$ LANGUAGE plpgsql;

-- Calculate E1RM Function
CREATE OR REPLACE FUNCTION calculate_e1rm(p_weight NUMERIC, p_reps INTEGER)
RETURNS NUMERIC AS $$
BEGIN
  RETURN ROUND(p_weight * (1 + p_reps::NUMERIC / 30), 1);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Calculate User Streak Function
CREATE OR REPLACE FUNCTION calculate_user_streak(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_streak INTEGER := 0;
  v_date DATE := CURRENT_DATE;
BEGIN
  LOOP
    IF EXISTS(
      SELECT 1 FROM workout_sessions 
      WHERE user_id = p_user_id 
      AND workout_date = v_date 
      AND completed = true
    ) THEN
      v_streak := v_streak + 1;
      v_date := v_date - INTERVAL '1 day';
    ELSE
      EXIT;
    END IF;
  END LOOP;
  
  RETURN v_streak;
END;
$$ LANGUAGE plpgsql;
```

### Adım 5: Triggers Oluştur

```sql
-- Updated_at Trigger Function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_goals_updated_at BEFORE UPDATE ON user_goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workout_templates_updated_at BEFORE UPDATE ON workout_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_program_exercises_updated_at BEFORE UPDATE ON program_exercises
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- E1RM Auto Calculate Trigger
CREATE OR REPLACE FUNCTION auto_calculate_e1rm()
RETURNS TRIGGER AS $$
BEGIN
  NEW.e1rm := calculate_e1rm(NEW.weight, NEW.reps);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_e1rm_on_insert BEFORE INSERT ON weight_tracking
  FOR EACH ROW EXECUTE FUNCTION auto_calculate_e1rm();

CREATE TRIGGER calculate_e1rm_on_update BEFORE UPDATE ON weight_tracking
  FOR EACH ROW EXECUTE FUNCTION auto_calculate_e1rm();

-- Achievement Check Trigger
CREATE OR REPLACE FUNCTION check_achievements()
RETURNS TRIGGER AS $$
DECLARE
  v_workout_count INTEGER;
  v_streak INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_workout_count 
  FROM workout_sessions 
  WHERE user_id = NEW.user_id AND completed = true;
  
  IF v_workout_count = 1 THEN
    UPDATE user_achievements 
    SET is_unlocked = true, unlocked_at = NOW()
    WHERE user_id = NEW.user_id AND achievement_type = 'first_workout';
  END IF;
  
  IF v_workout_count = 50 THEN
    UPDATE user_achievements 
    SET is_unlocked = true, unlocked_at = NOW()
    WHERE user_id = NEW.user_id AND achievement_type = '50_workouts';
  END IF;
  
  IF v_workout_count = 100 THEN
    UPDATE user_achievements 
    SET is_unlocked = true, unlocked_at = NOW()
    WHERE user_id = NEW.user_id AND achievement_type = '100_workouts';
  END IF;
  
  v_streak := calculate_user_streak(NEW.user_id);
  IF v_streak >= 7 THEN
    UPDATE user_achievements 
    SET is_unlocked = true, unlocked_at = NOW()
    WHERE user_id = NEW.user_id AND achievement_type = '7_day_streak';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_achievements_after_workout AFTER INSERT ON workout_sessions
  FOR EACH ROW EXECUTE FUNCTION check_achievements();
```

---

## 4. BAŞLANGIÇ VERİLERİNİ EKLE

Sonraki adım için `INITIAL_DATA.md` dosyasına bakın.

---

## 5. SUPABASE AYARLARINI UYGULAMAYA EKLE

1. Supabase Dashboard'dan "Settings" > "API" bölümüne gidin
2. `Project URL` ve `anon public` key'i kopyalayın
3. FitnessApp dizininde `.env` dosyası oluşturun:

```
EXPO_PUBLIC_SUPABASE_URL=your_project_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

4. Uygulamayı yeniden başlatın

---

## Tamamlandı!

Database kurulumu tamamlandı. Artık React Native uygulamanız Supabase ile çalışmaya hazır!

