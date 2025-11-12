# 📱 TestFlight Kullanım Kılavuzu - FitnessApp

## ✅ Hazırlıklar Tamamlandı

- ✅ iOS build başlatıldı (gerçek cihaz için)
- ✅ TestFlight submit profili yapılandırıldı
- ✅ Apple Developer hesabı hazır
- ✅ AdMob entegrasyonu aktif

---

## 🔨 Build Süreci (15-20 Dakika)

### Şu Anda Ne Oluyor?

**iOS build başlatıldı!** Build süreci:

1. **Credentials Setup:**
   - EAS, Apple Developer hesabınıza bağlanıyor
   - Sertifikalar ve provisioning profile oluşturuluyor
   - Bundle identifier doğrulanıyor

2. **Build Başladı:**
   - iOS uygulaması derleniyor
   - Native modüller (AdMob dahil) entegre ediliyor
   - IPA dosyası oluşturuluyor

3. **Build Tamamlanacak:**
   - Dashboard'da "Finished" durumu görünecek
   - IPA dosyası TestFlight'a gönderilebilir olacak

---

## 📊 Build Durumunu Takip Etme

### Yöntem 1: Web Dashboard (Önerilen)

**Link:**
```
https://expo.dev/accounts/n.ocak/projects/FitnessApp/builds
```

**Burada görecekleriniz:**
- ✅ Build durumu (in queue → building → finished)
- ✅ Build logs (hata varsa görebilirsiniz)
- ✅ Download linki (tamamlandığında)
- ✅ QR kod
- ✅ Install butonu

### Yöntem 2: Terminal

```bash
cd "C:\Users\Necmettin OCAK\Desktop\udemykursu1\FitnessApp"
eas build:list --platform ios --limit 1
```

---

## 🚀 TestFlight'a Yükleme (Build Tamamlandıktan Sonra)

### Adım 1: Build Tamamlandığını Kontrol Edin

**Dashboard'dan:**
- Build durumu "Finished" olmalı
- Build Artifacts URL görünmeli

### Adım 2: App Store Connect'te Uygulama Oluşturun

**1. App Store Connect'e Gidin:**
```
https://appstoreconnect.apple.com
```

**2. Giriş Yapın:**
- Apple ID: `necmeddin.ocak@icloud.com`
- Şifre: Apple ID şifreniz

