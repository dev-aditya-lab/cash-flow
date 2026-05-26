import mongoose from "mongoose";


export interface IReport {
    user: mongoose.Types.ObjectId;
    type: "bug" | "feature" | "suggestion" |"other";
    message: string;
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
        enum: ["bug", "feature", "suggestion", "other"]
    }
  },
  { timestamps: true }
);

const ReportModel = mongoose.model("Report", ReportSchema);
export default ReportModel;