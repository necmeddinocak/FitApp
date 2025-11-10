# AdMob Reklam Entegrasyonu Kullanım Kılavuzu

## 📋 Genel Bakış

FitnessApp'e Google AdMob reklamları başarıyla entegre edilmiştir. Bu doküman, uygulamanın reklamlı halini nasıl çalıştıracağınızı adım adım açıklar.

---

## ✅ Yapılan İşlemler

### 1. Paket Kurulumları
```bash
cd FitnessApp
npx expo install expo-ads-admob react-native-google-mobile-ads
```

### 2. App.json Yapılandırması
- **Android Package**: `com.fitnessapp`
- **iOS Bundle Identifier**: `com.fitnessapp`
- **Test AdMob ID'leri** eklendi (Android ve iOS için)

### 3. AdMob Servisi Oluşturuldu
- `src/services/adMobService.js` - AdMob yönetim servisi
- Banner, Interstitial ve Rewarded reklam desteği
- Otomatik test ID'leri kullanımı

### 4. HomeScreen'e Banner Reklam Eklendi
- Ana sayfada header'ın altına banner reklam yerleştirildi
- Web platformunda reklam gösterilmiyor (sadece mobil)

### 5. Native Build
- `npx expo prebuild --clean` ile Android ve iOS native klasörleri oluşturuldu

---

## 🚀 Uygulamayı Çalıştırma

### **Yöntem 1: Android Emulator (Önerilen)**

1. **Android Studio'yu açın** ve bir emulator başlatın

2. **Metro Bundler'ı başlatın**:
```bash
cd "C:\Users\Necmettin OCAK\Desktop\udemykursu1\FitnessApp"
npx expo start
```

3. **Android'e build edin ve çalıştırın**:
```bash
npx expo run:android
```

**Veya tek komutla:**
```bash
cd "C:\Users\Necmettin OCAK\Desktop\udemykursu1\FitnessApp"
npx expo run:android
```

### **Yöntem 2: Fiziksel Android Cihaz**

1. **USB Debugging'i aktif edin** (Ayarlar → Geliştirici Seçenekleri → USB Debugging)

2. **Cihazı bilgisayara USB ile bağlayın**

3. **Cihazın bağlı olduğunu kontrol edin**:
```bash
adb devices
```

4. **Uygulamayı çalıştırın**:
```bash
cd "C:\Users\Necmettin OCAK\Desktop\udemykursu1\FitnessApp"
npx expo run:android
```

### **Yöntem 3: iOS (Mac gereklidir)**

```bash
cd "C:\Users\Necmettin OCAK\Desktop\udemykursu1\FitnessApp"
npx expo run:ios
```

**Not:** iOS için Mac bilgisayar ve Xcode gereklidir.

---

## 🧪 Test Reklamları

Şu anda **Google'ın test reklam ID'leri** kullanılıyor:

### Test AdMob ID'leri:
- **Android App ID**: `ca-app-pub-3940256099942544~3347511713`
- **iOS App ID**: `ca-app-pub-3940256099942544~1458002511`
- **Banner Ad Unit**: `TestIds.BANNER`
- **Interstitial Ad Unit**: `TestIds.INTERSTITIAL`
- **Rewarded Ad Unit**: `TestIds.REWARDED`

### Test Reklamları Özellikleri:
✅ Gerçek reklam gibi görünür  
✅ Tıklanabilir  
✅ Hesabınız ban yemez  
✅ Gelir sağlamaz (test amaçlı)

---

## 💰 Gerçek Reklamları Aktifleştirme

