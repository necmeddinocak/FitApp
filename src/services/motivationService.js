import { supabase } from '../config/supabase';

// Default motivational quotes (will be added to user's collection on first use)
const DEFAULT_QUOTES = [
  {
    quote: "Güç, tekrar etmekten gelir. Süreklilik anahtardır.",
    author: "Bruce Lee",
    category: "disiplin",
  },
  {
    quote: "Başarısızlık bir seçenek değil. Herkes başarılı olmak zorunda.",
    author: "Arnold Schwarzenegger",
    category: "motivasyon",
  },
  {
    quote: "Vücudun başaramayacağı çok şey vardır, ama zihin onu durdurmadan önce.",
    author: "David Goggins",
    category: "zihinsel",
  },
  {
    quote: "Ağrı geçicidir. Vazgeçmek sonsuzdur.",
    author: "Lance Armstrong",
    category: "dayanıklılık",
  },
  {
    quote: "Kendinizle rekabet edin. Dünkü halinizden daha iyi olun.",
    author: "Anonim",
    category: "gelişim",
  },
  {
    quote: "Egzersiz yapmanın en zor kısmı başlamaktır.",
    author: "Tom Hanks",
    category: "motivasyon",
  },
  {
    quote: "Sınırlarınız sadece hayal gücünüzle belirlenir.",
    author: "Tony Robbins",
    category: "ilham",
  },
  {
    quote: "Bir yıl sonra, keşke bugün başlamış olsaydım diyeceksiniz.",
    author: "Karen Lamb",
    category: "başlangıç",
  },
];

/**
 * Kullanıcının motivasyon sözlerini getir
 */
export const getMotivationalQuotes = async (userId) => {
  const { data, error } = await supabase
    .from('motivational_quotes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Eğer hiç söz yoksa, default sözleri ekle
  if (data.length === 0) {
    await initializeDefaultQuotes(userId);
    return await getMotivationalQuotes(userId);
  }

  return data;
};

/**
 * Default sözleri kullanıcıya ekle
 */
const initializeDefaultQuotes = async (userId) => {
  const quotesToInsert = DEFAULT_QUOTES.map(quote => ({
    user_id: userId,
    ...quote,
  }));

  const { error } = await supabase
    .from('motivational_quotes')
    .insert(quotesToInsert);

  if (error) throw error;
};

/**
 * Kategoriye göre sözleri getir
 */
export const getQuotesByCategory = async (userId, category) => {
  const { data, error } = await supabase
    .from('motivational_quotes')
    .select('*')
    .eq('user_id', userId)
    .eq('category', category)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

/**
 * Favori sözleri getir
 */
export const getFavoriteQuotes = async (userId) => {
  const { data, error } = await supabase
    .from('motivational_quotes')
    .select('*')
    .eq('user_id', userId)
    .eq('is_favorite', true)
    .order('created_at', { ascending: false});

  if (error) throw error;
  return data;
};

/**
 * Yeni söz ekle
 */
export const addMotivationalQuote = async (userId, quote) => {
  const { data, error } = await supabase
    .from('motivational_quotes')
    .insert({
      user_id: userId,
      ...quote,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Sözü güncelle
 */
export const updateMotivationalQuote = async (quoteId, updates) => {
  const { data, error } = await supabase
    .from('motivational_quotes')
    .update(updates)
    .eq('id', quoteId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Favori durumunu değiştir
 */
export const toggleFavorite = async (quoteId, isFavorite) => {
  return await updateMotivationalQuote(quoteId, { is_favorite: isFavorite });
};

/**
 * Sözü sil
 */
export const deleteMotivationalQuote = async (quoteId) => {
  const { error } = await supabase
    .from('motivational_quotes')
    .delete()
    .eq('id', quoteId);

  if (error) throw error;
};

/**
 * Günün sözünü al (random)
 */
export const getQuoteOfTheDay = async (userId) => {
  const allQuotes = await getMotivationalQuotes(userId);
  
  if (allQuotes.length === 0) return null;

  // Günün tarihine göre deterministic random
  const today = new Date().toISOString().split('T')[0];
  const seed = today.split('-').join('');
  const index = parseInt(seed) % allQuotes.length;

  return allQuotes[index];
};

