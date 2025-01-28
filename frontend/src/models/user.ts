import { Schema, model, models } from "mongoose";
import { v4 } from "uuid";

interface IUser {
  id: string;
  email: string;
  password: string;
  stripeCustomerId?: string;
  subscriptionStatus: "active" | "inactive" | "canceled";
  subscriptionPlan: "starter" | "premium" | "trial";
  subscriptionPeriodEnd: Date;
  numberOfGeneratedIdeas: number;
}

const userSchema = new Schema<IUser>(
  {
    id: { type: String, default: v4 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    stripeCustomerId: { type: String, default: null },
    subscriptionStatus: { type: String, default: "active" },
    subscriptionPlan: { type: String, default: "trial" },
    subscriptionPeriodEnd: { type: Date, default: null },
    numberOfGeneratedIdeas: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const User = models.User || model<IUser>("User", userSchema);
