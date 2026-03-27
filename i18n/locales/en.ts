const en = {
  onboarding: {
    page1: {
      title: "Welcome to Social Auth",
      description:
        "Join our community and connect with friends around the world. Sign up or log in to get started!",
    },
    page2: {
      title: "Discover",
      description:
        "Explore new communities and connect with people who share your interests.",
    },
    page3: {
      title: "Get Started",
      description:
        "Create your account and start exploring the world of Social Auth.",
    },
    skip: "Skip",
    next: "Next",
    getStarted: "Get Started",
  },
  login: {
    title: "Sign in",
    emailPlaceholder: "Email",
    passwordPlaceholder: "Password",
    signInButton: "Sign in",
    noAccount: "Don't have an account? Sign up",
    forgotPassword: "Forgot password?(Only for email accounts)",
  },
  register: {
    title: "Create an account",
    emailPlaceholder: "Email",
    passwordPlaceholder: "Password",
    signUpButton: "Sign up",
    haveAccount: "Already have an account? Sign in",
  },
  home: {
    welcome: "Welcome",
    logout: "Logout",
    hello: "Hello {{email}}",
  },
  profile: {
    title: "Profile",
    nameLabel: "Name",
    nameLabelPlaceholder: "Enter your name",
    emailLabel: "Email",
    updateButton: "Update",
    change: "Change",
    phoneLabel: "Phone Number",
    phonePlaceholder: "05XX XXX XX XX",
    verify: "Verify",
    languageLabel: "Select Language",
    verifyButton: "Verify",
  },
  sessions: {
    title: "Active Sessions",
    revokeButton: "Revoke Session",
    revokeSuccess: "Session revoked successfully.",
    revokeError: "Failed to revoke session.",
    currentSession: "This is your current session",
  },
  layout: {
    home: "Home",
    profile: "Profile",
    sessions: "Sessions",
  },
};

export default en;
export type TranslationKeys = keyof typeof en;
