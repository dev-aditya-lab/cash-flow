import type { Request, Response } from "express";
import sendRes from "../../core/response/sucess.response.js";
import sendError from "../../core/response/error.response.js";
import { Income } from "../income/income.model.js";
import { Expance } from "../expances/expance.model.js";
import { Types } from "mongoose";

export const getBalance = async (req: Request, res: Response) => {
    try{
        const { userId } = (req as Request & { user?: unknown }).user as {
                    userId: string;
                };
        if (!userId) {
            sendError(res, 401, "Unauthorized", null);
            return;
        }
        // Fetch balance for the user from the database 
        const totalExpances = await Expance.aggregate([
            { $match: { userId: new Types.ObjectId(userId) } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const totalIncome = await Income.aggregate([
            { $match: { userId: new Types.ObjectId(userId) } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const balance = (totalIncome[0]?.total || 0) - (totalExpances[0]?.total || 0);
        sendRes(res, 200, "Balance fetched successfully", { balance });
    } catch (error) {
        sendError(res, 500, "Error fetching balance", null);
    }
}