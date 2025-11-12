# 📱 AdMob iOS Test Kılavuzu - FitnessApp

## ✅ Hazırlıklar Tamamlandı

- ✅ Apple Developer Program hesabı açıldı
- ✅ iOS build başlatıldı
- ✅ AdMob entegrasyonu hazır

---

## 🔨 Build Süreci (15-20 Dakika)

### Şu Anda Ne Oluyor?

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
   - IPA dosyası indirilebilir olacak

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

## 📲 iPhone'a Yükleme (Build Tamamlandıktan Sonra)

### Yöntem 1: Doğrudan Yükleme (En Kolay)

**1. iPhone Safari'den Dashboard'a Gidin:**
```
https://expo.dev/accounts/n.ocak/projects/FitnessApp/builds
```

**2. Son Build'e Tıklayın:**
- En üstteki (en yeni) build'i seçin

**3. "Install" Butonuna Basın:**
- IPA dosyası otomatik indirilir
- iPhone'a yüklenir

**4. Güven Ayarı:**
```
Ayarlar → Genel → VPN ve Cihaz Yönetimi
→ "Apple Development: ..." veya "Developer App"
→ "Güven" butonuna bas
```

**5. Uygulamayı Açın:**
- Ana ekranda FitnessApp ikonuna dokunun
- **AdMob banner reklamı göreceksiniz!** 🎉

---

### Yöntem 2: TestFlight (Daha Profesyonel)

**1. Build'i TestFlight'a Gönderin:**
```bash
cd "C:\Users\Necmettin OCAK\Desktop\udemykursu1\FitnessApp"
eas submit --platform ios
```

**2. App Store Connect'te Onaylayın:**
- https://appstoreconnect.apple.com
- TestFlight → Builds
- Build'i seçin ve "Submit for Review" (opsiyonel)

**3. TestFlight'tan Yükleyin:**
- iPhone'da App Store'dan "TestFlight" uygulamasını indirin
- Davet linkine tıklayın veya TestFlight'ta uygulamayı bulun
- "Install" butonuna basın

**Avantajları:**
- ✅ Apple'ın resmi test platformu
- ✅ Süresiz geçerli
- ✅ Beta testçilere dağıtabilirsiniz
- ✅ Crash raporları alırsınız

---

## 🎯 AdMob Test Kontrol Listesi

Build tamamlandıktan ve uygulama yüklendikten sonra:

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

## 🔍 AdMob Sorun Giderme

### Sorun 1: Reklam Görünmüyor

**Kontrol Edin:**
1. ✅ İnternet bağlantısı var mı?
2. ✅ `app.json` içinde AdMob App ID doğru mu?
3. ✅ Test ID'leri kullanıyorsanız, cihaz test modunda mı?

**Çözüm:**
```bash
# app.json kontrol edin
cat app.json | grep googleMobileAdsAppId
```

**Beklenen:**
```json
"config": {
  "googleMobileAdsAppId": "ca-app-pub-3940256099942544~1458002511"
}
```

### Sorun 2: Reklam Yüklenmiyor

**Kontrol Edin:**
1. ✅ AdMob servisi başlatıldı mı? (`App.js` içinde `adMobService.initialize()`)
2. ✅ Console'da hata var mı?
3. ✅ AdMob hesabınızda reklam birimi oluşturuldu mu?

**Test ID'leri Kullanıyorsanız:**
- Test ID'leri her zaman çalışır
- Gerçek ID'ler için AdMob hesabında reklam birimi oluşturmanız gerekir

### Sorun 3: Uygulama Crash Oluyor

**Kontrol Edin:**
1. ✅ Build logs'u kontrol edin (Dashboard'dan)
2. ✅ Console'da hata mesajı var mı?
3. ✅ AdMob native modülü doğru yüklendi mi?

**Çözüm:**
```bash
# Yeni build yapın
eas build --platform ios --profile preview --clear-cache
```

