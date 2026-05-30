import mongoose from "mongoose";

const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI;
    const mongoUriLocal = process.env.MONGO_URI_LOCAL;
    const useAtlas = process.env.USE_ATLAS === "true";

    if (!mongoUri && !mongoUriLocal) {
        console.error("MONGO_URI or MONGO_URI_LOCAL is not set. Add it to your .env file and restart the server.");
        return;
    }

    if (useAtlas && mongoUri) {
        try {
            await mongoose.connect(mongoUri);
            console.log("Database connected (atlas)");
            return;
        } catch (error) {
            console.error("Atlas database connection failed:", error);
        }
    }

    if (mongoUriLocal) {
        try {
            await mongoose.connect(mongoUriLocal);
            console.log("Database connected (local)");
            return;
        } catch (error) {
            console.error("Local database connection failed:", error);
        }
    }

    if (mongoUri) {
        try {
            await mongoose.connect(mongoUri);
            console.log("Database connected (atlas)");
        } catch (error) {
            console.error("Atlas database connection failed:", error);
        }
    }
};
export default connectDB;