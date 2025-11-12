# 📱 iOS Build Alternatifleri (Apple Hesabı Olmadan)

## ❌ Sorun

EAS Build, iOS için **internal distribution** (gerçek cihaz) build yaparken Apple Developer credentials gerektirir. Non-interactive modda credentials bulunamadığı için build başarısız oluyor.

```
Failed to set up credentials.
You're in non-interactive mode. EAS CLI couldn't find any credentials suitable for internal distribution.
```

---

## ✅ ÇÖZÜM SEÇENEKLERİ

### 🎯 SEÇENEK 1: Android Build Yap (ÖNERİLEN)

iOS telefonunuz var ama AdMob'u test etmek için **Android APK** da kullanabilirsiniz (Android emülatör veya Android telefon):

```bash
cd "C:\Users\Necmettin OCAK\Desktop\udemykursu1\FitnessApp"
eas build --platform android --profile preview
```

**Avantajları:**
- ✅ Apple Developer hesabı **gerekmez**
- ✅ 10-15 dakikada APK hazır
- ✅ Android emülatör veya telefonda test edilebilir
- ✅ AdMob **aynı şekilde** çalışır
- ✅ Credentials sorunu yok

**Dezavantajı:**
- ⚠️ iOS'da değil Android'de test olur

---

### 🎯 SEÇENEK 2: Apple Developer Program ($99/yıl)

**Gerçek iOS cihazda** test etmek için Apple Developer hesabı gerekiyor:

1. **Apple Developer Program'a Kayıl:**
   - https://developer.apple.com/programs/
   - $99/yıl ücret

2. **EAS'e Apple Hesabınızı Bağlayın:**
   ```bash
   eas credentials
   ```

3. **Build Yapın:**
   ```bash
   eas build --platform ios --profile preview
   ```

**Avantajları:**
- ✅ Gerçek iOS cihazda çalışır
- ✅ App Store'a yükleyebilirsiniz
- ✅ TestFlight kullanabilirsiniz
- ✅ Süresiz geçerli

**Dezavantajı:**
- 💰 $99/yıl ödeme

---

### 🎯 SEÇENEK 3: Expo Go (Sınırlı Test)

AdMob **görünmez** ama uygulamanın geri kalanını test edebilirsiniz:

```bash
cd "C:\Users\Necmettin OCAK\Desktop\udemykursu1\FitnessApp"
npx expo start
```

iPhone'dan **Expo Go** uygulaması ile QR kodu tarayın.

**Avantajları:**
- ✅ Anında çalışır
- ✅ Ücretsiz
- ✅ Hot reload

**Dezavantajları:**
- ❌ AdMob **görünmez** (native modül)
- ❌ Native özellikler çalışmaz

---

### 🎯 SEÇENEK 4: iOS Simulator Build (Mac Gerekir)

Mac bilgisayarınız varsa:

```bash
eas build --platform ios --profile preview
# Simulator build otomatik yapılır
```

**Avantajları:**
- ✅ Apple Developer hesabı gerekmez
- ✅ AdMob çalışır

**Dezavantajları:**
- ⚠️ **Mac ve Xcode gerekir**
- ⚠️ Gerçek cihazda değil simulator'de çalışır

---

## 🎯 BENİM ÖNERİM

### **Android Build Yapın (En Pratik)**

İOS telefonunuz olsa da, AdMob'u test etmek için **Android APK** en kolay yol:

1. **Android Build Başlat:**
   ```bash
   eas build --platform android --profile preview
   ```

2. **APK İndir ve Yükle:**
   - Build tamamlandığında APK linkini alın
   - Android emülatör veya Android telefona yükleyin
   - AdMob'u test edin

3. **iOS için Sonra:**
   - Apple Developer hesabı alın ($99/yıl)
   - iOS build yapın

---

## 📊 KARŞILAŞTIRMA

| Yöntem | Maliyet | AdMob | Gerçek Cihaz | Süre |
|--------|---------|-------|--------------|------|
| **Android Build** | 🆓 Ücretsiz | ✅ Çalışır | ✅ Evet (Android) | 10-15dk |
| **iOS + Apple Dev** | 💰 $99/yıl | ✅ Çalışır | ✅ Evet (iOS) | 15-20dk |
| **Expo Go** | 🆓 Ücretsiz | ❌ Çalışmaz | ✅ Evet | Anında |
| **Simulator (Mac)** | 🆓 Ücretsiz | ✅ Çalışır | ⚠️ Simulator | 15-20dk |

---

## 🚀 ŞİMDİ NE YAPALIM?

**A) Android Build (Önerilen):**
- AdMob'u hemen test edin
- Apple hesabı gerekmez
- 10-15 dakika

**B) Apple Developer Al:**
- $99/yıl ödeyin
- iOS'da test edin
- App Store'a yükleyin

**C) Expo Go:**
- AdMob hariç her şeyi test edin
- Ücretsiz ve hızlı

---

**Hangi yolu tercih edersiniz?**

