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
};

export default en;
export type TranslationKeys = keyof typeof en;
