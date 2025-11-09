import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Share, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Text, Button, Badge, Modal, Input } from '../components/common';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { useUser } from '../context';
import { motivationService } from '../services';

const CATEGORIES = [
  { key: 'all', label: 'Tümü', icon: 'apps-outline' },
  { key: 'disiplin', label: 'Disiplin', icon: 'shield-checkmark-outline' },
  { key: 'motivasyon', label: 'Motivasyon', icon: 'flame-outline' },
  { key: 'zihinsel', label: 'Zihinsel', icon: 'fitness-outline' },
  { key: 'dayanıklılık', label: 'Dayanıklılık', icon: 'barbell-outline' },
  { key: 'gelişim', label: 'Gelişim', icon: 'trending-up-outline' },
  { key: 'ilham', label: 'İlham', icon: 'bulb-outline' },
  { key: 'başlangıç', label: 'Başlangıç', icon: 'rocket-outline' },
];

export const MotivationScreen = () => {
  const { userId } = useUser();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Data states
  const [quotes, setQuotes] = useState([]);
  const [todayQuote, setTodayQuote] = useState(null);
  const [favoriteQuotes, setFavoriteQuotes] = useState([]);

  // Form states
  const [formQuote, setFormQuote] = useState('');
  const [formAuthor, setFormAuthor] = useState('');
  const [formCategory, setFormCategory] = useState('motivasyon');

  // Veri yükleme
  useEffect(() => {
    if (userId) {
      loadData();
    }
  }, [userId]);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Motivasyon verileri yükleniyor...');

      const [allQuotes, quoteOfDay, favorites] = await Promise.all([
        motivationService.getMotivationalQuotes(userId),
        motivationService.getQuoteOfTheDay(userId),
        motivationService.getFavoriteQuotes(userId),
      ]);

      setQuotes(allQuotes);
      setTodayQuote(quoteOfDay);
      setFavoriteQuotes(favorites);

      console.log('✅ Motivasyon verileri yüklendi:', {
        totalQuotes: allQuotes.length,
        favorites: favorites.length,
      });
    } catch (error) {
      console.error('❌ Motivasyon veri yükleme hatası:', error);
      Alert.alert('Hata', 'Veriler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  // Favori durumunu değiştir
  const handleToggleFavorite = async (quoteId, currentFavorite) => {
    try {
      await motivationService.toggleFavorite(quoteId, !currentFavorite);
      
      // Local state'i güncelle
      setQuotes(prev =>
        prev.map(q => (q.id === quoteId ? { ...q, is_favorite: !currentFavorite } : q))
      );
      
      // Favorileri yeniden yükle
      const favorites = await motivationService.getFavoriteQuotes(userId);
      setFavoriteQuotes(favorites);
    } catch (error) {
      console.error('Favori güncelleme hatası:', error);
      Alert.alert('Hata', 'Favori durumu güncellenemedi');
    }
  };

  // Paylaş
  const handleShare = async (quote) => {
    try {
      await Share.share({
        message: `"${quote.quote}"\n\n- ${quote.author}`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Yeni söz ekle
  const handleAddQuote = async () => {
    try {
      if (!formQuote.trim()) {
        Alert.alert('Uyarı', 'Lütfen bir söz girin');
        return;
      }

      setLoading(true);

      await motivationService.addMotivationalQuote(userId, {
        quote: formQuote,
        author: formAuthor || 'Anonim',
        category: formCategory,
        is_favorite: false,
      });

      Alert.alert('✅ Başarılı!', 'Söz eklendi');

      // Form'u temizle
      setFormQuote('');
      setFormAuthor('');
      setFormCategory('motivasyon');
      setShowAddModal(false);

      // Verileri yenile
      loadData();
    } catch (error) {
      console.error('Söz ekleme hatası:', error);
      Alert.alert('Hata', 'Söz eklenemedi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Söz sil
  const handleDeleteQuote = async (quoteId) => {
    try {
      Alert.alert(
        'Emin misiniz?',
        'Bu sözü silmek istediğinize emin misiniz?',
        [
          { text: 'İptal', style: 'cancel' },
          {
            text: 'Sil',
            style: 'destructive',
            onPress: async () => {
              await motivationService.deleteMotivationalQuote(quoteId);
              loadData();
              Alert.alert('✅ Başarılı', 'Söz silindi');
            },
          },
        ]
      );
    } catch (error) {
      console.error('Söz silme hatası:', error);
      Alert.alert('Hata', 'Söz silinemedi');
    }
  };

  // Filtrelenmiş sözler
  const filteredQuotes = selectedCategory === 'all'
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  return (
    <View style={styles.container}>
      {loading && quotes.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text variant="body" style={styles.loadingText}>Yükleniyor...</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Günün Sözü Kartı */}
          {todayQuote && (
            <Card style={styles.todayCard}>
              <View style={styles.todayHeader}>
                <View style={styles.todayBadge}>
                  <Ionicons name="sunny" size={24} color={COLORS.warning} />
                  <Text variant="body" weight="bold" color={COLORS.warning}>
                    Günün Sözü
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.shareButton}
                  onPress={() => handleShare(todayQuote)}
                >
                  <Ionicons name="share-social-outline" size={24} color={COLORS.primary} />
                </TouchableOpacity>
              </View>

              <View style={styles.quoteContent}>
                <Ionicons 
                  name="quote" 
                  size={40} 
                  color={COLORS.primaryLight} 
                  style={styles.quoteIcon}
                />
                <Text variant="heading3" style={styles.quoteText}>
                  {todayQuote.quote}
                </Text>
                <Text variant="body" color={COLORS.textSecondary} style={styles.quoteAuthor}>
                  - {todayQuote.author}
                </Text>
              </View>

              <TouchableOpacity 
                style={styles.favoriteButton}
                onPress={() => handleToggleFavorite(todayQuote.id, todayQuote.is_favorite)}
              >
                <Ionicons 
                  name={todayQuote.is_favorite ? "heart" : "heart-outline"} 
                  size={28} 
                  color={todayQuote.is_favorite ? COLORS.error : COLORS.textSecondary} 
                />
              </TouchableOpacity>
            </Card>
          )}

        {/* Kategori Filtreleri */}
        <View style={styles.categoriesSection}>
          <Text variant="heading3" style={styles.sectionTitle}>Kategoriler</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categories}
          >
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.key}
                style={[
                  styles.categoryChip,
                  selectedCategory === category.key && styles.categoryChipActive,
                ]}
                onPress={() => setSelectedCategory(category.key)}
              >
                <Ionicons 
                  name={category.icon} 
                  size={20} 
                  color={selectedCategory === category.key ? COLORS.surface : COLORS.primary} 
                />
                <Text 
                  variant="body"
                  weight="semibold"
                  color={selectedCategory === category.key ? COLORS.surface : COLORS.primary}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

          {/* Favori Sözler */}
          {favoriteQuotes.length > 0 && selectedCategory === 'all' && (
            <View style={styles.favoritesSection}>
              <View style={styles.sectionHeader}>
                <Text variant="heading3">Favorilerim</Text>
                <Badge label={`${favoriteQuotes.length}`} variant="error" />
              </View>

              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.favoritesScroll}
              >
                {favoriteQuotes.map((quote) => (
                  <Card key={quote.id} style={styles.favoriteCard}>
                    <Text variant="body" style={styles.favoriteQuote}>
                      "{quote.quote}"
                    </Text>
                    <Text variant="caption" color={COLORS.textSecondary}>
                      - {quote.author}
                    </Text>
                    <TouchableOpacity 
                      style={styles.favoriteHeart}
                      onPress={() => handleToggleFavorite(quote.id, quote.is_favorite)}
                    >
                      <Ionicons name="heart" size={20} color={COLORS.error} />
                    </TouchableOpacity>
                  </Card>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Söz Akışı */}
          <View style={styles.quotesSection}>
            <Text variant="heading3" style={styles.sectionTitle}>
              {selectedCategory === 'all' ? 'Tüm Sözler' : CATEGORIES.find(c => c.key === selectedCategory)?.label}
            </Text>
            <Text variant="caption" color={COLORS.textSecondary} style={styles.sectionSubtitle}>
              {filteredQuotes.length} söz bulundu
            </Text>

            {filteredQuotes.map((quote) => (
              <Card key={quote.id} style={styles.quoteCard}>
                <View style={styles.quoteCardHeader}>
                  <Badge 
                    label={CATEGORIES.find(c => c.key === quote.category)?.label || quote.category} 
                    variant="primary" 
                  />
                  <View style={styles.quoteActions}>
                    <TouchableOpacity 
                      onPress={() => handleToggleFavorite(quote.id, quote.is_favorite)}
                      style={styles.actionButton}
                    >
                      <Ionicons 
                        name={quote.is_favorite ? "heart" : "heart-outline"} 
                        size={22} 
                        color={quote.is_favorite ? COLORS.error : COLORS.textSecondary} 
                      />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => handleShare(quote)}
                      style={styles.actionButton}
                    >
                      <Ionicons name="share-social-outline" size={22} color={COLORS.textSecondary} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => handleDeleteQuote(quote.id)}
                      style={styles.actionButton}
                    >
                      <Ionicons name="trash-outline" size={22} color={COLORS.danger} />
                    </TouchableOpacity>
                  </View>
                </View>

                <Text variant="body" style={styles.quoteCardText}>
                  "{quote.quote}"
                </Text>
                <Text variant="caption" color={COLORS.textSecondary}>
                  - {quote.author}
                </Text>
              </Card>
            ))}
          </View>

        {/* Boş Durum */}
        {filteredQuotes.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={64} color={COLORS.textLight} />
            <Text variant="heading3" style={styles.emptyTitle}>
              Söz Bulunamadı
            </Text>
            <Text variant="body" color={COLORS.textSecondary} style={styles.emptyText}>
              Bu kategoride henüz söz bulunmuyor
            </Text>
          </View>
        )}

        {/* Bildirim Ayarı Kartı */}
        <Card style={styles.notificationCard}>
          <View style={styles.notificationHeader}>
            <Ionicons name="notifications" size={32} color={COLORS.primary} />
            <View style={styles.notificationInfo}>
              <Text variant="body" weight="semibold">Günlük Motivasyon</Text>
              <Text variant="caption">Her gün bir söz al</Text>
            </View>
          </View>
          <Button
            title="Bildirimleri Ayarla"
            variant="outline"
            size="small"
            onPress={() => setShowNotificationModal(true)}
          />
        </Card>

        {/* Kendi Sözünü Ekle */}
        <Button
          title="Kendi Sözünü Ekle"
          variant="primary"
          icon={<Ionicons name="add-circle-outline" size={20} color={COLORS.surface} />}
          onPress={() => setShowAddModal(true)}
          style={styles.addButton}
        />

          {/* Alt Boşluk */}
          <View style={styles.bottomSpace} />
        </ScrollView>
      )}

      {/* Söz Ekle Modal */}
        <Modal
          visible={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setFormQuote('');
            setFormAuthor('');
            setFormCategory('motivasyon');
          }}
          title="Kendi Sözünü Ekle"
        >
          <Text variant="caption" style={styles.modalDescription}>
            Kendi motivasyon sözünüzü ekleyin. Sadece siz görebilirsiniz.
          </Text>

          <Input
            label="Söz *"
            placeholder="Motivasyon sözünü buraya yazın..."
            multiline
            numberOfLines={4}
            value={formQuote}
            onChangeText={setFormQuote}
          />

          <Input
            label="Yazar (opsiyonel)"
            placeholder="Yazar adı veya 'Anonim'"
            value={formAuthor}
            onChangeText={setFormAuthor}
          />

          <View style={styles.categorySelect}>
            <Text variant="body" weight="semibold" style={styles.categoryLabel}>
              Kategori Seç *
            </Text>
            <View style={styles.categoryOptions}>
              {CATEGORIES.filter(c => c.key !== 'all').map((category) => (
                <TouchableOpacity
                  key={category.key}
                  style={[
                    styles.categoryOption,
                    formCategory === category.key && styles.categoryOptionActive,
                  ]}
                  onPress={() => setFormCategory(category.key)}
                >
                  <Ionicons 
                    name={category.icon} 
                    size={20} 
                    color={formCategory === category.key ? COLORS.surface : COLORS.primary} 
                  />
                  <Text 
                    variant="caption"
                    color={formCategory === category.key ? COLORS.surface : COLORS.text}
                  >
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.modalActions}>
            <Button 
              title="İptal" 
              variant="outline" 
              onPress={() => {
                setShowAddModal(false);
                setFormQuote('');
                setFormAuthor('');
                setFormCategory('motivasyon');
              }}
              style={{ flex: 1, marginRight: SPACING.sm }}
            />
            <Button 
              title="Kaydet" 
              variant="primary"
              onPress={handleAddQuote}
              disabled={loading}
              style={{ flex: 1 }}
            />
          </View>
        </Modal>

      {/* Bildirim Ayarları Modal */}
      <Modal
        visible={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        title="Bildirim Ayarları"
      >
        <View style={styles.notificationSettings}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text variant="body" weight="semibold">Sabah Bildirimi</Text>
              <Text variant="caption">Her sabah 08:00'de</Text>
            </View>
            {/* Toggle switch burada olabilir */}
            <View style={styles.togglePlaceholder}>
              <Text variant="caption" color={COLORS.success}>Açık</Text>
            </View>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text variant="body" weight="semibold">Akşam Bildirimi</Text>
              <Text variant="caption">Her akşam 20:00'de</Text>
            </View>
            <View style={styles.togglePlaceholder}>
              <Text variant="caption" color={COLORS.textLight}>Kapalı</Text>
            </View>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text variant="body" weight="semibold">Rahatsız Etme Modu</Text>
              <Text variant="caption">22:00 - 08:00 arası</Text>
            </View>
            <View style={styles.togglePlaceholder}>
              <Text variant="caption" color={COLORS.success}>Açık</Text>
            </View>
          </View>
        </View>

        <Button
          title="Kaydet"
          variant="primary"
          onPress={() => setShowNotificationModal(false)}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  todayCard: {
    margin: SPACING.lg,
    backgroundColor: COLORS.primaryLight + '15',
    ...SHADOWS.medium,
  },
  todayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  todayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  shareButton: {
    padding: SPACING.xs,
  },
  quoteContent: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  quoteIcon: {
    marginBottom: SPACING.md,
    opacity: 0.3,
  },
  quoteText: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: SPACING.md,
    lineHeight: 28,
  },
  quoteAuthor: {
    fontStyle: 'italic',
  },
  favoriteButton: {
    alignSelf: 'center',
    marginTop: SPACING.md,
    padding: SPACING.sm,
  },
  categoriesSection: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    marginBottom: SPACING.md,
  },
  categories: {
    gap: SPACING.sm,
    paddingRight: SPACING.lg,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.full,
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
  },
  favoritesSection: {
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  favoritesScroll: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  favoriteCard: {
    width: 280,
    minHeight: 120,
    position: 'relative',
  },
  favoriteQuote: {
    fontStyle: 'italic',
    marginBottom: SPACING.sm,
  },
  favoriteHeart: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
  },
  quotesSection: {
    paddingHorizontal: SPACING.lg,
  },
  sectionSubtitle: {
    marginBottom: SPACING.md,
  },
  quoteCard: {
    marginBottom: SPACING.md,
  },
  quoteCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  quoteActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  actionButton: {
    padding: SPACING.xs,
  },
  quoteCardText: {
    fontStyle: 'italic',
    marginBottom: SPACING.sm,
    lineHeight: 24,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyTitle: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    textAlign: 'center',
  },
  notificationCard: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
  },
  notificationInfo: {
    flex: 1,
  },
  addButton: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  bottomSpace: {
    height: SPACING.xl,
  },
  modalDescription: {
    marginBottom: SPACING.lg,
    color: COLORS.textSecondary,
  },
  categorySelect: {
    marginBottom: SPACING.lg,
  },
  categoryLabel: {
    marginBottom: SPACING.md,
  },
  categoryOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  categoryOptionActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  modalActions: {
    flexDirection: 'row',
    marginTop: SPACING.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xl * 3,
  },
  loadingText: {
    marginTop: SPACING.md,
    color: COLORS.textSecondary,
  },
  notificationSettings: {
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
  },
  settingInfo: {
    flex: 1,
  },
  togglePlaceholder: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.surface,
  },
});
