import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IActivity extends Document {
  _id: mongoose.Types.ObjectId;
  cityId: mongoose.Types.ObjectId;
  name: string;
  cost: number;
  duration: number; // in minutes
  category: 'sightseeing' | 'food' | 'adventure' | 'culture' | 'relaxation';
  description?: string;
  imageUrl?: string;
  includes?: string[];
  bestTime?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ActivitySchema = new Schema<IActivity>(
  {
    cityId: {
      type: Schema.Types.ObjectId,
      ref: 'City',
      required: [true, 'City ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Activity name is required'],
      trim: true,
    },
    cost: {
      type: Number,
      required: [true, 'Cost is required'],
      default: 0,
    },
    duration: {
      type: Number,
      default: 120, // 2 hours
    },
    category: {
      type: String,
      enum: ['sightseeing', 'food', 'adventure', 'culture', 'relaxation'],
      default: 'sightseeing',
    },
    description: {
      type: String,
      default: '',
    },
    imageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80',
    },
    includes: {
      type: [String],
      default: [],
    },
    bestTime: {
      type: String,
      default: 'Morning',
    },
  },
  {
    timestamps: true,
  }
);

export const Activity: Model<IActivity> =
  mongoose.models.Activity || mongoose.model<IActivity>('Activity', ActivitySchema);
export default Activity;
