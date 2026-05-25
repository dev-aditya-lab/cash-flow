import api from "./api";
import type { Income, AddIncomePayload, EditIncomePayload, ApiResponse } from "@/types";

export const incomeService = {
  async addIncome(payload: AddIncomePayload): Promise<ApiResponse<{ income: Income }>> {
    const { data } = await api.post<ApiResponse<{ income: Income }>>("/income/add", payload);
    return data;
  },

  async getIncomes(): Promise<ApiResponse<Income[]>> {
    const { data } = await api.get<ApiResponse<Income[]>>("/income/");
    return data;
  },

  async editIncome(
    id: string,
    payload: EditIncomePayload
  ): Promise<ApiResponse<{ income: Income }>> {
    const { data } = await api.put<ApiResponse<{ income: Income }>>(`/income/edit/${id}`, payload);
    return data;
  },

  async deleteIncome(id: string): Promise<ApiResponse<{ income: Income }>> {
    const { data } = await api.delete<ApiResponse<{ income: Income }>>(`/income/delete/${id}`);
    return data;
  },
};