**3. Uygulama Oluşturun:**
- "My Apps" → "+" → "New App"
- **Bilgileri Girin:**
  - Platform: iOS
  - Name: FitnessApp
  - Primary Language: Turkish (Türkçe)
  - Bundle ID: `com.fitnessapp` (dropdown'dan seçin)
  - SKU: `fitnessapp-001` (benzersiz bir kod)
  - User Access: Full Access
- "Create" butonuna basın

**4. Uygulama Bilgilerini Doldurun:**
- App Information → Privacy Policy URL (opsiyonel)
- Pricing and Availability → Free
- App Review Information → Contact bilgileri

### Adım 3: EAS Submit ile TestFlight'a Gönderin

**Build tamamlandıktan sonra:**

```bash
cd "C:\Users\Necmettin OCAK\Desktop\udemykursu1\FitnessApp"
eas submit --platform ios --profile preview
```

**Komut çalıştırıldığında:**
- Apple ID soracak → Email girin
- Password soracak → Şifre girin
- 2FA kodu soracak → SMS/Authenticator kodunu girin
- IPA dosyası otomatik yüklenecek

**Alternatif: Manuel Yükleme**

1. **Dashboard'dan IPA'yı İndirin:**
   - Build sayfasından "Download" butonuna basın
   - IPA dosyası bilgisayarınıza inecek

2. **Transporter ile Yükleyin:**
   - Mac App Store'dan "Transporter" uygulamasını indirin
   - IPA dosyasını Transporter'a sürükleyin
   - "Deliver" butonuna basın

### Adım 4: TestFlight'ta Build'i Kontrol Edin

**1. App Store Connect'e Gidin:**
```
https://appstoreconnect.apple.com/apps
```

**2. FitnessApp'i Seçin:**
- "TestFlight" sekmesine gidin
- "iOS Builds" bölümünde build'inizi göreceksiniz

**3. Build Durumu:**
- "Processing" → Apple build'i işliyor (5-30 dakika)
- "Ready to Test" → Test edilebilir durumda!

### Adım 5: TestFlight'tan Yükleyin

**1. iPhone'da TestFlight İndirin:**
- App Store → "TestFlight" uygulamasını indirin
- İndirmediyseniz: https://apps.apple.com/app/testflight/id899247664

**2. TestFlight'u Açın:**
- TestFlight uygulamasını açın
- Apple ID ile giriş yapın (`necmeddin.ocak@icloud.com`)

**3. Uygulamayı Bulun:**
- "Apps" sekmesinde "FitnessApp" görünecek
- Veya email davetiyesi gelmişse linke tıklayın

**4. "Install" Butonuna Basın:**
- "Install" butonuna basın
- Uygulama yüklenecek

**5. Uygulamayı Açın:**
- Ana ekranda FitnessApp ikonuna dokunun
- **AdMob banner reklamı göreceksiniz!** 🎉

---

## 🎯 AdMob Test Kontrol Listesi

Uygulama yüklendikten sonra:

### ✅ Ana Sayfa Kontrolleri

- [ ] Uygulama açılıyor mu?
- [ ] Ana sayfa yükleniyor mu?
- [ ] **AdMob banner reklamı görünüyor mu?** (Ana sayfanın üst kısmında)
- [ ] Reklam yükleniyor mu? (Gri kutu değil, gerçek reklam)
- [ ] Reklam tıklanabilir mi? (Test reklamı tıklanabilir)

### ✅ Diğer Özellikler

- [ ] Supabase veriler geliyor mu?
- [ ] Program ekranı çalışıyor mu?
- [ ] Tracking ekranı çalışıyor mu?
- [ ] Motivation ekranı çalışıyor mu?
- [ ] Profile ekranı çalışıyor mu?

### ✅ AdMob Özellikleri

- [ ] Banner reklamı görünüyor mu?
- [ ] Reklam doğru konumda mı? (Ana sayfa üst kısmı)
- [ ] Reklam yüklenme süresi normal mi? (5-10 saniye)
- [ ] Reklam tıklanınca ne oluyor? (Test reklamı açılmalı)

---

## 🔍 Sorun Giderme

### Sorun 1: "Build Artifacts URL: null"

**Sebep:** Provisioning profile sorunu

**Çözüm:**
```bash
# Credentials'ı yeniden oluşturun
eas credentials

# Yeni build yapın
eas build --platform ios --profile preview --clear-cache
```

### Sorun 2: "No team associated"

**Sebep:** Apple Developer hesabı aktif değil

**Çözüm:**
1. https://developer.apple.com/account kontrol edin
2. Membership durumu "Active" olmalı
3. Ödeme yapıldı mı kontrol edin ($99/yıl)

### Sorun 3: "App not found in App Store Connect"

**Sebep:** App Store Connect'te uygulama oluşturulmamış

**Çözüm:**
1. App Store Connect'e gidin
2. "New App" ile uygulama oluşturun
3. Bundle ID: `com.fitnessapp` seçin

### Sorun 4: "Build processing failed"

**Sebep:** Build hatası

**Çözüm:**
1. Dashboard'dan build logs'u kontrol edin
2. Hataları düzeltin
3. Yeni build yapın

### Sorun 5: TestFlight'ta Build Görünmüyor

**Sebep:** Build henüz işleniyor veya submit edilmedi

**Çözüm:**
1. Build durumunu kontrol edin (Dashboard)
2. `eas submit` komutunu çalıştırın
3. 5-30 dakika bekleyin (Apple işliyor)

---

## 📊 TestFlight Avantajları

| Özellik | TestFlight | Doğrudan Yükleme |
|---------|------------|------------------|
| **Süresiz Geçerli** | ✅ Evet | ❌ 7 gün |
| **Beta Testçiler** | ✅ Ekleyebilirsiniz | ❌ Sadece siz |
| **Crash Raporları** | ✅ Var | ❌ Yok |
| **Analytics** | ✅ Var | ❌ Yok |
| **Apple Onaylı** | ✅ Evet | ⚠️ Manuel |
| **Kolay Güncelleme** | ✅ Evet | ⚠️ Yeni build gerekir |

---

## 🚀 Hızlı Başlangıç

### 1. Build Tamamlandığında

```bash
cd "C:\Users\Necmettin OCAK\Desktop\udemykursu1\FitnessApp"
eas submit --platform ios --profile preview
```

### 2. App Store Connect'te Kontrol Edin

```
https://appstoreconnect.apple.com/apps
```

### 3. TestFlight'tan Yükleyin

- iPhone'da TestFlight uygulamasını açın
- FitnessApp'i bulun
- "Install" basın

### 4. AdMob'u Test Edin!

- Uygulamayı açın
- Ana sayfada AdMob banner'ı görün
- Tüm özellikleri test edin

---

## 💡 İpuçları

1. **Build Süresi:**
   - İlk build: ~20 dakika
   - Sonraki buildler: ~15 dakika

2. **TestFlight Processing:**
   - Submit sonrası 5-30 dakika sürebilir
   - "Ready to Test" durumunu bekleyin

3. **Beta Testçiler:**
   - TestFlight'ta "Internal Testing" ekleyebilirsiniz
   - Email ile davet gönderebilirsiniz

4. **Crash Raporları:**
   - TestFlight otomatik crash raporları toplar
   - App Store Connect'te görebilirsiniz

5. **Güncelleme:**
   - Yeni build yapın
   - TestFlight'a submit edin
   - Otomatik güncellenir

---

## 📱 Test Senaryoları

### Senaryo 1: İlk Açılış

1. Uygulamayı açın
2. Ana sayfa yüklenirken AdMob banner'ı görünmeli
3. Reklam 5-10 saniye içinde yüklenmeli

### Senaryo 2: Sayfa Değiştirme

1. Ana sayfadan Program ekranına gidin
2. Tekrar Ana sayfaya dönün
3. AdMob banner'ı tekrar görünmeli

### Senaryo 3: Uygulama Yeniden Başlatma

1. Uygulamayı kapatın
2. Tekrar açın
3. AdMob banner'ı görünmeli

---

## 🎉 Başarılı Test Sonrası

AdMob çalışıyorsa:

1. ✅ **Production Build Yapın:**
   ```bash
   eas build --platform ios --profile production
   ```

2. ✅ **App Store'a Gönderin:**
   ```bash
   eas submit --platform ios --profile production
   ```

3. ✅ **Gerçek AdMob ID'lerini Ekleyin:**
   - AdMob hesabından gerçek ID'leri alın
   - `app.json` ve `adMobService.js`'i güncelleyin
   - Yeni build yapın

---

## 📞 Destek

**Sorun yaşarsanız:**

1. **Build Logs:** Dashboard'dan build logs'u kontrol edin
2. **EAS Support:** https://expo.dev/support
3. **Apple Developer Support:** https://developer.apple.com/support/
4. **TestFlight Docs:** https://developer.apple.com/testflight/

---

## 📋 Özet Checklist

**Build Öncesi:**
- [ ] Apple Developer hesabı aktif
- [ ] `eas.json` yapılandırıldı
- [ ] `app.json` bundle ID doğru

**Build:**
- [ ] Build başlatıldı
- [ ] Build tamamlandı (Status: finished)
- [ ] Build Artifacts URL var

**App Store Connect:**
- [ ] Uygulama oluşturuldu
- [ ] Bundle ID eşleşiyor
- [ ] TestFlight sekmesi aktif

**Submit:**
- [ ] `eas submit` komutu çalıştırıldı
- [ ] IPA yüklendi
- [ ] Build "Ready to Test" durumunda

**TestFlight:**
- [ ] TestFlight uygulaması yüklü
- [ ] Uygulama görünüyor
- [ ] "Install" butonuna basıldı
- [ ] Uygulama açılıyor
- [ ] **AdMob banner görünüyor!** ✅

---

**Build tamamlandığında bu kılavuzu takip ederek TestFlight'a yükleyip AdMob'u test edebilirsiniz!** 🚀

**Oluşturulma Tarihi:** 12 Kasım 2025  
**Proje:** FitnessApp  
**Platform:** iOS  
**Yöntem:** TestFlight  
**AdMob:** Test ID'leri ile aktif

