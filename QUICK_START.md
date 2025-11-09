# 🚀 Quick Start Guide

Fitness uygulamanızı hızlıca çalıştırmak için bu rehberi takip edin.

## 📋 Ön Gereksinimler

- Node.js 14+ yüklü olmalı
- Expo CLI yüklü olmalı (`npm install -g expo-cli`)
- Bir Supabase hesabı ([supabase.com](https://supabase.com))

---

## ⚡ 5 Dakikada Başlangıç

### 1. Supabase Projesi Oluştur (2 dk)

```bash
1. supabase.com'a gidin
2. "New Project" tıklayın
3. Proje adı ve şifre belirleyin
4. Create butonuna tıklayın
5. 1-2 dakika bekleyin
```

### 2. Database Kur (2 dk)

```bash
1. Supabase Dashboard > SQL Editor
2. New Query tıklayın
3. SUPABASE_SETUP.md dosyasındaki SQL'i kopyala-yapıştır
4. Run butonuna tıklayın
5. INITIAL_DATA.md dosyasındaki SQL'i de çalıştırın
```

### 3. API Anahtarlarını Al (30 sn)

```bash
1. Supabase Dashboard > Settings > API
2. Project URL kopyalayın
3. anon public key kopyalayın
```

### 4. Uygulamayı Yapılandır (30 sn)

FitnessApp dizininde `.env` dosyası oluşturun:

```env
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

### 5. Uygulamayı Başlat (30 sn)

```bash
cd FitnessApp
npm start
```

Web'de test etmek için `w` tuşuna basın.

---

## ✅ Doğrulama

Uygulama başarıyla çalışıyorsa:

1. ✅ Ana sayfa açılmalı
2. ✅ Console'da "User initialized" yazmalı
3. ✅ Supabase Dashboard > Authentication > Users bölümünde kullanıcı görünmeli
4. ✅ Database > users tablosunda kayıt olmalı

---

## 🐛 Sorun mu var?

### "Cannot find module '@supabase/supabase-js'"
```bash
cd FitnessApp
npm install
```

### "supabaseUrl is not defined"
`.env` dosyasını oluşturdunuz mu? Uygulamayı yeniden başlatın.

### "User initialization error"
Supabase'de SQL kodlarını çalıştırdınız mı? `get_or_create_user` function olmalı.

---

## 📱 Mobil Cihazda Test

1. Expo Go uygulamasını indirin (iOS/Android)
2. Terminal'de görünen QR kodu tarayın
3. Uygulama otomatik olarak açılacak

---

## 🎉 Hazırsınız!

Artık uygulamanız tam fonksiyonel. Keyifli kodlamalar! 💪

Detaylı bilgi için `IMPLEMENTATION_COMPLETE.md` dosyasına bakın.

