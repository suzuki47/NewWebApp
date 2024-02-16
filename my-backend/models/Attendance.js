const mongoose = require('mongoose');

//const attendanceSchema = new mongoose.Schema({
//  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//  checkIn: { type: Date, required: true },
//  checkOut: Date,
//});
const attendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date
  }
});

module.exports = mongoose.model('Attendance', attendanceSchema);
