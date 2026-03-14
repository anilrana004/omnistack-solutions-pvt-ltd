import mongoose, { Schema, model, models } from "mongoose";

export interface IFeedback {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  rating: number;
  message: string;
  createdAt: Date;
  role?: string;
  company?: string;
}

const FeedbackSchema = new Schema<IFeedback>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    message: { type: String, required: true, trim: true },
    role: { type: String, trim: true },
    company: { type: String, trim: true },
  },
  { timestamps: true }
);

FeedbackSchema.index({ createdAt: -1 });

export const Feedback = models.Feedback ?? model<IFeedback>("Feedback", FeedbackSchema);
