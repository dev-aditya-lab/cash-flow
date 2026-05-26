import api from "./api";
import type { ApiResponse } from "@/types";

// ── Types ─────────────────────────────────────────────────

export interface AdminStats {
  users:       number;
  feedback:    number;
  reports:     number;
  openReports: number;
}

export interface AdminUser {
  _id:           string;
  name:          string;
  email:         string;
  role:          "user" | "admin";
  emailVerified: boolean;
  isBanned:      boolean;
  createdAt:     string;
  updatedAt:     string;
}

export interface AdminFeedback {
  _id:       string;
  user:      { _id: string; name: string; email: string } | null;
  message:   string;
  rating:    number;
  createdAt: string;
}

export interface AdminReport {
  _id:       string;
  user:      { _id: string; name: string; email: string } | null;
  type:      "bug" | "feature" | "suggestion" | "other";
  status:    "open" | "resolved";
  message:   string;
  createdAt: string;
}

export type UpdateUserPayload = {
  role?:     "user" | "admin";
  isBanned?: boolean;
};

// ── Service ───────────────────────────────────────────────

export const adminService = {

  // Overview
  async getStats(): Promise<AdminStats> {
    const { data } = await api.get<ApiResponse<AdminStats>>("/admin/stats");
    return data.data!;
  },

  // Users
  async getUsers(): Promise<AdminUser[]> {
    const { data } = await api.get<ApiResponse<AdminUser[]>>("/admin/users");
    return data.data!;
  },
  async updateUser(id: string, payload: UpdateUserPayload): Promise<AdminUser> {
    const { data } = await api.patch<ApiResponse<AdminUser>>(`/admin/users/${id}`, payload);
    return data.data!;
  },

  // Feedback
  async getFeedback(): Promise<AdminFeedback[]> {
    const { data } = await api.get<ApiResponse<AdminFeedback[]>>("/admin/feedback");
    return data.data!;
  },
  async deleteFeedback(id: string): Promise<void> {
    await api.delete(`/admin/feedback/${id}`);
  },

  // Reports
  async getReports(): Promise<AdminReport[]> {
    const { data } = await api.get<ApiResponse<AdminReport[]>>("/admin/reports");
    return data.data!;
  },
  async updateReport(id: string, status: "open" | "resolved"): Promise<AdminReport> {
    const { data } = await api.patch<ApiResponse<AdminReport>>(`/admin/reports/${id}`, { status });
    return data.data!;
  },
  async deleteReport(id: string): Promise<void> {
    await api.delete(`/admin/reports/${id}`);
  },
};
