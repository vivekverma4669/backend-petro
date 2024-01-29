const express = require('express');
const petroApp = express.Router();
const PetrolLogModel = require('../models/Petro.module');
petroApp.use(express.json());

petroApp.get('/', async (req, res) => {
  const { station } = req.query;
  const userId = req.userId;

  try {
    let query = { user: userId };
    if (station) {
      query.station = station;
    }
    const petrolLogs = await PetrolLogModel.find(query);
    res.json({ petrolLogs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

petroApp.post('/create', async (req, res) => {
  const { date, odometerReading, petrolPrice, petrolVolume, station } = req.body;
  const userId = req.userId; 
  try {
    const petrolLog = await PetrolLogModel.create({
      date,
      odometerReading,
      petrolPrice,
      petrolVolume,
      station,
      user: userId
    });
    res.json({ message: 'Petrol log created successfully', petrolLog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});




petroApp.put('/:id', async (req, res) => {
  const {id} = req.params;
  const { date, odometerReading, petrolPrice, petrolVolume, station } = req.body;
  const userId = req.userId;

  try {
    const updatedPetrolLog = await PetrolLogModel.findOneAndUpdate(
      { _id: id, user: userId },
      { date, odometerReading, petrolPrice, petrolVolume, station },
      { new: true }
    );
    if (!updatedPetrolLog) {
      return res.status(404).json({ message: 'Petrol log not found' });
    }
    res.json({ message: 'Petrol log updated successfully', updatedPetrolLog });
  } catch (error) {
    console.error(error);
    res.send({ message: 'Server Error' });
  }
});


petroApp.delete('/:id', async (req, res) => {
  const {id} = req.params;
  console.log(id);
  console.log(req);
  const userId = req.userId;
  try {
    const deletedPetrolLog = await PetrolLogModel.findOneAndDelete({ _id: id, user: userId });
    if (!deletedPetrolLog) {
      return res.status(404).json({ msg:'Petrol log not found' });
    }
    res.send({ message: 'Petrol log deleted successfully', deletedPetrolLog});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = petroApp;
