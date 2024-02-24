const express = require('express');
const router = express.Router();
const Opinion = require('../models/Opinion');
// 意見投稿の動作
router.post('/', async (req, res) => {
  try {
    const opinion = new Opinion({
      content: req.body.content
    });
    const savedOpinion = await opinion.save();
    res.status(201).json(savedOpinion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  // パスワードがクエリパラメータから提供されると仮定
  const password = req.query.password;
  if (password !== '7777') { // 今回はパスワードを7777と仮定する
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const opinions = await Opinion.find(); // Opinion.find()は、特定の条件を指定せずに全てのドキュメントを取得するためのMongoDBのクエリである
    res.json(opinions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
