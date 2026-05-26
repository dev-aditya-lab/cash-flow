import mongoose from "mongoose";


export interface IFeedback {
    user: mongoose.Types.ObjectId;
    message: string;
    rating: number;
}

const FeedbackSchema = new mongoose.Schema(
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
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
  },
  { timestamps: true }
);

const FeedbackModel = mongoose.model("Feedback", FeedbackSchema);
export default FeedbackModel;