# 📱 EAS Build - iOS Kullanım Kılavuzu

## ✅ Tamamlanan Hazırlıklar

1. ✅ **EAS CLI Kurulumu** - Global olarak yüklendi
2. ✅ **EAS Proje Oluşturma** - Expo hesabınıza bağlandı
3. ✅ **eas.json Yapılandırması** - iOS build profilleri hazır
4. ✅ **AdMob Entegrasyonu** - Native modül hazır

---

## 🚀 iOS Build Başlatma

### Adım 1: iOS Preview Build (Önerilen)

Bu build türü:
- ✅ Apple Developer hesabı **gerekmez** (Expo managed)
- ✅ TestFlight veya doğrudan yükleme
- ✅ AdMob tam çalışır
- ✅ 15-20 dakikada hazır

```bash
cd "C:\Users\Necmettin OCAK\Desktop\udemykursu1\FitnessApp"
eas build --platform ios --profile preview
```

### Adım 2: Build Süreci

Komut çalıştırıldığında:

1. **Credentials Seçimi:**
   ```
   ? How would you like to authenticate?
   > Let Expo handle the process
   ```
   → Enter tuşuna basın (Expo otomatik halleder)

2. **Build Başlıyor:**
   ```
   ✔ Build started
   🔗 Build details: https://expo.dev/accounts/n.ocak/projects/FitnessApp/builds/...
   ```

3. **Build Durumu:**
   - Linke tıklayarak web'den takip edebilirsiniz
   - Veya terminal'de bekleyin (~15-20 dakika)

4. **Build Tamamlandı:**
   ```
   ✔ Build finished
   📦 IPA Download: https://expo.dev/...
   ```

---

## 📲 iOS Telefonunuza Yükleme

### Yöntem 1: Doğrudan Yükleme (En Kolay)

1. **iPhone Safari'den Build Linkine Gidin:**
   - EAS Dashboard: https://expo.dev/accounts/n.ocak/projects/FitnessApp/builds
   - Son build'e tıklayın

2. **"Install" Butonuna Basın**
   - IPA dosyası otomatik indirilir
   - Yükleme başlar

3. **Güven Ayarı:**
   - Ayarlar → Genel → VPN ve Cihaz Yönetimi
   - "Apple Development: ..." altında uygulamayı bulun
   - "Güven" butonuna basın

4. **Uygulamayı Açın:**
   - Ana ekranda FitnessApp ikonuna dokunun
   - **AdMob reklamları çalışacak!** 🎉

### Yöntem 2: TestFlight (Daha Uzun Ama Güvenilir)

1. **App Store Connect Ayarları Gerekir**
   - Apple Developer hesabı gerektirir ($99/yıl)

2. **EAS Submit Komutu:**
   ```bash
   eas submit --platform ios
   ```

3. **TestFlight'dan İndirme:**
   - TestFlight uygulamasını yükleyin
   - Davet linkine tıklayın
   - Uygulamayı yükleyin

---

## 🛠️ Build Profilleri

### Preview (Hızlı Test - Önerilen)

```bash
eas build --platform ios --profile preview
```

**Özellikler:**
- ✅ Doğrudan telefona yüklenir
- ✅ Apple Developer hesabı gerekmez
- ✅ 7 gün geçerlidir
- ✅ AdMob çalışır
- ⏱️ 15-20 dakika

### Development (Geliştirme)

```bash
eas build --platform ios --profile development
```

**Özellikler:**
- ✅ Hot reload destekler
- ✅ Hızlı debug
- ⚠️ Simulator build (gerçek telefonda çalışmaz)
- ⏱️ 10-15 dakika

### Production (Canlı Yayın)

```bash
eas build --platform ios --profile production
```

**Özellikler:**
- ✅ App Store'a gönderilir
- ✅ Tam optimize
- ⚠️ Apple Developer hesabı gerekir
- ⏱️ 20-25 dakika

---

## 📊 Build Takibi

### Web Dashboard

https://expo.dev/accounts/n.ocak/projects/FitnessApp/builds

**Burada görebileceğiniz bilgiler:**
- ✅ Build durumu (in progress, finished, failed)
- ✅ Build logs
- ✅ Download link (IPA)
- ✅ QR kod
- ✅ Build süresi

### Terminal Takibi

