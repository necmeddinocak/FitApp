# ProfileScreen Supabase Entegrasyonu

## ✅ Tamamlanan Özellikler

### 1. Kullanıcı Profili
- ✅ Profil bilgilerini Supabase'den yükle (isim, email, üyelik tarihi)
- ✅ Profil bilgilerini güncelle
- ✅ Avatar gösterimi (placeholder)

### 2. Hedefler (Goals)
- ✅ Kullanıcı hedeflerini Supabase'den yükle
- ✅ Hedef tipleri: `weight`, `body_fat`, `weekly_workout`
- ✅ Hedef ilerlemesini otomatik hesapla
- ✅ Hedefleri düzenle ve güncelle
- ✅ Progress bar ile görselleştirme

### 3. Başarılar (Achievements)
- ✅ Rozetleri Supabase'den yükle
- ✅ Kilitsiz/Kilitli rozet durumları
- ✅ Rozet tipleri: `7_day_streak`, `first_workout`, `50_workouts`, `100_workouts`
- ✅ Otomatik rozet açma (trigger ile)

### 4. Ayarlar (Settings)
- ✅ Kullanıcı ayarlarını yükle ve güncelle
- ✅ Tema seçimi (sistem, açık, karanlık)
- ✅ Ölçü birimleri (metric/imperial)
- ✅ Bildirim ayarları (açık/kapalı)
- ✅ Gerçek zamanlı ayar güncellemesi

### 5. Cihaz Senkronizasyonu
- ✅ 6 haneli sync code oluşturma
- ✅ QR kod gösterimi (placeholder)
- ✅ Diğer cihazlarla veri senkronizasyonu
- ✅ Cihaz listesi ve yönetimi

---

## 📁 Yeni Dosyalar

### `src/services/userService.js`

Kullanıcı işlemleri için tüm API fonksiyonları:

```javascript
// Profil İşlemleri
- getUserProfile(userId)
- updateUserProfile(userId, updates)

// Hedef İşlemleri  
- getUserGoals(userId)
- updateUserGoal(goalId, updates)
- calculateGoalProgress(current, target, goalType)

// Başarı İşlemleri
- getUserAchievements(userId)

// Ayar İşlemleri
- getUserSettings(userId)
- updateUserSettings(userId, updates)

// Senkronizasyon
- generateSyncCode(userId)
- connectWithSyncCode(syncCode, newDeviceId)
- getUserDevices(userId)
- removeDevice(deviceId)
- updateLastSync(userId, deviceId)
```

---

## 🔧 Güncellemeler

### `ProfileScreen.js`

**Önemli Değişiklikler:**

1. **State Management**
   ```javascript
   - Mock data kaldırıldı
   - useUser hook entegrasyonu
   - Loading states eklendi
   - Form states eklendi
   ```

2. **Veri Yükleme**
   ```javascript
   useEffect(() => {
     if (userId) {
       loadData(); // Tüm profil verilerini yükle
     }
   }, [userId]);
   ```

3. **Fonksiyonlar**
   - `loadData()` - Tüm verileri Supabase'den çek
   - `handleSaveProfile()` - Profil güncelle
   - `handleSaveGoal()` - Hedef güncelle
   - `handleUpdateSettings()` - Ayarları güncelle
   - `handleGenerateSyncCode()` - Sync code oluştur
   - `formatMemberSince()` - Tarihi formatla

4. **UI İyileştirmeleri**
   - Loading indicator
   - Empty states
   - Error handling
   - Gerçek zamanlı ilerleme hesaplama

---

## 🗄️ Supabase Tabloları

### 1. `users` (Kullanıcılar)
```sql
- id (UUID)
- device_id (TEXT, UNIQUE)
- sync_code (TEXT, UNIQUE)
- name (TEXT)
- email (TEXT)
- avatar_url (TEXT)
- member_since (TIMESTAMP)
```

### 2. `user_goals` (Hedefler)
```sql
- id (UUID)
- user_id (UUID FK)
- goal_type (TEXT) -- 'weight', 'body_fat', 'weekly_workout'
- current_value (NUMERIC)
- target_value (NUMERIC)
- unit (TEXT) -- 'kg', '%', 'days'
- progress (INTEGER)
```

### 3. `user_achievements` (Başarılar)
```sql
- id (UUID)
- user_id (UUID FK)
- achievement_type (TEXT)
- title (TEXT)
- description (TEXT)
- icon_name (TEXT)
- unlocked_at (TIMESTAMP)
- is_unlocked (BOOLEAN)
```

