# 💪 Fitness App - Özellikler Detayı

## 📱 Ekran Yapısı

### 5 Ana Ekran
1. **Ana Sayfa (Dashboard)** - Genel özet ve hızlı erişim
2. **Program** - Antrenman programı yönetimi
3. **Takip** - Ağırlık ve kilo takibi
4. **Motivasyon** - İlham verici içerikler
5. **Profil** - Kullanıcı ayarları ve hedefler

---

## 🏠 1. Ana Sayfa (HomeScreen)

### Bileşenler:
- **Selamlama Başlığı**: Kişiselleştirilmiş karşılama mesajı
- **Günün Hedefi Kartı**: 
  - Dakika hedefi
  - Set sayısı hedefi
  - Günlük adım hedefi
- **Bugünkü Antrenman**:
  - Antrenman detayları (egzersiz sayısı, süre)
  - Kas grubu ve zorluk etiketleri
  - "Antrenmana Başla" butonu
- **Hızlı İşlemler**:
  - Antrenman Ekle
  - Kilo Gir
  - Ağırlık Kaydet
- **Bu Hafta İlerleme**:
  - Haftalık antrenman sıklığı (görsel takvim)
  - Kilo takibi (mevcut → hedef)
  - Son kaldırılan ağırlıklar
- **Motivasyon Mini Kartı**: Günün sözü

### Kullanılan Componentler:
- `Card`, `Text`, `Button`
- `Ionicons` ikonları
- ScrollView ile kaydırılabilir içerik

---

## 📅 2. Program Ekranı (ProgramScreen)

### Bileşenler:
- **Haftalık Takvim Şeridi**:
  - 7 gün (Pzt-Paz)
  - Aktif gün vurgulama
  - Antrenman yapılan günlerde nokta göstergesi
  
- **Filtre ve Şablon Butonları**:
  - Şablonlar modalı
  - Filtre seçenekleri

- **Egzersiz Listesi**:
  - Sürükle-bırak göstergesi
  - Egzersiz numaraları
  - Set × Tekrar bilgisi
  - Dinlenme süresi
  - Kas grubu ve ekipman etiketleri

- **Modallar**:
  1. **Egzersiz Ekle Modal**:
     - Egzersiz adı
     - Set/tekrar sayısı
     - Ağırlık ve dinlenme süresi
     - Not alanı
  
  2. **Şablonlar Modal**:
     - Tam Vücut, Push, Pull, Legs
     - Kendi şablonunu oluştur
  
  3. **Egzersiz Detay Modal**:
     - Set/tekrar düzenleme
     - Dinlenme süresi
     - Alternatif egzersizler

### Özellikler:
- FAB (Floating Action Button) ile hızlı ekleme
- Mock veri ile örnek egzersizler
- Responsive kart tasarımı

---

## 📊 3. Takip Ekranı (TrackingScreen)

### 3 Ana Sekme:

#### A. Ağırlık Takibi
- **Egzersiz Seçici**: Autocomplete arama
- **İlerleme Grafiği**: 
  - LineChart ile trend gösterimi
  - kg/lbs birim geçişi
- **İstatistikler**:
  - Son ağırlık
  - PR (Kişisel Rekor)
  - E1RM (Estimated 1 Rep Max)
- **Son Kayıtlar**:
  - Tarih, ağırlık, tekrar
  - RPE (Rate of Perceived Exertion) değeri
- **CSV İçe Aktarma**: Toplu veri yükleme

#### B. Kilo Takibi
- **Mevcut Kilo Kartı**:
  - Büyük numara gösterimi
  - Değişim trendi (↓↑)
  - İlerleme çubuğu
- **Trend Grafiği**:
  - 7 günlük hareketli ortalama
  - Tarih bazlı görselleştirme
- **Haftalık Özet**:
  - Ortalama kilo
  - En düşük kilo
  - Haftalık değişim
- **Son Ölçümler**: Detaylı geçmiş
- **Hatırlatma Ayarı**: Günlük bildirim

#### C. Antrenman Sıklığı
- **Aylık Isı Haritası (Heatmap)**:
  - 30 günlük takvim görünümü
  - Antrenman yapılan günler vurgulu
  - Ay değiştirme navigasyonu
- **İstatistikler**:
  - Tamamlanan günler
  - Kaçırılan günler
  - Toplam süre
  - En uzun seri (streak)
- **Paylaş Butonu**: İlerleme paylaşımı

### Kullanılan Kütüphaneler:
- `react-native-chart-kit`: Grafik gösterimi
- `react-native-svg`: Grafik desteği
- `Tabs` componenti

