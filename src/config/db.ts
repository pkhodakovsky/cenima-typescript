import mongoose from 'mongoose';


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        console.log('Database connected...');
    } catch (error: any) {
        console.log(error.message);
        setTimeout(connectDB, 5000);
    }
};

export default connectDB;
