const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  hourlyWage: { // 時給フィールドを追加
    type: Number,
    required: true
  },
  position: {
      type: String,
      required: true
  }
});


module.exports = mongoose.model('User', userSchema);