```bash
# Build durumunu kontrol et
eas build:list --platform ios

# Son build'in detaylarını gör
eas build:view
```

---

## 🔧 Sık Karşılaşılan Sorunlar

### 1. "Build failed: Invalid credentials"

**Çözüm:**
```bash
# Credentials'ı temizle
eas credentials --platform ios

# Yeniden build
eas build --platform ios --profile preview
```

### 2. "Unable to install app"

**Çözüm:**
- iPhone'u yeniden başlatın
- Ayarlar → Genel → VPN ve Cihaz Yönetimi → Güven ayarını kontrol edin
- Build'i yeniden indirin

### 3. "App crashes on launch"

**Çözüm:**
```bash
# Logs'u kontrol et
eas build:view

# Clean build
eas build --platform ios --profile preview --clear-cache
```

### 4. "AdMob reklamları görünmüyor"

**Çözüm:**
- ✅ Native build mi kontrol edin (Expo Go'da çalışmaz)
- ✅ `app.json` içinde AdMob ID'leri doğru mu kontrol edin
- ✅ İnternet bağlantısı var mı kontrol edin
- ✅ Test ID'leri kullanıyorsanız, cihazın test modu aktif olmalı

---

## 🎯 Hızlı Referans

### Build Başlatma

```bash
cd "C:\Users\Necmettin OCAK\Desktop\udemykursu1\FitnessApp"
eas build --platform ios --profile preview
```

### Build Durumunu Görme

```bash
eas build:list --platform ios
```

### Build'i İndirme (Terminal'den)

```bash
eas build:view
# Download URL'sini kopyalayın ve tarayıcıda açın
```

### Yeni Build (Cache Temizle)

```bash
eas build --platform ios --profile preview --clear-cache
```

---

## 📱 Build Sonrası Checklist

- [ ] Build tamamlandı mı?
- [ ] IPA dosyası indirildi mi?
- [ ] iPhone'a yüklendi mi?
- [ ] "Güven" ayarı yapıldı mı?
- [ ] Uygulama açılıyor mu?
- [ ] Ana sayfa yükleniyor mu?
- [ ] Supabase veriler geliyor mu?
- [ ] **AdMob banner reklamı görünüyor mu?** ✅
- [ ] Diğer ekranlar çalışıyor mu?
- [ ] Egzersiz ekleme/silme çalışıyor mu?

---

## 💡 İpuçları

1. **Build Süresi:**
   - İlk build: ~20 dakika
   - Sonraki buildler: ~15 dakika (cache sayesinde)

2. **Paralel Build:**
   - Aynı anda hem iOS hem Android build yapabilirsiniz:
     ```bash
     eas build --platform all --profile preview
     ```

3. **Build Limiti:**
   - Free plan: 30 build/ay
   - Her build iOS + Android = 2 build sayılır

4. **Notification:**
   - Build tamamlandığında email gelir
   - Web dashboard'dan da takip edebilirsiniz

5. **Versiyon Yönetimi:**
   - `app.json` içinde version numarasını güncelleyin
   - EAS otomatik build number artırır

---

## 🔗 Yararlı Linkler

- **EAS Dashboard:** https://expo.dev/accounts/n.ocak/projects/FitnessApp
- **EAS Build Docs:** https://docs.expo.dev/build/introduction/
- **iOS Credentials:** https://docs.expo.dev/app-signing/managed-credentials/
- **TestFlight Guide:** https://docs.expo.dev/submit/ios/

---

## 🎉 Başarılı Build Sonrası

Build başarılı olduktan sonra:

1. ✅ IPA dosyanızı telefonunuza yükleyin
2. ✅ AdMob reklamlarını test edin
3. ✅ Tüm özelliklerin çalıştığını doğrulayın
4. ✅ TestFlight için submit edin (opsiyonel)
5. ✅ Production build yapın (App Store için)

**Tebrikler! iOS uygulamanız hazır!** 🎊

---

## 📞 Destek

Sorun yaşarsanız:
- EAS Dashboard'daki build logs'u kontrol edin
- Expo Community: https://forums.expo.dev
- Discord: https://chat.expo.dev

---

**Oluşturulma Tarihi:** 12 Kasım 2025  
**Proje:** FitnessApp  
**Platform:** iOS  
**Build Tool:** EAS Build

