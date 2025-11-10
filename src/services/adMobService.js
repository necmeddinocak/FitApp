import { Platform } from 'react-native';

// Native modülleri sadece production build'de import et
let mobileAds, BannerAd, BannerAdSize, TestIds, InterstitialAd, AdEventType, RewardedAd, RewardedAdEventType;

const isExpoGo = __DEV__ && !Platform.select({ native: true, default: false });

if (!isExpoGo) {
  try {
    const admob = require('react-native-google-mobile-ads');
    mobileAds = admob.default;
    BannerAd = admob.BannerAd;
    BannerAdSize = admob.BannerAdSize;
    TestIds = admob.TestIds;
    InterstitialAd = admob.InterstitialAd;
    AdEventType = admob.AdEventType;
    RewardedAd = admob.RewardedAd;
    RewardedAdEventType = admob.RewardedAdEventType;
  } catch (e) {
    console.log('AdMob not available in Expo Go');
  }
}

// AdMob Konfigürasyonu
class AdMobService {
  constructor() {
    this.initialized = false;
    this.interstitialAd = null;
    this.rewardedAd = null;
  }

  // AdMob'u başlat
  async initialize() {
    if (this.initialized || !mobileAds) return;

    try {
      await mobileAds().initialize();
      this.initialized = true;
      console.log('✅ AdMob başarıyla başlatıldı');
    } catch (error) {
      console.error('❌ AdMob başlatma hatası:', error);
    }
  }

  // Banner Reklam ID'leri (Test ID'leri kullanıyoruz)
  getBannerAdUnitId() {
    if (!TestIds) return null;
    // Test ID - Gerçek uygulamada kendi AdMob ID'nizi kullanın
    return TestIds.BANNER;
    
    // Gerçek ID'ler için (AdMob hesabınızdan alın):
    // return Platform.select({
    //   ios: 'ca-app-pub-XXXXXXXXXXXXX/YYYYYYYYYY',
    //   android: 'ca-app-pub-XXXXXXXXXXXXX/YYYYYYYYYY',
    // });
  }

  // Interstitial Reklam ID'leri
  getInterstitialAdUnitId() {
    return TestIds?.INTERSTITIAL || null;
  }

  // Rewarded Reklam ID'leri
  getRewardedAdUnitId() {
    return TestIds?.REWARDED || null;
  }

  // Interstitial Reklam Yükle
  async loadInterstitialAd() {
    try {
      this.interstitialAd = InterstitialAd.createForAdRequest(
        this.getInterstitialAdUnitId()
      );

      // Reklam yükleme dinleyicileri
      const unsubscribe = this.interstitialAd.addAdEventListener(
        AdEventType.LOADED,
        () => {
          console.log('✅ Interstitial reklam yüklendi');
        }
      );

      await this.interstitialAd.load();
      return unsubscribe;
    } catch (error) {
      console.error('❌ Interstitial reklam yükleme hatası:', error);
      return null;
    }
  }

  // Interstitial Reklam Göster
  async showInterstitialAd() {
    if (!this.interstitialAd) {
      await this.loadInterstitialAd();
    }

    if (this.interstitialAd) {
      this.interstitialAd.show();
    }
  }

  // Rewarded Reklam Yükle
  async loadRewardedAd() {
    try {
      this.rewardedAd = RewardedAd.createForAdRequest(
        this.getRewardedAdUnitId()
      );

      // Ödül dinleyicisi
      const unsubscribeLoaded = this.rewardedAd.addAdEventListener(
        RewardedAdEventType.LOADED,
        () => {
          console.log('✅ Rewarded reklam yüklendi');
        }
      );

      const unsubscribeEarned = this.rewardedAd.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        (reward) => {
          console.log('🎁 Ödül kazanıldı:', reward);
        }
      );

      await this.rewardedAd.load();
      
      return () => {
        unsubscribeLoaded();
        unsubscribeEarned();
      };
    } catch (error) {
      console.error('❌ Rewarded reklam yükleme hatası:', error);
      return null;
    }
  }

  // Rewarded Reklam Göster
  async showRewardedAd(onRewarded) {
    if (!this.rewardedAd) {
      await this.loadRewardedAd();
    }

    if (this.rewardedAd) {
      const unsubscribe = this.rewardedAd.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        (reward) => {
          if (onRewarded) {
            onRewarded(reward);
          }
        }
      );

      this.rewardedAd.show();
      return unsubscribe;
    }
  }
}

// Singleton instance
export const adMobService = new AdMobService();

// Export edilen bileşenler ve sabitler (Expo Go için null olabilir)
export { BannerAd, BannerAdSize, TestIds, mobileAds };

