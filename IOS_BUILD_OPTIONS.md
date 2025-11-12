# 📱 iOS Build Seçenekleri - FitnessApp

## ❌ Mevcut Durum

EAS Build ile iOS için **gerçek cihazda** test yapmak **Apple Developer Program** üyeliği gerektirir.

**Aldığınız Hata:**
```
Failed to set up credentials.
You're in non-interactive mode. EAS CLI couldn't find any credentials suitable for internal distribution.
```

**Sebep:** iOS'da gerçek cihaz için Apple sertifikaları zorunludur.

---

## ✅ ÇÖZÜM SEÇENEKLERİ

### 🎯 SEÇENEK 1: Expo Go ile Test (AdMob Hariç) - BAŞLATILDI ✅

**Şu anda çalışıyor!**

```bash
npx expo start --clear
```

**Nasıl Kullanılır:**

1. **iPhone'da Expo Go İndirin:**
   - App Store → "Expo Go" uygulamasını yükleyin

2. **QR Kodu Tarayın:**
   - Terminal'de QR kod görünecek
   - Expo Go uygulamasından "Scan QR Code"
   - Kamerayı QR koda tutun

3. **Uygulama Açılacak:**
   - ✅ Ana sayfa ve tüm ekranlar
   - ✅ Supabase veriler
   - ✅ Navigasyon
   - ✅ Tüm UI/UX
   - ❌ AdMob reklamları (native modül)

**Avantajlar:**
- ✅ Anında çalışır
- ✅ Ücretsiz
- ✅ Hot reload (kod değiştiğinde otomatik güncellenir)
- ✅ Uygulamanın %95'i çalışır

**Dezavantajlar:**
- ❌ AdMob görünmez

---

### 🎯 SEÇENEK 2: Apple Developer Program ($99/yıl)

**TestFlight ve gerçek AdMob testi için:**

#### Adım 1: Kayıt Olun

**Apple Developer:** https://developer.apple.com/programs/

- Ücret: $99/yıl
- Ödeme: Kredi kartı/Apple Pay
- Onay Süresi: 24-48 saat

#### Adım 2: Kayıt Sonrası iOS Build

```bash
cd "C:\Users\Necmettin OCAK\Desktop\udemykursu1\FitnessApp"
eas build --platform ios --profile preview
```

**Build sırasında:**
- Apple ID isteyecek → Email girin
- Password → Şifre girin
- 2FA kod → SMS/Authenticator kodunu girin

#### Adım 3: TestFlight'a Yükleme

```bash
eas submit --platform ios
```

**Avantajlar:**
- ✅ Gerçek cihazda çalışır
- ✅ AdMob reklamları çalışır
- ✅ TestFlight ile test edilebilir
- ✅ App Store'a gönderilebilir
- ✅ Süresiz geçerli

**Dezavantajlar:**
- 💰 $99/yıl ücret

---

### 🎯 SEÇENEK 3: Android Build (Alternatif Platform)

Eğer Android telefon/emülatörünüz varsa:

```bash
cd "C:\Users\Necmettin OCAK\Desktop\udemykursu1\FitnessApp"
eas build --platform android --profile preview
```

**Avantajlar:**
- ✅ Apple hesabı gerekmez
- ✅ AdMob çalışır
- ✅ 10-15 dakikada APK hazır
- ✅ Ücretsiz

**Dezavantajlar:**
- ⚠️ iOS'da değil Android'de test

---

## 📊 KARŞILAŞTIRMA

| Yöntem | Maliyet | AdMob | Platform | Süre | TestFlight |
|--------|---------|-------|----------|------|------------|
| **Expo Go** | 🆓 Ücretsiz | ❌ Yok | iOS ✅ | Anında | ❌ |
| **Apple Dev** | 💰 $99/yıl | ✅ Var | iOS ✅ | 15-20dk | ✅ |
| **Android** | 🆓 Ücretsiz | ✅ Var | Android | 10-15dk | ❌ |

---

## 🎯 ŞİMDİ NE YAPILMALI?

### **ŞU ANDA:** Expo Go ile Test Edebilirsiniz

