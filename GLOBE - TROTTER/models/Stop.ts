import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStopActivity {
  _id?: mongoose.Types.ObjectId;
  activityId: mongoose.Types.ObjectId;
  scheduledTime?: string;
}

export interface ILodging {
  name?: string;
  checkIn?: string;
  checkOut?: string;
  confirmationCode?: string;
  address?: string;
}

export interface IReservation {
  _id?: mongoose.Types.ObjectId;
  type: string; // e.g. 'Restaurant', 'Train', 'Museum', 'Car Rental'
  name: string;
  time?: string;
  confirmationCode?: string;
}

export interface IAttachment {
  _id?: mongoose.Types.ObjectId;
  name: string;
  url: string;
  type?: string;
}

export interface IStop extends Document {
  _id: mongoose.Types.ObjectId;
  tripId: mongoose.Types.ObjectId;
  cityId: mongoose.Types.ObjectId;
  arriveDate: Date;
  leaveDate: Date;
  order: number;
  activities: IStopActivity[];
  lodging?: ILodging;
  reservations?: IReservation[];
  attachments?: IAttachment[];
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

const LodgingSchema = new Schema<ILodging>(
  {
    name: { type: String, default: '' },
    checkIn: { type: String, default: '' },
    checkOut: { type: String, default: '' },
    confirmationCode: { type: String, default: '' },
    address: { type: String, default: '' },
  },
  { _id: false }
);

const ReservationSchema = new Schema<IReservation>(
  {
    type: { type: String, default: 'Restaurant' },
    name: { type: String, required: true },
    time: { type: String, default: '' },
    confirmationCode: { type: String, default: '' },
  },
  { _id: true }
);

const AttachmentSchema = new Schema<IAttachment>(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    type: { type: String, default: 'link' },
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
    lodging: { type: LodgingSchema, default: () => ({}) },
    reservations: { type: [ReservationSchema], default: [] },
    attachments: { type: [AttachmentSchema], default: [] },
  },
  {
    timestamps: true,
  }
);

export const Stop: Model<IStop> =
  mongoose.models.Stop || mongoose.model<IStop>('Stop', StopSchema);
export default Stop;
