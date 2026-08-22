import mongoose from 'mongoose';

let MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/globetrotter';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 2000,
    };

    cached!.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((m) => {
        return m;
      })
      .catch(async (err) => {
        // If local mongodb is not running or unreachable, fallback seamlessly to in-memory mongodb
        try {
          const { MongoMemoryServer } = await import('mongodb-memory-server');
          const mongod = await MongoMemoryServer.create();
          const uri = mongod.getUri();
          console.log('Using in-memory MongoDB fallback database:', uri);
          return mongoose.connect(uri, { bufferCommands: false });
        } catch (memErr) {
          console.error('MongoDB fallback connection error:', memErr);
          throw err;
        }
      });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    console.error('MongoDB connection error:', e);
    throw e;
  }

  return cached!.conn;
}
