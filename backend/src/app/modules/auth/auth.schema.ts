import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import config from "../../config/env.config.js";

export interface IAuth extends Document {
	email: string;
	password: string;
	name: string;
	emailVerified: boolean;
	isBanned: boolean;
	role: "user" | "admin";
	createdAt: Date;
	updatedAt: Date;
	comparePassword(candidatePassword: string): Promise<boolean>;
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
		emailVerified: {
			type: Boolean,
			default: false,
		},
		isBanned: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true },
);

authSchema.pre<IAuth>("save", async function () {
	if (!this.isModified("password")) return;
	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
	} catch (error) {
		if (config.nodeEnv === "development") {
			console.error("Error hashing password:", error);
		}
		throw new Error("Password hashing failed");
	}
});

authSchema.methods.comparePassword = async function (
	candidatePassword: string,
): Promise<boolean> {
	try {
		return await bcrypt.compare(candidatePassword, this.password);
	} catch (error) {
		if (config.nodeEnv === "development") {
			console.error("Error comparing password:", error);
		}
		throw new Error("Password comparison failed");
	}
};

const AuthModel = mongoose.model<IAuth>("Auth", authSchema);
export default AuthModel;
