import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IExpense extends Document {
  _id: mongoose.Types.ObjectId;
  tripId: mongoose.Types.ObjectId;
  stopId?: mongoose.Types.ObjectId;
  paidBy: string;
  amount: number;
  description: string;
  category: 'flights' | 'accommodation' | 'activities' | 'transport' | 'food' | 'other';
  splitAmong: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema = new Schema<IExpense>(
  {
    tripId: {
      type: Schema.Types.ObjectId,
      ref: 'Trip',
      required: [true, 'Trip ID is required'],
      index: true,
    },
    stopId: {
      type: Schema.Types.ObjectId,
      ref: 'Stop',
      default: null,
    },
    paidBy: {
      type: String,
      default: 'Me',
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: 0,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      enum: ['flights', 'accommodation', 'activities', 'transport', 'food', 'other'],
      default: 'activities',
    },
    splitAmong: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Expense: Model<IExpense> =
  mongoose.models.Expense || mongoose.model<IExpense>('Expense', ExpenseSchema);
export default Expense;
