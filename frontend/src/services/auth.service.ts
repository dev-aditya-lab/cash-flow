import api from "./api";
import type {
  LoginPayload,
  RegisterPayload,
  OtpPayload,
  ChangePasswordPayload,
  AuthResponse,
  ApiResponse,
} from "@/types";

export const authService = {
  async register(payload: RegisterPayload): Promise<ApiResponse> {
    const { data } = await api.post<ApiResponse>("/auth/register", payload);
    return data;
  },

  async verifyEmail(token: string): Promise<ApiResponse> {
    const { data } = await api.get<ApiResponse>(`/auth/verify-email?token=${token}`);
    return data;
  },

  async resendVerificationEmail(email: string): Promise<ApiResponse> {
    const { data } = await api.post<ApiResponse>("/auth/resend-verification-email", { email });
    return data;
  },

  async verifyOtp(payload: OtpPayload): Promise<ApiResponse> {
    const { data } = await api.post<ApiResponse>("/auth/verify-otp", payload);
    return data;
  },

  /**
   * Login — backend sets `cash_flow_token` cookie on success.
   * Response body: { success, status, message, data: { data: User | null } }
   * User is only returned in development mode.
   */
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/auth/login", payload);
    return data;
  },

  async logout(): Promise<ApiResponse> {
    const { data } = await api.post<ApiResponse>("/auth/logout");
    return data;
  },

  async changePassword(payload: ChangePasswordPayload): Promise<ApiResponse> {
    const { data } = await api.post<ApiResponse>("/auth/change-password", payload);
    return data;
  },
};
