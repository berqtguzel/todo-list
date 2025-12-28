# Firebase Kurulum Rehberi

To-do list uygulamanızın farklı bilgisayarlarda senkronize çalışması için Firebase Firestore kurulumu gereklidir.

## Adım 1: Firebase Projesi Oluşturma

1. [Firebase Console](https://console.firebase.google.com/) adresine gidin
2. "Add project" (Proje Ekle) butonuna tıklayın
3. Proje adını girin (örn: "todo-list-app")
4. Google Analytics'i isteğe bağlı olarak etkinleştirebilirsiniz
5. "Create project" (Proje Oluştur) butonuna tıklayın

## Adım 2: Firestore Database Oluşturma

1. Firebase Console'da sol menüden "Firestore Database" seçin
2. "Create database" (Veritabanı Oluştur) butonuna tıklayın
3. "Start in test mode" (Test modunda başlat) seçeneğini seçin
4. Veritabanı konumunu seçin (örn: europe-west1)
5. "Enable" (Etkinleştir) butonuna tıklayın

## Adım 3: Authentication Ayarları

1. Sol menüden "Authentication" seçin
2. "Get started" (Başlayın) butonuna tıklayın
3. "Anonymous" (Anonim) seçeneğini etkinleştirin
4. "Enable" (Etkinleştir) butonuna tıklayın

## Adım 4: Web App Ekleme

1. Firebase Console'da proje ayarlarına gidin (⚙️ ikonu)
2. "Project settings" (Proje ayarları) seçin
3. Aşağı kaydırın ve "Your apps" (Uygulamalarınız) bölümüne gidin
4. Web ikonu (</>) seçin
5. App nickname girin (örn: "Todo List Web")
6. "Register app" (Uygulamayı kaydet) butonuna tıklayın
7. Config bilgilerini kopyalayın (apiKey, authDomain, vb.)

## Adım 5: Environment Variables Ayarlama

1. Proje kök dizininde `.env` dosyası oluşturun
2. `.env.example` dosyasındaki şablonu kopyalayın
3. Firebase Console'dan aldığınız değerleri girin:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

## Adım 6: Firestore Güvenlik Kuralları

Firebase Console > Firestore Database > Rules sekmesine gidin ve şu kuralları ekleyin:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /todos/{userId} {
      // Kullanıcı sadece kendi verilerine erişebilir
      allow read, write: if request.auth != null && request.auth.uid == userId;
      // Anonim kullanıcılar için
      allow read, write: if request.auth != null;
    }
  }
}
```

## Adım 7: Uygulamayı Çalıştırma

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. Uygulamayı başlatın:
```bash
npm run dev
```

## Önemli Notlar

- Firebase'in ücretsiz planı (Spark Plan) yeterli olacaktır
- Veriler otomatik olarak tüm cihazlarda senkronize olur
- İnternet bağlantısı gereklidir
- İnternet yoksa, veriler localStorage'a kaydedilir ve bağlantı kurulduğunda senkronize edilir

## Sorun Giderme

- Eğer Firebase bağlantısı kurulamazsa, uygulama otomatik olarak localStorage kullanmaya devam eder
- Console'da hata mesajlarını kontrol edin
- Firebase Console'da "Usage" sekmesinden kullanım istatistiklerini görebilirsiniz