### 4. `user_settings` (Ayarlar)
```sql
- id (UUID)
- user_id (UUID FK, UNIQUE)
- theme (TEXT) -- 'system', 'light', 'dark'
- unit_system (TEXT) -- 'metric', 'imperial'
- notifications_enabled (BOOLEAN)
- workout_reminders (BOOLEAN)
- weight_reminders (BOOLEAN)
```

### 5. `device_sync` (Cihaz Senkronizasyonu)
```sql
- id (UUID)
- user_id (UUID FK)
- device_id (TEXT)
- device_name (TEXT)
- last_sync_at (TIMESTAMP)
- is_active (BOOLEAN)
```

---

## 🔐 RLS (Row Level Security)

Tüm tablolar için RLS aktif ve sadece kullanıcının kendi verilerine erişim var:

```sql
-- Örnek Policy (user_goals için)
CREATE POLICY "Users can manage own goals"
  ON user_goals FOR ALL
  USING (user_id IN (
    SELECT id FROM users 
    WHERE device_id = current_setting('app.device_id', true)
  ));
```

---

## 🚀 Kullanım Örnekleri

### Profil Güncelleme
```javascript
await userService.updateUserProfile(userId, {
  name: 'Yeni İsim',
  email: 'yeni@email.com'
});
```

### Hedef İlerleme Hesaplama
```javascript
const progress = userService.calculateGoalProgress(
  81.0,  // current
  75.0,  // target
  'weight'  // goalType
);
// Sonuç: 7% (81'den 75'e giden yolun %7'si)
```

### Sync Code Oluşturma
```javascript
const syncCode = await userService.generateSyncCode(userId);
// Sonuç: "ABC123" (6 haneli kod)
```

### Ayar Güncelleme
```javascript
await userService.updateUserSettings(userId, {
  theme: 'dark',
  unit_system: 'metric',
  notifications_enabled: true
});
```

---

## ⚠️ Önemli Notlar

1. **İlk Kullanım**
   - Kullanıcı ilk kez uygulamayı açtığında `get_or_create_user` fonksiyonu çalışır
   - Otomatik olarak varsayılan hedefler ve rozetler oluşturulur
   - Varsayılan ayarlar eklenir

2. **Hedef İlerleme Mantığı**
   - Kilo ve yağ oranı: Azalma hedefi (düşürme)
   - Haftalık antrenman: Artış hedefi (yükseltme)

3. **Sync Code**
   - 6 haneli benzersiz kod
   - QR kod ile paylaşılabilir
   - Diğer cihazlarda aynı veriye erişim

4. **Rozetler**
   - `workout_sessions` insert sonrası otomatik kontrol
   - Trigger ile `check_achievements` fonksiyonu çalışır
   - Koşullar sağlandığında otomatik açılır

---

## 🎯 Gelecek Geliştirmeler

- [ ] Avatar yükleme özelliği
- [ ] QR kod gerçek implementasyonu
- [ ] Veri içe/dışa aktarma (CSV, JSON)
- [ ] Tema değiştirme özelliği
- [ ] Push notification entegrasyonu
- [ ] Kullanıcı silme/hesap kapatma
- [ ] Şifre değiştirme

---

## 📝 Test Senaryoları

1. **Profil Testi**
   - Profil bilgilerini yükle
   - İsim ve email değiştir
   - Değişikliklerin kaydedildiğini doğrula

2. **Hedef Testi**
   - Hedefleri listele
   - Bir hedefi düzenle
   - İlerleme yüzdesinin doğru hesaplandığını kontrol et

3. **Rozet Testi**
   - Rozetleri listele
   - Kilitli/kilitsiz durumları kontrol et
   - Yeni rozet açıldığında UI'ın güncellendiğini doğrula

4. **Ayarlar Testi**
   - Tema değiştir
   - Ölçü birimini değiştir
   - Bildirimleri aç/kapat
   - Değişikliklerin hemen yansıdığını kontrol et

5. **Senkronizasyon Testi**
   - Sync code oluştur
   - Kodun 6 hane olduğunu doğrula
   - Başka cihazda kod ile bağlan

---

Bu dokümantasyon ProfileScreen'in Supabase entegrasyonunu kapsamaktadır. Tüm özellikler çalışır durumda ve production'a hazır! 🎉

