import mongoose from "mongoose";

export interface IReport {
    user:    mongoose.Types.ObjectId;
    type:    "bug" | "feature" | "suggestion" | "other";
    message: string;
    status:  "open" | "resolved";
}

const ReportSchema = new mongoose.Schema(
  {
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auth",
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ["bug", "feature", "suggestion", "other"],
    },
    status: {
        type: String,
        enum: ["open", "resolved"],
        default: "open",
    },
  },
  { timestamps: true }
);

const ReportModel = mongoose.model("Report", ReportSchema);
export default ReportModel;