---

## 💡 4. Motivasyon Ekranı (MotivationScreen)

### Bileşenler:
- **Günün Sözü Kartı**:
  - Öne çıkan büyük kart
  - Paylaş butonu
  - Favori ekleme
  - Yazar bilgisi

- **Kategori Filtreleri**:
  - Tümü
  - Disiplin
  - Motivasyon
  - Zihinsel
  - Dayanıklılık
  - Gelişim
  - İlham

- **Favorilerim Bölümü**:
  - Yatay kaydırılabilir kartlar
  - Favori kalp ikonu
  - Hızlı erişim

- **Söz Akışı**:
  - Filtrelenebilir liste
  - Her kartta kategori, paylaş, favori butonları
  - Boş durum gösterimi

- **Bildirim Ayarları**:
  - Sabah bildirimi (08:00)
  - Akşam bildirimi (20:00)
  - Rahatsız etme modu

- **Kendi Sözünü Ekle Modal**:
  - Söz metni
  - Yazar bilgisi
  - Kategori seçimi
  - Onay akışı bildirimi

### Özellikler:
- 8+ örnek motivasyon sözü
- Paylaşım fonksiyonu (`Share` API)
- Dinamik filtreleme
- Favori sistemi (state yönetimi)

---

## 👤 5. Profil Ekranı (ProfileScreen)

### Bileşenler:

#### A. Profil Header
- **Avatar**:
  - 100x100 profil resmi
  - Fotoğraf değiştirme butonu
  - Yuvarlak tasarım
- **Kullanıcı Bilgileri**:
  - İsim
  - E-posta
  - Üyelik tarihi rozeti
  - Profil düzenle butonu

#### B. Hedeflerim
- **3 Hedef Kartı**:
  1. Hedef Kilo (81.0 → 75.0 kg)
  2. Yağ Oranı (18% → 12%)
  3. Haftalık Antrenman (4/5 gün)
- Her kartta:
  - İkon
  - Mevcut/Hedef değerler
  - İlerleme yüzdesi
  - İlerleme çubuğu

#### C. Rozetler & Başarılar
- **4 Rozet**:
  - 7 Gün Seri (🔥)
  - İlk Antrenman (🏆)
  - 50 Antrenman (🥇)
  - 100 Antrenman (🎗️ - Kilitli)
- Grid yerleşimi (2 sütun)
- Kilidi açılmış/kilitli durumlar

#### D. Ayarlar
1. **Tema**:
   - Sistem / Karanlık / Açık
   - Ay ikonu
   
2. **Ölçü Birimleri**:
   - Metrik (kg, cm)
   - Imperial (lbs, inch)
   - Toggle butonları
   
3. **Bildirimler**:
   - Antrenman hatırlatmaları
   - Toggle switch

#### E. Veri Yönetimi
- Verileri İçe Aktar
- Verileri Dışa Aktar
- Senkronizasyon durumu

#### F. Destek
- Sıkça Sorulan Sorular
- Geri Bildirim Gönder
- Gizlilik Politikası
- Kullanım Koşulları

#### G. Alt Bölüm
- Çıkış Yap butonu (kırmızı outline)
- Versiyon numarası (1.0.0)

### Modallar:
1. **Profil Düzenle**:
   - İsim, e-posta
   - Mevcut şifre
   - Yeni şifre
   
2. **Hedef Düzenle**:
   - Mevcut değer
   - Hedef değer
   - İlerleme gösterimi

---

## 🎨 Reusable Componentler

### 1. Card
```javascript
<Card onPress={() => {}} shadow={true}>
  {/* İçerik */}
</Card>
```
- Gölge efekti
- Tıklanabilir/tıklanamaz
- Tutarlı padding ve border-radius

### 2. Button
```javascript
<Button 
  title="Başla"
  variant="primary" // primary, secondary, outline, text
  size="medium"     // small, medium, large
  loading={false}
  disabled={false}
  icon={<Icon />}
/>
```
- 4 varyant
- 3 boyut
- Loading state
- İkon desteği

### 3. Text
```javascript
<Text 
  variant="heading1" // heading1-3, body, caption, label
  color={COLORS.primary}
  weight="bold"
>
  Metin
</Text>
```
- 6 varyant
- Dinamik renk
- Font weight kontrolü

### 4. Input
```javascript
<Input
  label="Email"
  placeholder="email@example.com"
  value={email}
  onChangeText={setEmail}
  error="Hata mesajı"
  icon={<Icon />}
/>
```
- Label desteği
- Hata gösterimi
- Sol ikon alanı

