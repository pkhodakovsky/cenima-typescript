import mongoose, { Schema, Document } from 'mongoose';

interface ICinema extends Document {
    name: string;
    seats: number;
    purchasedSeats: number[];
}

const cinemaSchema: Schema<ICinema> = new Schema<ICinema>(
    {
        name: {
            type: Schema.Types.String,
            required: true,
            unique: true,
        },
        seats: {
            type: Schema.Types.Number,
            required: true,
        },
        purchasedSeats: {
            type: [Number],
            default: [],
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model<ICinema>('Cinema', cinemaSchema);