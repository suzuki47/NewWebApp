const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// MongoDB Atlas接続設定
const dbUser = 'dbUser'; // 実際のMongoDB Atlasユーザー名を設定
const dbPassword = encodeURIComponent('3iRRZiu!zNJ2h!6'); // 実際のパスワードをURLエンコードして設定
const dbName = 'attendance_system'; // 使用するデータベース名を設定

// MongoDB Atlas接続文字列
const connectionString = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.tfrsimy.mongodb.net/${dbName}?retryWrites=true&w=majority`;

// MongoDBへの接続
mongoose.connect(connectionString);
mongoose.connection.on('open', () => console.log('Connected to MongoDB Atlas'));
mongoose.connection.on('error', (error) => console.error('MongoDB connection error:', error));

const app = express();
const port = 5001; // フロントエンドとは異なるポートを設定

app.use(cors()); // CORSミドルウェアを追加
app.use(express.json()); // JSONデータの解析に必要

// ルートモジュールのインポート
const usersRoutes = require('./routes/users');
const attendancesRoutes = require('./routes/attendances');
const opinionsRoutes = require('./routes/opinions'); 

// ルートへのルートモジュールの割り当て
app.use('/api/users', usersRoutes);
app.use('/api/attendances', attendancesRoutes);
app.use('/api/opinions', opinionsRoutes);

// シンプルなエンドポイントの例
app.get('/api/hello', (req, res) => {
  res.send({ message: 'Hello from backend!' });
});

// サーバーの起動
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
