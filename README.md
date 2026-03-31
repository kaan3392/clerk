# Social Auth

Clerk tabanlı kimlik doğrulama altyapısı kullanan, Expo (React Native) ile geliştirilmiş mobil uygulama. E-posta/şifre, Google ve Facebook OAuth yöntemleriyle kullanıcı kayıt ve giriş işlemlerini destekler.

## ✨ Özellikler

- **Kimlik Doğrulama** — Clerk üzerinden e-posta/şifre, Google OAuth ve Facebook OAuth ile giriş & kayıt
- **E-posta Doğrulama** — Kayıt sonrası tek kullanımlık kod ile e-posta doğrulama
- **Şifremi Unuttum** — E-posta hesapları için şifre sıfırlama akışı
- **Onboarding** — Yeni kullanıcılar için animasyonlu tanıtım ekranları
- **Profil Yönetimi** — Profil fotoğrafı, kullanıcı adı ve diğer bilgilerin düzenlenmesi
- **Aktif Oturumlar** — Tüm aktif oturumların görüntülenmesi ve yönetimi
- **Çoklu Dil Desteği (i18n)** — Türkçe ve İngilizce dil seçenekleri
- **Platform Özel Tasarım** — iOS ve Android için ayrı tab bar layout'ları
- **Güvenli Token Saklama** — `expo-secure-store` ile güvenli token yönetimi

## 🛠️ Teknoloji Stack

| Kategori         | Teknoloji                                                                       |
| ---------------- | ------------------------------------------------------------------------------- |
| Framework        | [Expo](https://expo.dev) v55 (React Native)                                     |
| Kimlik Doğrulama | [Clerk](https://clerk.com) (`@clerk/clerk-expo`)                                |
| Navigasyon       | [Expo Router](https://docs.expo.dev/router/introduction/) (file-based routing)  |
| Form Yönetimi    | [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev)         |
| State/Cache      | [TanStack Query](https://tanstack.com/query)                                    |
| Çoklu Dil        | [i18next](https://www.i18next.com) + [react-i18next](https://react.i18next.com) |
| Dil              | TypeScript                                                                      |

## 📁 Proje Yapısı

```
social-auth/
├── app/
│   ├── _layout.tsx            # Root layout (Clerk & Query providers)
│   ├── index.tsx              # Giriş noktası / yönlendirme
│   ├── onboarding.tsx         # Onboarding ekranları
│   ├── (auth)/                # Kimlik doğrulama ekranları
│   │   ├── login.tsx          # Giriş ekranı
│   │   ├── register.tsx       # Kayıt ekranı
│   │   ├── verify.tsx         # E-posta doğrulama
│   │   └── forgot-password.tsx # Şifre sıfırlama
│   └── (tabs)/                # Ana uygulama sekmeleri
│       ├── index.tsx          # Ana sayfa
│       ├── profile.tsx        # Profil yönetimi
│       └── active-sessions.tsx # Aktif oturumlar
├── components/                # Paylaşılan bileşenler
│   ├── customButton.tsx
│   ├── customInput.tsx
│   ├── signInWith.tsx         # OAuth butonları
│   ├── verificationModal.tsx
│   ├── langModal.tsx          # Dil seçim modalı
│   └── ...
├── i18n/
│   └── locales/
│       ├── en.ts              # İngilizce çeviriler
│       └── tr.ts              # Türkçe çeviriler
└── assets/                    # Görseller ve ikonlar
```

## 🚀 Başlangıç

### Gereksinimler

- [Node.js](https://nodejs.org) (LTS)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- iOS için Xcode / Android için Android Studio
- [Clerk](https://clerk.com) hesabı ve API anahtarı

### Kurulum

1. **Depoyu klonlayın:**

   ```bash
   git clone <repo-url>
   cd social-auth
   ```

2. **Bağımlılıkları yükleyin:**

   ```bash
   npm install
   ```

3. **Ortam değişkenlerini ayarlayın:**

   Proje kök dizininde `.env` dosyası oluşturun:

   ```env
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   ```

   > Clerk Dashboard → API Keys bölümünden **Publishable Key** değerini alabilirsiniz.

4. **Clerk Dashboard Ayarları:**
   - Google OAuth ve Facebook OAuth provider'larını aktif edin
   - E-posta doğrulama stratejisini `email_code` olarak ayarlayın
   - Redirect URL'leri yapılandırın (`socialauth://` scheme)

### Çalıştırma

```bash
# Expo dev server başlat
npm start

# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## 📄 Lisans

Bu proje özel kullanım içindir.
