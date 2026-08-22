import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISharedTrip extends Document {
  _id: mongoose.Types.ObjectId;
  tripId: mongoose.Types.ObjectId;
  isPublic: boolean;
  shareSlug: string;
  createdAt: Date;
  updatedAt: Date;
}

const SharedTripSchema = new Schema<ISharedTrip>(
  {
    tripId: {
      type: Schema.Types.ObjectId,
      ref: 'Trip',
      required: [true, 'Trip ID is required'],
      unique: true,
      index: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    shareSlug: {
      type: String,
      required: [true, 'Share slug is required'],
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const SharedTrip: Model<ISharedTrip> =
  mongoose.models.SharedTrip || mongoose.model<ISharedTrip>('SharedTrip', SharedTripSchema);
export default SharedTrip;
