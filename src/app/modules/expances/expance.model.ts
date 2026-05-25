import mongoose from "mongoose";

export interface IExpance extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    amount: number;
    mode: "cash" | "card" | "UPI" | "bank_transfer" | "other";
    to : string;
    resion : string;
    description: string;
    date: Date;
}

const expanceSchema = new mongoose.Schema<IExpance>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Auth", required: true },
    amount: { type: Number, required: true },
    mode: { type: String, enum: ["cash", "card", "UPI", "bank_transfer", "other"], required: true },
    to: { type: String, required: true },
    resion: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

export const Expance = mongoose.model<IExpance>("Expance", expanceSchema);
