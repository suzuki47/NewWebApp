const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: { // 従業員の名前フィールド
    type: String,
    required: true
  },
  hourlyWage: { // 時給フィールド
    type: Number,
    required: true
  },
  position: { // 役職フィールド
      type: String,
      required: true
  }
});


module.exports = mongoose.model('User', userSchema);
