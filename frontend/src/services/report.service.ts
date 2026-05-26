import api from "./api";
import type { ApiResponse } from "@/types";

export type ReportType = "bug" | "feature" | "suggestion" | "other";

export interface ReportPayload {
  message: string;
  type:    ReportType;
}

export const reportService = {
  async submit(payload: ReportPayload): Promise<ApiResponse> {
    const { data } = await api.post<ApiResponse>("/report/get", payload);
    return data;
  },
};
