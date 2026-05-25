import api from "./api";
import type { Expense, AddExpensePayload, EditExpensePayload, ApiResponse } from "@/types";

export const expenseService = {
  async addExpense(payload: AddExpensePayload): Promise<ApiResponse<{ expance: Expense }>> {
    const { data } = await api.post<ApiResponse<{ expance: Expense }>>("/expance/add", payload);
    return data;
  },

  async getExpenses(): Promise<ApiResponse<Expense[]>> {
    const { data } = await api.get<ApiResponse<Expense[]>>("/expance/");
    return data;
  },

  async deleteExpense(id: string): Promise<ApiResponse<{ expance: Expense }>> {
    const { data } = await api.delete<ApiResponse<{ expance: Expense }>>(`/expance/delete/${id}`);
    return data;
  },

  async editExpense(
    id: string,
    payload: EditExpensePayload
  ): Promise<ApiResponse<{ expance: Expense }>> {
    const { data } = await api.put<ApiResponse<{ expance: Expense }>>(`/expance/edit/${id}`, payload);
    return data;
  },
};
