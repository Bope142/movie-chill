export const EMAIL_SENDER = '"MOVIE CHILL" <noreply@moviechill.com>';

export const redirects = {
  toLogin: "/login",
  toSignup: "/signup",
  afterLogin: "/dashboard",
  afterLogout: "/",
  toVerify: "/verify-email",
  afterVerify: "/dashboard",
} as const;
