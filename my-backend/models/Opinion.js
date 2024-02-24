const mongoose = require('mongoose');
const opinionSchema = new mongoose.Schema({
  content: { // 意見フィールド
    type: String,
    required: true
  },
  createdAt: { // 投稿日時フィールド
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Opinion', opinionSchema);
