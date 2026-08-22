import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITripMember {
  id: string;
  name: string;
  email?: string;
  color?: string;
}

export interface ITrip extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  name: string;
  startDate: Date;
  endDate: Date;
  description?: string;
  coverImageUrl?: string;
  budgetCap?: number;
  members?: ITripMember[];
  createdAt: Date;
  updatedAt: Date;
}

const TripSchema = new Schema<ITrip>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Trip name is required'],
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    coverImageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80',
    },
    budgetCap: {
      type: Number,
      default: null,
    },
    members: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        email: { type: String, default: null },
        color: { type: String, default: '#3B82F6' },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Trip: Model<ITrip> =
  mongoose.models.Trip || mongoose.model<ITrip>('Trip', TripSchema);
export default Trip;
