# Firestore Security Rules - Anonymous Authentication

Firebase Console > Firestore Database > Rules sekmesine gidin ve şu kuralları yapıştırın:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /todos/{userId} {
      // Anonim kullanıcılar sadece kendi verilerine erişebilir
      // request.auth.uid, Firebase Authentication tarafından oluşturulan kullanıcı ID'sidir
      // userId, Firestore doküman ID'sidir (her kullanıcı için benzersiz)
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Kuralların Açıklaması

1. **`request.auth != null`**: Kullanıcının authenticated (giriş yapmış) olması gerekir
2. **`request.auth.uid == userId`**: Kullanıcı sadece kendi dokümanına (userId ile eşleşen) erişebilir
3. **`allow read, write`**: Okuma ve yazma izinleri verilir

## Önemli Notlar

- Bu kurallar Anonymous authentication ile çalışır
- Her kullanıcı sadece kendi `userId`'si ile eşleşen dokümana erişebilir
- Farklı kullanıcılar birbirinin verilerini göremez veya değiştiremez
- Test modundaki geçici kuralı (2026 tarihli) mutlaka değiştirin

## Kuralları Test Etme

1. "Develop & Test" butonuna tıklayın
2. Simülatörde test senaryoları çalıştırın
3. Kuralları yayınlamadan önce test edin