Expo dev server başlatıldı! Şimdi:

1. **iPhone'da App Store'dan "Expo Go" indirin**
2. **Expo Go'yu açın**
3. **"Scan QR Code" butonuna basın**
4. **Terminal'deki QR kodu tarayın**
5. **Uygulama açılacak!**

**Test Edebilecekleriniz:**
- ✅ Ana sayfa
- ✅ Program oluşturma
- ✅ Egzersiz ekleme
- ✅ Kilo takibi
- ✅ Motivasyon sözleri
- ✅ Profil ayarları
- ✅ Supabase veriler

**Göremeyecekleriniz:**
- ❌ AdMob banner reklamı (placeholder görebiliriz)

---

## 💡 ADIM ADIM: EXPO GO İLE TEST

### 1️⃣ Expo Go İndirin (iPhone)

App Store'da arayın: **"Expo Go"**

### 2️⃣ Terminal'i Kontrol Edin

Terminal'de şöyle bir ekran görmelisiniz:

```
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press r │ reload app
› Press m │ toggle menu
› Press o │ open project code in your editor

› Press ? │ show all commands
```

### 3️⃣ QR Kodu Tarayın

- Expo Go uygulamasını açın
- **"Scan QR Code"** butonuna basın
- Terminal'deki QR'ı tarayın

### 4️⃣ Uygulama Yüklenecek

- "Opening project..." mesajı
- "Building JavaScript bundle..."
- Uygulama açılacak!

---

## 🔧 AdMob Placeholder Ekleyelim mi?

Expo Go'da AdMob çalışmaz ama **reklamın yerini** gösterebiliriz:

**Agent moduna geçip şunu söyleyin:**
> "Expo Go için AdMob placeholder ekle"

Bu placeholder:
- Gri kutu + "AdMob Reklam Alanı" yazısı gösterir
- Native build'de gerçek reklamla değişir
- Layout'un nasıl göründüğünü test edersiniz

---

## 💰 Apple Developer Program Hakkında

### **Kimler İçin?**

- App Store'a yükleyecekseniz ✅
- TestFlight ile test edecekseniz ✅
- Profesyonel geliştirme yapıyorsanız ✅

### **Nasıl Kayıt Olunur?**

1. https://developer.apple.com/programs/
2. **"Enroll"** butonuna tıklayın
3. Apple ID ile giriş yapın
4. Kişisel bilgilerinizi girin
5. **$99/yıl** ödeyin (kredi kartı)
6. **24-48 saat** içinde onay

### **Sonra Ne Olur?**

1. **iOS build yapabilirsiniz:**
   ```bash
   eas build --platform ios --profile preview
   ```

2. **TestFlight'a gönderebilirsiniz:**
   ```bash
   eas submit --platform ios
   ```

3. **App Store'a yükleyebilirsiniz**

---

## 🚀 HIZLI BAŞLANGIÇ: EXPO GO

**ŞİMDİ YAPMANIZ GEREKENLER:**

### ✅ Adım 1: Expo Go İndirin
- iPhone'da App Store
- "Expo Go" ara ve indir

### ✅ Adım 2: Terminal'i Kontrol Edin
```bash
# Eğer QR kod görmüyorsanız:
cd "C:\Users\Necmettin OCAK\Desktop\udemykursu1\FitnessApp"
npx expo start
```

### ✅ Adım 3: QR Kodu Tarayın
- Expo Go → Scan QR Code
- Terminal'deki QR'a tutun

### ✅ Adım 4: Test Edin!
- Tüm ekranları gezin
- Supabase verilerini kontrol edin
- UI/UX'i test edin

---

## 📞 SONUÇ

**Şu anda en iyi seçenek:**
1. ✅ **Expo Go ile test edin** (AdMob hariç her şey)
2. 💰 **Beğenirseniz** Apple Developer alın ($99/yıl)
3. 🎉 **Sonra** gerçek iOS build + AdMob

**Expo Go dev server çalışıyor!** iPhone'dan QR kodu tarayıp uygulamayı test edebilirsiniz. 🚀

