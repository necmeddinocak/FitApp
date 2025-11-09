# 💪 Fitness App - React Native

Modern ve kullanıcı dostu bir fitness takip uygulaması. Antrenman programları, ağırlık takibi, kilo takibi ve motivasyon özellikleri içerir.

## 📁 Proje Yapısı

```
FitnessApp/
├── src/
│   ├── components/          # Reusable componentler
│   │   └── common/         # Ortak UI componentleri
│   │       ├── Card.js     # Kart componenti
│   │       ├── Button.js   # Buton componenti
│   │       ├── Text.js     # Text componenti
│   │       ├── Input.js    # Input componenti
│   │       └── index.js    # Export dosyası
│   │
│   ├── screens/            # Uygulama ekranları
│   │   ├── HomeScreen.js   # Ana sayfa (Dashboard)
│   │   ├── ProgramScreen.js    # Antrenman programı
│   │   ├── TrackingScreen.js   # Takip ekranı
│   │   ├── MotivationScreen.js # Motivasyon
│   │   ├── ProfileScreen.js    # Profil ve ayarlar
│   │   └── index.js
│   │
│   ├── navigation/         # Navigation yapısı
│   │   └── BottomTabNavigator.js  # Alt menü navigasyonu
│   │
│   ├── constants/          # Sabitler
│   │   └── theme.js        # Tema, renkler, spacing
│   │
│   └── utils/              # Yardımcı fonksiyonlar
│
├── App.js                  # Ana uygulama dosyası
└── package.json
```

## 🎨 Tasarım Sistemi

### Renkler
- **Primary**: #6C5CE7 (Mor)
- **Secondary**: #00B894 (Yeşil)
- **Success**: #00B894
- **Warning**: #FDCB6E
- **Error**: #FF7675

### Spacing (8pt Grid)
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- xxl: 48px

### Reusable Componentler

#### 1. Card
```javascript
import { Card } from './src/components/common';

<Card onPress={() => {}} shadow={true}>
  {/* İçerik */}
</Card>
```

#### 2. Button
```javascript
import { Button } from './src/components/common';

<Button 
  title="Başla"
  variant="primary" // primary, secondary, outline, text
  size="medium"     // small, medium, large
  onPress={() => {}}
/>
```

#### 3. Text
```javascript
import { Text } from './src/components/common';

<Text variant="heading1">Başlık</Text>
<Text variant="body">Normal metin</Text>
<Text variant="caption">Küçük metin</Text>
```

#### 4. Input
```javascript
import { Input } from './src/components/common';

<Input
  label="Email"
  placeholder="email@example.com"
  value={email}
  onChangeText={setEmail}
/>
```

## 🚀 Özellikler

### ✅ Ana Sayfa (Dashboard)
- Günlük hedef kartı (dakika, set, adım)
- Bugünkü antrenman planı
- Hızlı kısayollar (Antrenman ekle, Kilo gir, Ağırlık kaydet)
- Haftalık ilerleme özeti
- Kilo takibi özeti
- Son kaldırılan ağırlıklar
- Motivasyon kartı

### 📱 Alt Menü Navigasyonu
1. **Ana Sayfa** - Dashboard ve özetler
2. **Program** - Antrenman programı yönetimi
3. **Takip** - Ağırlık ve kilo takibi
4. **Motivasyon** - İlham verici içerikler
5. **Profil** - Kullanıcı profili ve ayarlar

## 🛠️ Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Uygulamayı başlat
npm start

# Web'de çalıştır
npm run web

# Android'de çalıştır
npm run android

