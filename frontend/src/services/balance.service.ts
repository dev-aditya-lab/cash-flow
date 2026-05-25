import api from "./api";
import type { Balance, ApiResponse } from "@/types";

export const balanceService = {
  async getBalance(): Promise<ApiResponse<Balance>> {
    const { data } = await api.get<ApiResponse<Balance>>("/balance/");
    return data;
  },
};
