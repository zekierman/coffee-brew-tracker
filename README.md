# ☕ Coffee Brew Tracker

Coffee Brew Tracker, kahve demleme süreçlerini (yöntem, oran, süre) kayıt altında tutmak, her demlemeden sonra tadım notları ekleyerek ideal kahve lezzetine ulaşmak için geliştirilen React Native / Expo tabanlı bir mobil uygulamadır.

Bu proje, 10 haftalık detaylı bir günlük plana sadık kalınarak adım adım inşa edilmektedir.

---

## 🎯 Projenin Amacı & Çözdüğü Problem
Kağıt kalemle veya dağınık not uygulamalarında tutulan kahve tariflerini ve demleme geçmişini tek bir yerel veri tabanında (SQLite) düzenli bir şekilde toplar. Kullanıcının geçmiş demlemelerini analiz ederek daha tutarlı ve lezzetli kahveler yapmasına yardımcı olur.

---

## 🛠️ Teknoloji Yığını (Tech Stack)
- **Framework:** React Native + Expo (Expo Router ile dosya tabanlı navigasyon)
- **Dil:** TypeScript
- **Veri Tabanı:** SQLite (Yerel kalıcı veri)

---

## 📋 v1 MVP Özellikleri (İlk Sürüm Kapsamı)
Uygulamanın ilk aşamasında aşağıdaki çekirdek özellikler yer alacaktır:
- **Reçete Yönetimi (CRUD):** Reçete ekleme, listeleme, detay görüntüleme ve silme.
- **Brew Session & Zamanlayıcı:** Saniye sayan, durdurulabilen ve demleme adımlarını gösteren dinamik timer.
- **Tadım Notları & Puanlama:** Demleme sonrası kahvenin asidite, tatlılık, gövde gibi özelliklerini 1-5 arası puanlama.
- **Demleme Geçmişi (History):** Geçmiş demleme kayıtlarını yeniden eskiye doğru inceleyebilme.
- **Temel İstatistikler:** Ortalama puanlama ve en çok kullanılan demleme yönteminin analizi.

---

## ❌ v1 Kapsam Dışı Özellikler (Out of Scope)
İlk sürümün odağını bozmamak adına AI önerileri, kullanıcı girişi (Auth) ve bulut senkronizasyonu (Cloud Sync) bu sürümde yer almayacaktır.

---

## 📂 Proje Klasör Yapısı
Proje ilerledikçe kaynak kodlar aşağıdaki yapıda düzenlenecektir:
- `/src/types`: TypeScript tip tanımlamaları.
- `/src/utils`: Hesaplama ve istatistik helper fonksiyonları.
- `/src/components`: Yeniden kullanılabilir arayüz bileşenleri.
- `/src/db`: SQLite veri tabanı yönetim dosyaları.
- `/notes`: Günlük incelemeler ve öğrenme notları.