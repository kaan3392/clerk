const tr = {
  onboarding: {
    page1: {
      title: "Social Auth'a Hoş Geldiniz",
      description:
        "Topluluğumuza katılın ve dünya çapında arkadaşlarınızla bağlantı kurun. Başlamak için kaydolun veya giriş yapın!",
    },
    page2: {
      title: "Keşfet",
      description:
        "Yeni toplulukları keşfedin ve ilgi alanlarınızı paylaşan insanlarla bağlantı kurun.",
    },
    page3: {
      title: "Başlayın",
      description:
        "Hesabınızı oluşturun ve Social Auth dünyasını keşfetmeye başlayın.",
    },
    skip: "Atla",
    next: "Sonraki",
    getStarted: "Başlayın",
  },
  login: {
    title: "Giriş Yap",
    emailPlaceholder: "E-posta",
    passwordPlaceholder: "Parola",
    signInButton: "Giriş Yap",
    noAccount: "Hesabınız yok mu? Kayıt olun",
    forgotPassword: "Parolanızı mı unuttunuz?(Sadece e-posta hesapları için)",
  },
  register: {
    title: "Hesap Oluştur",
    emailPlaceholder: "E-posta",
    passwordPlaceholder: "Parola",
    signUpButton: "Kayıt Ol",
    haveAccount: "Zaten bir hesabınız var mı? Giriş yap",
  },
  home: {
    welcome: "Hoş Geldiniz",
    logout: "Çıkış Yap",
    hello: "Merhaba {{email}}",
  },
  profile: {
    title: "Profil",
    nameLabel: "Ad",
    nameLabelPlaceholder: "Adınızı girin",
    emailLabel: "E-posta",
    updateButton: "Güncelle",
    change: "Değiştir",
    phoneLabel: "Telefon Numarası",
    phonePlaceholder: "05XX XXX XX XX",
    verify: "Doğrula",
    languageLabel: "Dil Seçin",
    verifyButton: "Doğrula",
    themeLabel: "Tema Seçin",
    lightMode: "Açık Tema",
    darkMode: "Koyu Tema",
  },
  sessions: {
    title: "Aktif Oturumlar",
    revokeButton: "Oturumu Kaldır",
    revokeSuccess: "Oturum başarıyla kaldırıldı.",
    revokeError: "Oturum kaldırma başarısız oldu.",
    currentSession: "Bu sizin mevcut oturumunuz",
  },
};

export default tr;
export type TranslationKeys = keyof typeof tr;
