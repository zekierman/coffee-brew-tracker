# 📋 Coffee Brew Tracker - Proje Yol Haritası (Roadmap)

Bu dosya, Coffee Brew Tracker uygulamasının 10 haftalık geliştirme sürecini ve ilk sürüm (MVP) kapsamını takip etmek amacıyla oluşturulmuştur.

---

## 🎯 Proje Hedefi & Çözülen Problem
* **Neden bu uygulamayı yapıyorum?:** Kahve demleme süreçlerimi kayıt altında tutmak, her demlemeden sonra tadım notları ve puanlama ekleyerek ideal kahve lezzetine ulaşmak için geriye dönük analizler yapabilmek.
* **İlk sürümde hangi problemi çözecek?:** Dağınık tutulan kahve tariflerini ve demleme geçmişini tek bir yerel veri tabanında (SQLite) düzenli bir şekilde toplayacak.

---

## 📋 v1 MVP (Minimum Uygulanabilir Ürün) Kapsamı
Uygulamanın ilk sürümünde yer alacak temel özellikler:
- [ ] **Reçete Yönetimi:** Reçete ekleme, listeleme, detayını görme ve silme.
- [ ] **Demleme Kaydı (Brew Session):** Demleme kaydı oluşturma ve puanlama.
- [ ] **Demleme Geçmişi (Brew History):** Geçmiş demlemeleri ve tadım notlarını geriye dönük inceleme.
- [ ] **Yerel Veri Tabanı:** SQLite ile verilerin telefonda kalıcı olarak tutulması.
- [ ] **Temel İstatistikler:** Ortalama puanlama, en çok kullanılan yöntem gibi temel analizleri gösterme.

---

## ❌ v1 Kapsam Dışı (Out of Scope) Özellikler
İlk sürümün gecikmesini önlemek adına aşağıdaki özellikler v1 sürümünde yer almayacaktır:
- AI Önerileri (Yapay zeka desteği)
- Kullanıcı Girişi / Kayıt Olma (Login/Auth)
- Cloud Sync (Bulut veri tabanı eşitlemesi / Supabase)

---

## 🗺️ 10 Haftalık Geliştirme Haritası

### 🟢 Faz 1: Temel Mantık ve Veri Modelleme
- **Hafta 1: JavaScript Temelleri** -> Kahve verisini işleyebilme, Array, Object, map/filter/reduce ve async mantığı.
- **Hafta 2: TypeScript ile Güvenli Veri Modeli** -> Recipe ve BrewLog modelleri, doğrulama (validation) fonksiyonları.

### 🔵 Faz 2: Arayüz Tasarımı ve Prototipleme
- **Hafta 3: React Mantığı** -> Component, props, state, form ve liste yapısı.
- **Hafta 4: Expo + Mobil UI** -> Projeyi ayağa kaldırma, mock veriler, RecipeCard ve tema kurulumu.
- **Hafta 5: Navigation + Formlar** -> Expo Router ile ekranlar arası geçiş, yeni reçete ve demleme kayıt formları.

### 🟤 Faz 3: Kalıcılık ve Çekirdek Özellikler
- **Hafta 6: SQLite ile Kalıcı Veri** -> Tablo ilişkileri, CRUD işlemleri.
- **Hafta 7: Brew Session & Timer** -> Saniye sayan zamanlayıcı, adım adım demleme akışı, tadım notları ve puanlama.

### 🟡 Faz 4: UX, Kalite ve Portfolyo Hazırlığı
- **Hafta 8: İstatistik + UX** -> Arama, filtreleme, favorilere ekleme, yükleniyor/hata/boş ekran durumları.
- **Hafta 9: Kalite + Portfolyo** -> Kod refaktörü, profesyonel README, ekran görüntüleri ve demo hazırlığı.
- **Hafta 10: İleri Seviye (Opsiyonel)** -> Veri aktarımı (Export), Supabase ve EAS Build süreçlerini planlama.

---

## 🛠️ Gün 1 Kontrol Listesi
- [x] GitHub reposu public olarak açıldı.
- [x] README.md dosyası oluşturuldu ve proje amacı yazıldı.
- [x] 5 temel ekran taslağı (Ana Sayfa, Reçeteler, Reçete Detayı, Yeni Reçete, Brew History) çizildi.