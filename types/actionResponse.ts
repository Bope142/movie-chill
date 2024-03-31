export interface ActionResponseSignup {
  redirectTo?: string;
  formError?: string;
}

export interface ResendVerificationCodeResponse {
  error?: string;
  success?: boolean;
}
