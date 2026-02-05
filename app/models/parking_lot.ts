import mongoose from 'mongoose';
const { Schema } = mongoose;

export default mongoose.model('Parking_lot', new Schema({
    id: String,                 // Single or double letter identifier
    name: String,
    address: String,
    zone_id: String,            // actual name of the zone, or similar identifier (e.g. color)
    capacity: Number,
    availableSpots: Number      // can be changed to occupiedSpots if needed
}));