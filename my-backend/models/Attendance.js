const mongoose = require('mongoose');
const attendanceSchema = new mongoose.Schema({
  user: { // ユーザフィールド
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  checkIn: { // 出勤フィールド
    type: Date,
    required: true
  },
  checkOut: { // 退勤フィールド
    type: Date
  }
});

module.exports = mongoose.model('Attendance', attendanceSchema);
