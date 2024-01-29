const mongoose = require('mongoose');

const petrolLogSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  odometerReading: { type: Number, required: true },
  petrolPrice: { type: Number, required: true },
  petrolVolume: { type: Number, required: true },
  station: { type: String, enum: ['Shell', 'Bharat-petroleum', 'HP'], required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('PetrolLog', petrolLogSchema);
