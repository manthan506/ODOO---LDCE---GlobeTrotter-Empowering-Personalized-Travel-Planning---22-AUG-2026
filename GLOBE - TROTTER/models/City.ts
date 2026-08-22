import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICity extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  country: string;
  region?: string;
  costIndex: number;
  imageUrl?: string;
  description?: string;
  lat?: number;
  lng?: number;
  createdAt: Date;
  updatedAt: Date;
}

const CitySchema = new Schema<ICity>(
  {
    name: {
      type: String,
      required: [true, 'City name is required'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },
    region: {
      type: String,
      default: 'Asia',
    },
    costIndex: {
      type: Number,
      min: 1,
      max: 4,
      default: 2,
    },
    imageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
    },
    description: {
      type: String,
      default: '',
    },
    lat: {
      type: Number,
      default: 28.6139,
    },
    lng: {
      type: Number,
      default: 77.209,
    },
  },
  {
    timestamps: true,
  }
);

export const City: Model<ICity> =
  mongoose.models.City || mongoose.model<ICity>('City', CitySchema);
export default City;