### 1. AdMob Hesabı Oluşturun
1. [AdMob Console](https://apps.admob.com/) adresine gidin
2. Google hesabınızla giriş yapın
3. Yeni uygulama ekleyin

### 2. App ID'leri Alın
- **Android**: `ca-app-pub-XXXXXXXXXX~YYYYYYYYYY`
- **iOS**: `ca-app-pub-XXXXXXXXXX~YYYYYYYYYY`

### 3. Ad Unit ID'leri Oluşturun
- **Banner**: `ca-app-pub-XXXXXXXXXX/1111111111`
- **Interstitial**: `ca-app-pub-XXXXXXXXXX/2222222222`
- **Rewarded**: `ca-app-pub-XXXXXXXXXX/3333333333`

### 4. Kodu Güncelleyin

**app.json**:
```json
"plugins": [
  [
    "react-native-google-mobile-ads",
    {
      "androidAppId": "ca-app-pub-XXXXXXXXXX~YYYYYYYYYY",
      "iosAppId": "ca-app-pub-XXXXXXXXXX~YYYYYYYYYY"
    }
  ]
]
```

**src/services/adMobService.js**:
```javascript
getBannerAdUnitId() {
  return Platform.select({
    ios: 'ca-app-pub-XXXXXXXXXX/1111111111',
    android: 'ca-app-pub-XXXXXXXXXX/1111111111',
  });
}
```

### 5. Prebuild ve Yeniden Derleyin
```bash
npx expo prebuild --clean
npx expo run:android
```

---

## 📊 Reklam Türleri ve Kullanımı

### 1. Banner Reklamları (Aktif)
- **Konum**: HomeScreen header altında
- **Boyut**: 320x50 standart banner
- **Otomatik yükleme**: Sayfa açıldığında

### 2. Interstitial Reklamları (Hazır)
Tam ekran reklamlar - eklenebilir yerler:
- Antrenman tamamlandığında
- Program değiştirildiğinde
- Belirli sayıda ekran geçişinden sonra

**Kullanım örneği**:
```javascript
import { adMobService } from '../services';

// Reklam yükle
await adMobService.loadInterstitialAd();

// Reklam göster
await adMobService.showInterstitialAd();
```

### 3. Rewarded Reklamları (Hazır)
Ödüllü reklamlar - eklenebilir yerler:
- Premium özellik kilidi açma
- Ekstra motivasyon sözü
- Özel rozet kazanma

**Kullanım örneği**:
```javascript
import { adMobService } from '../services';

// Reklam yükle
await adMobService.loadRewardedAd();

// Reklam göster ve ödül al
await adMobService.showRewardedAd((reward) => {
  console.log('Ödül kazanıldı:', reward);
  // Kullanıcıya ödülü ver
});
```

---

## 🛠️ Sorun Giderme

### Reklam Görünmüyor
1. **Android Emulator'da test edin** (fiziksel cihazda bazen gecikmeler olabilir)
2. **İnternet bağlantısını kontrol edin**
3. **Metro bundler'ı yeniden başlatın**:
```bash
npx expo start --clear
```

### "No Fill" Hatası
- Test reklamlarında nadiren olabilir
- Sayfayı yenileyin veya uygulamayı yeniden açın
- Gerçek reklamlarda daha az görülür

### Build Hatası
```bash
# Node modules'ü temizle
rm -rf node_modules
npm install

# Cache'i temizle
npx expo start --clear

# Prebuild'i yeniden yap
npx expo prebuild --clean
```

### AdMob SDK Crash
- `app.json` dosyasında App ID'lerin doğru olduğundan emin olun
- Prebuild'i tekrar çalıştırın

---

## 📱 Test Cihaz Ekleme (İsteğe Bağlı)

Gerçek reklamları test ederken kendi cihazınızı test cihazı olarak ekleyebilirsiniz:

1. **Cihaz ID'sini alın** (ilk reklamı yüklediğinizde logcat'te görünür)

2. **AdMob servisine ekleyin**:
```javascript
// src/services/adMobService.js
async initialize() {
  await mobileAds().initialize();
  
  // Test cihazları ekle
  await mobileAds().setRequestConfiguration({
    testDeviceIdentifiers: ['YOUR_DEVICE_ID_HERE'],
  });
}
```

---

## 📈 Performans Önerileri

1. **Banner Reklamları**: Sabit sayfalarda kullanın (Home, Profile)
2. **Interstitial**: Kullanıcı deneyimini bozmayacak anlarda gösterin
3. **Rewarded**: Değerli özellikler için kullanın, zorlamayın
4. **Frekans**: Aynı reklamı çok sık göstermeyin

---

## 🔐 Güvenlik Notları

⚠️ **UYARI**: 
- Kendi reklamlarınıza tıklamayın (ban yeme riski)
- Test sırasında mutlaka test ID'leri kullanın
- Gerçek reklamları yayına geçmeden önce test edin
- `.env` dosyasına AdMob API anahtarlarını koymayın (gerekli değil)

---

## 📚 Ek Kaynaklar

- [Google AdMob Docs](https://developers.google.com/admob)
- [React Native Google Mobile Ads](https://docs.page/invertase/react-native-google-mobile-ads)
- [Expo AdMob Guide](https://docs.expo.dev/versions/latest/sdk/admob/)
- [AdMob Policy Center](https://support.google.com/admob/answer/6128543)

---

## ✅ Kontrol Listesi

Uygulamayı yayına almadan önce:

- [ ] Gerçek AdMob hesabı oluşturuldu
- [ ] Gerçek App ID'ler ve Ad Unit ID'ler alındı
- [ ] `app.json` ve `adMobService.js` güncellendi
- [ ] Prebuild yapıldı (`npx expo prebuild --clean`)
- [ ] Android'de test edildi
- [ ] iOS'ta test edildi (varsa)
- [ ] Reklamlar doğru yükleniyor ve görünüyor
- [ ] Uygulama crash etmiyor
- [ ] AdMob policy'lerine uygun

---

## 🎯 Hızlı Başlangıç Komutları

```bash
# Android'de çalıştır
cd "C:\Users\Necmettin OCAK\Desktop\udemykursu1\FitnessApp"
npx expo run:android

# Temiz başlangıç (sorun varsa)
npx expo start --clear
npx expo prebuild --clean
npx expo run:android
```

---

**Başarılar! 🎉**

Sorularınız için: [GitHub Issues](https://github.com/necmeddinocak/FitnessApp/issues)

