# 🚀 FitnessApp - Hızlı Başlangıç Rehberi

## 📱 Uygulamanın Reklamlı Halini Çalıştırma

### **ADIM 1: Gerekli Araçları Kontrol Edin**

✅ **Node.js** yüklü mü?
```bash
node --version
# v18.0.0 veya üzeri olmalı
```

✅ **Android Studio** yüklü mü?
- [Android Studio İndir](https://developer.android.com/studio)
- Android SDK'yı yükleyin
- Bir emulator oluşturun (Pixel 5 - API 33 önerilir)

---

### **ADIM 2: Projeyi Hazırlayın**

```bash
# Proje dizinine gidin
cd "C:\Users\Necmettin OCAK\Desktop\udemykursu1\FitnessApp"

# Bağımlılıkları yükleyin (ilk kez yapıyorsanız)
npm install
```

---

### **ADIM 3: Android Emulator'ı Başlatın**

1. **Android Studio'yu açın**
2. **Tools → Device Manager** menüsüne gidin
3. Bir cihaz seçip **▶ Play** butonuna basın

**Emulator'ın çalıştığını kontrol edin:**
```bash
adb devices
# Listede bir cihaz görmelisiniz
```

---

### **ADIM 4: Uygulamayı Çalıştırın**

```bash
# Tek komutla build + çalıştır
npx expo run:android
```

**Bu komut:**
- ✅ Native Android uygulamasını derler
- ✅ APK'yı emulator'a yükler
- ✅ Uygulamayı otomatik başlatır
- ✅ Metro bundler'ı başlatır

**İlk build 5-10 dakika sürebilir.** ☕

---

### **ADIM 5: Reklamları Kontrol Edin**

Uygulama açıldığında:

1. **Ana Sayfa (Home Screen)** açılacak
2. **Header'ın altında** banner reklam göreceksiniz
3. Test reklamı: **"Test Ad"** yazısı görünecek

**Test Reklam Özellikleri:**
- ✅ Gerçek reklam gibi görünür
- ✅ Tıklanabilir (test amaçlı)
- ✅ Hesabınız ban yemez
- ✅ Gelir sağlamaz

---

## 🔄 Değişiklik Yaptıktan Sonra

### **Kod Değişikliği (JavaScript)**
Değişiklikler otomatik yüklenir (Hot Reload).

### **Native Kod Değişikliği (app.json, AdMob ayarları)**
```bash
# Prebuild yap
npx expo prebuild --clean

# Tekrar çalıştır
npx expo run:android
```

---

## 🐛 Sorun Giderme

### **Problem 1: "ANDROID_HOME not set"**
**Çözüm:**
```bash
# Windows için (PowerShell)
$env:ANDROID_HOME = "C:\Users\KULLANICI_ADI\AppData\Local\Android\Sdk"
$env:PATH += ";$env:ANDROID_HOME\platform-tools"
```

### **Problem 2: "No devices/emulators found"**
**Çözüm:**
1. Android Studio'dan emulator'ı başlatın
2. `adb devices` ile kontrol edin

### **Problem 3: "Build failed"**
**Çözüm:**
```bash
# Cache'i temizle
npx expo start --clear

# Node modules'ü yeniden yükle
rm -rf node_modules
npm install

# Prebuild'i temizle
npx expo prebuild --clean
```

### **Problem 4: Reklam görünmüyor**
**Çözüm:**
- İnternet bağlantısını kontrol edin
- Emulator'ı yeniden başlatın
- Uygulamayı kapatıp açın
- Test ID'lerinin doğru olduğunu kontrol edin

---

## 📊 Reklam Test Senaryoları

### **Senaryo 1: Banner Reklam**
1. Uygulamayı açın
2. Ana sayfada banner reklam görülecek
3. Scroll yapınca sabit kalmalı

### **Senaryo 2: Farklı Ekranlar**
1. Diğer sekmelere gidin (Program, Takip, Motivasyon, Profil)
2. Ana sayfaya dönün
3. Reklam hala görünmeli

### **Senaryo 3: Uygulama Arka Plana Gittiğinde**
1. Uygulamayı minimize edin
2. Tekrar açın
3. Reklam yeniden yüklenmeli

---

## 🎯 Gerçek Reklamlara Geçiş

Detaylı bilgi için: **[ADMOB_INTEGRATION.md](./ADMOB_INTEGRATION.md)** dosyasına bakın.

**Kısaca:**
1. [AdMob Console](https://apps.admob.com/)'da hesap oluşturun
2. Uygulama ekleyin ve Ad Unit ID'lerini alın
3. `app.json` ve `src/services/adMobService.js` dosyalarını güncelleyin
4. Prebuild yapın ve test edin
5. Play Store'a yayınlayın

---

## 📝 Önemli Dosyalar

| Dosya | Açıklama |
|-------|----------|
| `app.json` | AdMob App ID'leri |
| `src/services/adMobService.js` | Reklam yönetimi |
| `src/screens/HomeScreen.js` | Banner reklam gösterimi |
| `App.js` | AdMob başlatma |
| `ADMOB_INTEGRATION.md` | Detaylı AdMob rehberi |

---

## ⚡ Hızlı Komutlar

```bash
# Android'de çalıştır
npx expo run:android

# iOS'ta çalıştır (Mac gerekli)
npx expo run:ios

# Web'de çalıştır (reklamsız)
npx expo start --web

# Cache'i temizle
npx expo start --clear

# Prebuild'i temizle
npx expo prebuild --clean

# Emulator listesi
adb devices

# Logları izle
npx expo start --android
```

---

## 🎉 Başarılı Kurulum Kontrolü

✅ Uygulama açılıyor  
✅ Ana sayfada banner reklam görünüyor  
✅ "Test Ad" yazısı görünüyor  
✅ Diğer sayfalar çalışıyor  
✅ Çıkış yapma fonksiyonu çalışıyor  
✅ Supabase bağlantısı aktif  

**Hepsi tamamsa, başarıyla kuruldu! 🎊**

---

## 📞 Destek

**Sorun mu yaşıyorsunuz?**
1. [ADMOB_INTEGRATION.md](./ADMOB_INTEGRATION.md) dosyasını okuyun
2. [Expo Docs](https://docs.expo.dev/) kontrol edin
3. [GitHub Issues](https://github.com/necmeddinocak/FitnessApp/issues) açın

---

**İyi geliştirmeler! 💪**

