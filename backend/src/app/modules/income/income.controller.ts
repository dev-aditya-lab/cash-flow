import type { Request, Response } from "express";
import sendError from "../../core/response/error.response.js";
import sendRes from "../../core/response/sucess.response.js";
import { Income } from "./income.model.js";

/**
 * @controller addIncome
 * @description Add a new income for the authenticated user
 * @body { amount: number, mode: string, from: string, description?: string, date?: Date }
 * @returns { message: string, income: object }
 */
export const addIncome = async (req: Request, res: Response) => {
    try {
        const { amount, mode, from, description, date } = req.body;
        const { userId } = (req as Request & { user?: unknown }).user as {
            userId: string;
        };
        if (!userId) {
            sendError(res, 401, "Unauthorized", null);
            return;
        }
        if (!amount || !mode || !from) {
            sendError(res, 400, "All fields are required", null);
            return;
        }
        const income = await Income.create({
            userId,
            amount,
            mode,
            from,
            description,
            date: date || new Date(),
        });
        sendRes(res, 201, "Income added successfully", income);
    }
        catch (error) {
        sendError(res, 500, "Failed to add income", error);
        }
};

/**
 * @controller getIncomes
 * @description Retrieve all incomes for the authenticated user
 * @returns { message: string, incomes: object[] }
 */
export const getIncomes = async (req: Request, res: Response) => {
    try {
        const { userId } = (req as Request & { user?: unknown }).user as {
            userId: string;
        };
        if (!userId) {
            sendError(res, 401, "Unauthorized", null);
            return;
        }
        const incomes = await Income.find({ userId });
        sendRes(res, 200, "Incomes retrieved successfully", incomes);
    } catch (error) {
        sendError(res, 500, "Failed to retrieve incomes", error);
    }
};

/**
 * @controller deleteIncome
 * @description Delete an income for the authenticated user
 * @param {string} incomeId - The ID of the income to delete
 * @returns { message: string, income: object }
 */
export const deleteIncome = async (req: Request, res: Response) => {
    try {
        const { userId } = (req as Request & { user?: unknown }).user as {
            userId: string;
        };
        if (!userId) {
            sendError(res, 401, "Unauthorized", null);
            return;
        }
        const { incomeId } = req.params;
        const income = await Income.findOneAndDelete({ _id: incomeId, userId });
        if (!income) {
            sendError(res, 404, "Income not found", null);
            return;
        }
        sendRes(res, 200, "Income deleted successfully", income);
    } catch (error) {
        sendError(res, 500, "Failed to delete income", error);
        }
};

/**
 * @controller updateIncome
 * @description Update an income for the authenticated user
 * @param {string} incomeId - The ID of the income to update
 * @body { amount: number, mode: string, from: string, description?: string, date?: Date }
 * @returns { message: string, income: object }
 */
export const updateIncome = async (req: Request, res: Response) => {
    try {
        const { userId } = (req as Request & { user?: unknown }).user as {
            userId: string;
        };
        if (!userId) {
            sendError(res, 401, "Unauthorized", null);
            return;
        }
        const { incomeId } = req.params;
        const { amount, mode, from, description, date } = req.body;
        const income = await Income.findOneAndUpdate(
            { _id: incomeId, userId },
            { amount, mode, from, description, date },
            { returnDocument: "after" }
        );
        if (!income) {
            sendError(res, 404, "Income not found", null);
            return;
        }
        sendRes(res, 200, "Income updated successfully", income);
    } catch (error) {
        sendError(res, 500, "Failed to update income", error);
    }
};