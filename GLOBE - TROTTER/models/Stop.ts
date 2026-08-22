import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStopActivity {
  _id?: mongoose.Types.ObjectId;
  activityId: mongoose.Types.ObjectId;
  scheduledTime?: string;
}

export interface IStop extends Document {
  _id: mongoose.Types.ObjectId;
  tripId: mongoose.Types.ObjectId;
  cityId: mongoose.Types.ObjectId;
  arriveDate: Date;
  leaveDate: Date;
  order: number;
  activities: IStopActivity[];
  createdAt: Date;
  updatedAt: Date;
}

const StopActivitySchema = new Schema<IStopActivity>(
  {
    activityId: {
      type: Schema.Types.ObjectId,
      ref: 'Activity',
      required: true,
    },
    scheduledTime: {
      type: String,
      default: null,
    },
  },
  { _id: true }
);

const StopSchema = new Schema<IStop>(
  {
    tripId: {
      type: Schema.Types.ObjectId,
      ref: 'Trip',
      required: [true, 'Trip ID is required'],
      index: true,
    },
    cityId: {
      type: Schema.Types.ObjectId,
      ref: 'City',
      required: [true, 'City ID is required'],
    },
    arriveDate: {
      type: Date,
      required: [true, 'Arrival date is required'],
    },
    leaveDate: {
      type: Date,
      required: [true, 'Leave date is required'],
    },
    order: {
      type: Number,
      required: [true, 'Order is required'],
      default: 0,
    },
    activities: [StopActivitySchema],
  },
  {
    timestamps: true,
  }
);

export const Stop: Model<IStop> =
  mongoose.models.Stop || mongoose.model<IStop>('Stop', StopSchema);
export default Stop;
