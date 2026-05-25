import mongoose from "mongoose";

export interface IIncome extends mongoose.Document {
	_id: mongoose.Types.ObjectId;
	userId: string;
	amount: number;
	mode: "cash" | "card" | "UPI" | "bank_transfer" | "other";
	from: string;
	description?: string;
	date: Date;
}

const incomeSchema = new mongoose.Schema(
	{
		userId: { type: String, required: true },
		amount: { type: Number, required: true },
		mode: {
			type: String,
			enum: ["cash", "card", "UPI", "bank_transfer", "other"],
			required: true,
		},
		from: { type: String, required: true },
		description: { type: String },
		date: { type: Date, default: Date.now },
	},
	{ timestamps: true },
);

export const Income = mongoose.model("Income", incomeSchema);
