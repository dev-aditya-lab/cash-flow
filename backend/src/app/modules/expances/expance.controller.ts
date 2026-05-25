import type { Request, Response } from "express";
import sendError from "../../core/response/error.response.js";
import sendRes from "../../core/response/sucess.response.js";
import { Expance } from "./expance.model.js";
import { Types } from "mongoose";


/**
 * @controller addExpance
 * @description Add a new expance for the authenticated user
 * @body { amount: number, mode: string, to: string, resion: string, description?: string, date?: Date }
 * @returns { message: string, expance: object }
 */
export const addExpance = async (req: Request, res: Response) => {
	try {
		const { amount, mode, to, resion, description, date } = req.body;
		const { userId } = (req as Request & { user?: unknown }).user as {
			userId: string;
		};
		if (!userId) {
			sendError(res, 401, "Unauthorized", null);
			return;
		}
		if (!amount || !mode || !to || !resion) {
			sendError(res, 400, "All fields are required", null);
			return;
		}
		const expance = await Expance.create({
			userId,
			amount,
			mode,
			to,
			resion,
			description,
			date: date || new Date(),
		});
		sendRes(res, 201, "Expance added successfully", expance);
	} catch (error) {
		sendError(res, 500, "Failed to add expance", error);
	}
};

/**
 * @controller getExpances
 * @description Get all expances for the authenticated user
 * @returns { message: string, expances: array }
 */
export const getExpances = async (req: Request, res: Response) => {
    try {
        const { userId } = (req as Request & { user?: unknown }).user as {
            userId: string;
        };
        if (!userId) {
            sendError(res, 401, "Unauthorized", null);
            return;
        }
        const expances = await Expance.find({ userId });
        sendRes(res, 200, "Expances retrieved successfully", expances);
    } catch (error) {
        sendError(res, 500, "Failed to retrieve expances", error);
    }
};

/**
 * @controller deleteExpance
 * @description Delete an expance for the authenticated user
 * @param {string} expanceId - The ID of the expance to delete
 * @returns { message: string, expance: object }
 */
export const deleteExpance = async (req: Request, res: Response) => {
    try {
        const { userId } = (req as Request & { user?: unknown }).user as {
            userId: string;
        };
        if (!userId) {
            sendError(res, 401, "Unauthorized", null);
            return;
        }
        const { expanceId } = req.params;
        const id = Array.isArray(expanceId) ? expanceId[0] : expanceId;
        if (!id || !Types.ObjectId.isValid(id)) {
            sendError(res, 400, "Invalid expance id", null);
            return;
        }
        if (!Types.ObjectId.isValid(userId)) {
            sendError(res, 400, "Invalid user id", null);
            return;
        }
        const filter = { _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) };
        const expance = await Expance.findOneAndDelete(filter);
        if (!expance) {
            sendError(res, 404, "Expance not found", null);
            return;
        }   
        sendRes(res, 200, "Expance deleted successfully", expance);
    } catch (error) {
        sendError(res, 500, "Failed to delete expance", error);
    }
};

/**
 * @controller updateExpance
 * @description Update an expance for the authenticated user
 * @param {string} expanceId - The ID of the expance to update
 * @body { amount: number, mode: string, to: string, resion: string, description?: string, date?: Date }
 * @returns { message: string, expance: object }
 */
export const updateExpance = async (req: Request, res: Response) => {
    try {
        const { userId } = (req as Request & { user?: unknown }).user as {
            userId: string;
        };
        if (!userId) {
            sendError(res, 401, "Unauthorized", null);
            return;
        }
        const { expanceId } = req.params;
        const { amount, mode, to, resion, description, date } = req.body;
        const id = Array.isArray(expanceId) ? expanceId[0] : expanceId;
        if (!id || !Types.ObjectId.isValid(id)) {
            sendError(res, 400, "Invalid expance id", null);
            return;
        }
        if (!Types.ObjectId.isValid(userId)) {
            sendError(res, 400, "Invalid user id", null);
            return;
        }
        const filter = { _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) };
        const expance = await Expance.findOneAndUpdate(
            filter,
            { amount, mode, to, resion, description, date },
            { new: true }
        );
        if (!expance) {
            sendError(res, 404, "Expance not found", null);
            return;
        }
        sendRes(res, 200, "Expance updated successfully", expance);
    } catch (error) {
        sendError(res, 500, "Failed to update expance", error);
    }
};
