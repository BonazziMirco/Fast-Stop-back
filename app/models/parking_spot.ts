import mongoose from 'mongoose';
const { Schema } = mongoose;

export default mongoose.model('Parking_spot', new Schema({
    parking_lot_id: String,     // reference to Parking_lot id
    spot_number: Number,        // to be put after the parking_lot_id for unique id, could be set number of digits
    car_plate: String           // plate of the car occupying the spot, can be null if the spot is available
}));