# iOS'ta çalıştır
npm run ios
```

## 📦 Kullanılan Paketler

- **react-navigation/native** - Navigasyon
- **react-navigation/bottom-tabs** - Alt menü
- **expo/vector-icons** - İkonlar
- **react-native-screens** - Ekran yönetimi
- **react-native-safe-area-context** - Güvenli alan yönetimi

## ✅ Tamamlanan Özellikler

### 1. 🏠 Ana Sayfa (Dashboard)
- ✅ Kişiselleştirilmiş selamlama
- ✅ Günlük hedef kartı (dakika, set, adım)
- ✅ Bugünkü antrenman planı
- ✅ Hızlı işlemler (Antrenman ekle, Kilo gir, Ağırlık kaydet)
- ✅ Haftalık antrenman sıklığı
- ✅ Kilo takibi özeti
- ✅ Son kaldırılan ağırlıklar
- ✅ Motivasyon kartı

### 2. 📅 Program Ekranı
- ✅ Haftalık takvim şeridi (Pzt-Paz)
- ✅ Gün bazlı egzersiz listesi
- ✅ Egzersiz kartları (set, tekrar, dinlenme)
- ✅ Sürükle-bırak göstergesi
- ✅ Antrenman şablonları
- ✅ Egzersiz detay modalı
- ✅ Set/tekrar/ağırlık düzenleme
- ✅ Alternatif egzersiz önerileri
- ✅ FAB ile hızlı ekleme

### 3. 📊 Takip Ekranı
- ✅ **Ağırlık Takibi**
  - Egzersiz seçici ve arama
  - İlerleme grafikleri
  - Son kayıtlar listesi
  - RPE (algılanan zorluk) sistemi
  - E1RM (tek tekrar tahmini)
  - Birim geçişi (kg/lbs)
  - CSV'den içe aktarma
- ✅ **Kilo Takibi**
  - Mevcut kilo ve hedef gösterimi
  - Trend grafikleri
  - 7 günlük hareketli ortalama
  - Haftalık özet
  - Son ölçümler listesi
  - Günlük hatırlatma ayarı
- ✅ **Antrenman Sıklığı**
  - Aylık ısı haritası (heatmap)
  - Seri gün sayısı (streak)
  - Tamamlanan/kaçırılan günler
  - Toplam süre istatistikleri
  - İlerleme paylaşımı

### 4. 💡 Motivasyon Ekranı
- ✅ Günün sözü kartı
- ✅ Kaydırılabilir söz akışı
- ✅ Kategori filtreleri (disiplin, motivasyon, zihinsel, vb.)
- ✅ Favori sistemi
- ✅ Paylaşım özelliği
- ✅ Kendi sözünü ekle (onay akışı)
- ✅ Bildirim zamanlama (sabah/akşam)
- ✅ Rahatsız etme modu

### 5. 👤 Profil Ekranı
- ✅ **Profil Bilgileri**
  - Avatar ve profil fotoğrafı
  - İsim, e-posta düzenleme
  - Üyelik bilgisi
  - Şifre değiştirme
- ✅ **Hedefler**
  - Hedef kilo
  - Yağ oranı hedefi
  - Haftalık antrenman hedefi
  - İlerleme yüzdeleri
- ✅ **Rozetler & Başarılar**
  - Kilidi açılmış/kilitli rozetler
  - 7 gün seri, ilk antrenman, vb.
- ✅ **Ayarlar**
  - Tema seçimi (sistem/karanlık/açık)
  - Ölçü birimleri (kg/lbs, cm/inch)
  - Bildirim ayarları
- ✅ **Veri Yönetimi**
  - Verileri içe/dışa aktarma
  - Senkronizasyon durumu
- ✅ **Destek**
  - SSS
  - Geri bildirim formu
  - Gizlilik politikası
  - Kullanım koşulları

## 🎯 Gelecek Özellikler

- [ ] Firebase entegrasyonu (Authentication, Database)
- [ ] Gerçek veri persistance (AsyncStorage/SQLite)
- [ ] Egzersiz kütüphanesi ve detaylı arama
- [ ] Video/animasyon rehberleri
- [ ] Sosyal özellikler (arkadaş ekleme, paylaşım)
- [ ] Apple Health / Google Fit entegrasyonu
- [ ] Gerçek karanlık mod implementasyonu
- [ ] Offline mod
- [ ] Antrenman oturumu timer'ı
- [ ] Ses bildirimleri

## 👨‍💻 Geliştirici Notları

### Yeni Ekran Ekleme
1. `src/screens/` altına yeni ekran dosyası oluştur
2. `src/screens/index.js` içine export ekle
3. `src/navigation/BottomTabNavigator.js` içine Tab.Screen ekle

### Yeni Component Ekleme
1. `src/components/common/` altına component dosyası oluştur
2. `src/components/common/index.js` içine export ekle
3. İhtiyaç duyulan yerde import et

### Tema Değişiklikleri
Tüm renk, spacing ve tipografi ayarları `src/constants/theme.js` dosyasında merkezi olarak yönetiliyor.

## 📝 Lisans

MIT License - Özgürce kullanabilirsiniz!

