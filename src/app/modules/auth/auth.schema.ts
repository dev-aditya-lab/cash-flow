import mongoose, { Schema, Document } from "mongoose";

export interface IAuth extends Document {
	email: string;
	password: string;
	name: string;
	role: "user" | "admin";
	createdAt: Date;
	updatedAt: Date;
}

const authSchema = new Schema<IAuth>(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
			select: false,
		},
		name: {
			type: String,
			required: true,
			trim: true,
		},
		role: {
			type: String,
			enum: ["user", "admin"],
			default: "user",
		},
	},
	{ timestamps: true },
);

const AuthModel = mongoose.model<IAuth>("Auth", authSchema);
export default AuthModel;