---

## 📊 AdMob Test ID'leri

**Şu anda kullanılan Test ID'leri:**

### iOS App ID:
```
ca-app-pub-3940256099942544~1458002511
```

### Banner Ad Unit ID:
```
ca-app-pub-3940256099942544/2934735716
```

**Test ID'leri:**
- ✅ Her zaman çalışır
- ✅ Gerçek reklam gösterir (test reklamı)
- ✅ Tıklanabilir
- ✅ Ödeme almazsınız

---

## 🎯 Gerçek AdMob ID'leri İçin

### Adım 1: AdMob Hesabı Oluşturun

1. https://admob.google.com
2. Google hesabınızla giriş yapın
3. Uygulama ekleyin (iOS)
4. Reklam birimi oluşturun (Banner)

### Adım 2: ID'leri Güncelleyin

**app.json:**
```json
{
  "ios": {
    "config": {
      "googleMobileAdsAppId": "ca-app-pub-XXXXXXXXXXXXX~YYYYYYYYYY"
    }
  }
}
```

**src/services/adMobService.js:**
```javascript
getBannerAdUnitId() {
  return Platform.select({
    ios: 'ca-app-pub-XXXXXXXXXXXXX/ZZZZZZZZZZ',
    android: 'ca-app-pub-XXXXXXXXXXXXX/AAAAAAAAAA',
  });
}
```

### Adım 3: Yeni Build Yapın

```bash
eas build --platform ios --profile preview
```

---

## 🚀 Build Sonrası Adımlar

### 1. Build Tamamlandığında

- ✅ Dashboard'dan IPA'yı indirin
- ✅ iPhone'a yükleyin
- ✅ Güven ayarını yapın

### 2. Uygulamayı Test Edin

- ✅ AdMob banner'ı kontrol edin
- ✅ Diğer özellikleri test edin
- ✅ Hata varsa bildirin

### 3. TestFlight'a Gönderin (Opsiyonel)

```bash
eas submit --platform ios
```

### 4. Production Build (App Store İçin)

```bash
eas build --platform ios --profile production
```

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

## 💡 İpuçları

1. **Test ID'leri:**
   - Şu anda test ID'leri kullanılıyor
   - Gerçek reklam gösterir ama ödeme almazsınız
   - Production'da gerçek ID'ler kullanın

2. **Build Süresi:**
   - İlk build: ~20 dakika
   - Sonraki buildler: ~15 dakika (cache sayesinde)

3. **TestFlight:**
   - TestFlight'a göndermek için `eas submit` kullanın
   - App Store Connect'te onay gerekebilir

4. **Crash Raporları:**
   - TestFlight kullanırsanız crash raporları alırsınız
   - Xcode Organizer'dan da görebilirsiniz

---

## 🎉 Başarılı Test Sonrası

AdMob çalışıyorsa:

1. ✅ **Production Build Yapın:**
   ```bash
   eas build --platform ios --profile production
   ```

2. ✅ **App Store'a Gönderin:**
   ```bash
   eas submit --platform ios
   ```

3. ✅ **Gerçek AdMob ID'lerini Ekleyin:**
   - AdMob hesabından gerçek ID'leri alın
   - `app.json` ve `adMobService.js`'i güncelleyin
   - Yeni build yapın

---

## 📞 Destek

**Sorun yaşarsanız:**

1. **Build Logs:** Dashboard'dan build logs'u kontrol edin
2. **Console:** Xcode Console'dan hataları görün
3. **EAS Support:** https://expo.dev/support
4. **AdMob Docs:** https://developers.google.com/admob/ios

---

**Build tamamlandığında bu kılavuzu takip ederek AdMob'u test edebilirsiniz!** 🚀

**Oluşturulma Tarihi:** 12 Kasım 2025  
**Proje:** FitnessApp  
**Platform:** iOS  
**AdMob:** Test ID'leri ile aktif

