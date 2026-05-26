import api from "./api";
import type { ApiResponse } from "@/types";

export interface FeedbackPayload {
  message: string;
  rating:  number; // 1–5
}

export const feedbackService = {
  async submit(payload: FeedbackPayload): Promise<ApiResponse> {
    const { data } = await api.post<ApiResponse>("/feedback/get", payload);
    return data;
  },
};