### 5. FAB (Floating Action Button)
```javascript
<FAB 
  icon="add"
  onPress={() => {}}
  position="right" // right, left, center
/>
```
- Sabit konumlu
- Gölge efekti
- Konum seçenekleri

### 6. Badge
```javascript
<Badge 
  label="Yeni"
  variant="primary" // primary, secondary, success, warning, info
/>
```
- 5 renk varyantı
- Küçük etiketler için

### 7. Modal
```javascript
<Modal
  visible={isVisible}
  onClose={() => {}}
  title="Modal Başlığı"
>
  {/* İçerik */}
</Modal>
```
- Alt'tan açılır animasyon
- Kapatma butonu
- Kaydırılabilir içerik

### 8. Tabs
```javascript
<Tabs 
  tabs={[
    { key: 'tab1', label: 'Tab 1' },
    { key: 'tab2', label: 'Tab 2' }
  ]}
  activeTab={activeTab}
  onTabChange={setActiveTab}
/>
```
- Yatay kaydırılabilir
- Aktif tab vurgulama

---

## 🎨 Tasarım Sistemi

### Renkler
```javascript
primary: '#6C5CE7'      // Mor
secondary: '#00B894'    // Yeşil
success: '#00B894'      // Yeşil
warning: '#FDCB6E'      // Sarı
error: '#FF7675'        // Kırmızı
info: '#74B9FF'         // Mavi
```

### Spacing (8pt Grid)
```javascript
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
xxl: 48px
```

### Typography
```javascript
xs: 12px    // Labels
sm: 14px    // Captions
md: 16px    // Body
lg: 18px    // Subheadings
xl: 24px    // Headings
xxl: 32px   // Large headings
xxxl: 40px  // Hero text
```

### Border Radius
```javascript
xs: 4px
sm: 8px
md: 12px
lg: 16px
xl: 24px
full: 9999px
```

---

## 📊 Mock Veri Yapısı

### Egzersiz
```javascript
{
  id: 1,
  name: "Bench Press",
  sets: 4,
  reps: "8-10",
  rest: 90,
  muscleGroup: "Göğüs",
  equipment: "Barbell"
}
```

### Ağırlık Kaydı
```javascript
{
  date: "01.11",
  weight: 82,
  reps: 8,
  rpe: 7
}
```

### Kilo Kaydı
```javascript
{
  date: "01.11",
  weight: 82.3
}
```

### Motivasyon Sözü
```javascript
{
  id: 1,
  quote: "Güç, tekrar etmekten gelir...",
  author: "Bruce Lee",
  category: "disiplin",
  isFavorite: false
}
```

---

## 🚀 Çalıştırma

```bash
# FitnessApp dizinine git
cd FitnessApp

# Bağımlılıkları yükle (ilk seferinde)
npm install

# Uygulamayı başlat
npm start

# Web'de aç
w tuşuna bas

# Android'de aç
a tuşuna bas

# iOS'ta aç
i tuşuna bas
```

---

## 📱 Ekran Görüntüleri Konseptleri

### Ana Sayfa
- Beyaz arka plan
- Mor primary renk vurguları
- Kart tabanlı layout
- İkonlar her yerde

### Program
- Haftalık takvim üstte sabit
- Kartlar listesi
- FAB sağ altta
- Modallar alt'tan açılır

### Takip
- Tablar üstte
- Grafikler ortada
- İstatistik kartları
- FAB alta sabitlenmiş buton

### Motivasyon
- Büyük featured kart
- Chip filtreleri
- Kart listesi
- Favori sistemi

### Profil
- Üstte profil header
- Hedef kartları
- Rozet grid'i
- Ayarlar listesi

---

## 🎯 UX Özellikleri

✅ **Tutarlılık**: Tüm ekranlarda aynı component'ler
✅ **Kolay Navigasyon**: Bottom tab bar
✅ **Hızlı Erişim**: FAB ve quick actions
✅ **Görsel Geri Bildirim**: Renkli kartlar ve ikonlar
✅ **Boş Durumlar**: Her ekranda uygun mesajlar
✅ **Modal'lar**: Kolay form girişi
✅ **İlerleme Göstergeleri**: Progress bar'lar
✅ **Grafikler**: Trend görselleştirme

---

## 📝 Notlar

- Tüm veriler şu an mock (statik)
- Firebase entegrasyonu sonraki adım
- Gerçek veri persistance eklenecek
- Animasyonlar ileride geliştirilecek
- Test coverage artırılacak

---

**Geliştirici**: React Native + Expo
**Durum**: ✅ Tüm ekranlar tamamlandı
**Tarih**: Kasım 2025

