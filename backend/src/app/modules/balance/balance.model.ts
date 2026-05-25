import mongoose from "mongoose";

const balanceSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		amount: { type: Number, required: true },
		lastUpdated: { type: Date, default: Date.now },
		date: { type: Date, default: Date.now },
	},
	{ timestamps: true },
);

const Balance = mongoose.model("Balance", balanceSchema);
export default Balance;
