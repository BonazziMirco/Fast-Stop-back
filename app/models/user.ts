import mongoose from 'mongoose';
const { Schema } = mongoose;

export default mongoose.model('Student', new Schema({
    id: Number,
    email: String,
    password: String,           //  must be hashed
    name: String,
    surname: String,
    authority: Number,          // 0 = driver, 1 = view only, 2 = worker, 3 = admin
    car_plate: String           // used to free a spot before the end of the reservation
}));