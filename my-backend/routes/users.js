const express = require('express');
const router = express.Router();
const User = require('../models/User');

// ユーザーの一覧を取得
router.get('/', async (req, res) => {
  try {
    const users = await User.find(); // User.find()は、特定の条件を指定せずに全てのドキュメントを取得するためのMongoDBのクエリ
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 新しいユーザーを作成
router.post('/', async (req, res) => {
  const user = new User({
    name: req.body.name, // 従業員の名前
    hourlyWage: req.body.hourlyWage, // 時給
    position: req.body.position, // 役職
  });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ユーザー情報の更新（未実装）
router.put('/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ユーザーの削除
router.delete('/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
