const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');

// 出勤時の動作
router.post('/checkin', async (req, res) => {
    const { userId } = req.body; // リクエストボディからユーザーIDを取得

    // 現在出勤中の記録を確認
    const existingRecord = await Attendance.findOne({
	user: userId,
	checkOut: { $exists: false }
    });
    // 既に出勤している場合はエラーを返す
    if (existingRecord) {
	return res.status(400).json({
	    message: "User is already checked in. Please check out before checking in again."
	});
    }

    // 新たな出勤記録を作成
    const attendance = new Attendance({
	user: userId,
	checkIn: new Date(),
    });
    try {
	const newAttendance = await attendance.save();
	res.status(201).json(newAttendance);
    } catch (err) {
	res.status(400).json({ message: err.message });
    }
});

// 退勤時の動作
router.post('/checkout', async (req, res) => {
    const { userId } = req.body; // リクエストボディからユーザーIDを取得

    try {
        // 最新の出勤記録を検索（退勤されていない記録）
        const latestCheckIn = await Attendance.findOne({ user: userId, checkOut: { $exists: false } }).sort({ checkIn: -1 }); // 検索結果をcheckInフィールドの降順でソート
        if (!latestCheckIn) {
            return res.status(404).json({ message: 'No active check-in found for this user.' });
        }

        // 退勤処理
        latestCheckIn.checkOut = new Date(); // 現在時刻を退勤時刻として設定する
        await latestCheckIn.save();
        res.status(200).json(latestCheckIn);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 現在出勤中の従業員リスト
router.get('/inoffice', async (req, res) => {
    try {
	const inOfficeAttendances = await Attendance.find({ checkOut: { $exists: false } })
	      .populate('user'); // userフィールドを参照して退勤データのないユーザー情報を取得
	res.json(inOfficeAttendances);
    } catch (err) {
	res.status(500).json({ message: err.message });
    }
});

// ユーザーの月別勤務時間を取得するエンドポイント
router.get('/workhours/:userId', async (req, res) => {
    const userId = req.params.userId;
    const month = req.query.month; // クエリパラメータから月を取得 ('YYYY-MM' 形式)

    try {
	// 月の初日と最終日を計算
	// JavaScriptのDateオブジェクトで月を扱う際、「月」は0から始まる数値で表される
	const year = parseInt(month.split('-')[0]);
	const monthIndex = parseInt(month.split('-')[1]) - 1; // 月は0から始まるため、-1をする
	const startDate = new Date(year, monthIndex, 1);
	const endDate = new Date(year, monthIndex + 1, 0); // 翌月の0日は前月の最終日（次の月の「0日」を指定することで、実質的に指定された月の最終日を得ることができる）

	// 指定された期間内の勤務記録とユーザー情報を検索
	const attendances = await Attendance.find({
	    user: userId,
	    checkIn: { $gte: startDate, $lte: endDate }
	}).populate('user'); // 'name'から'user'に変更して、ユーザーの全情報を取得

	// 応答データの準備
	const workHours = attendances.map(att => {
	    const checkInDate = att.checkIn.toISOString().split('T')[0]; // YYYY-MM-DD 形式
	    const totalMinutes = att.checkOut ? (att.checkOut.getTime() - att.checkIn.getTime()) / 60000 : 0; // 分単位で勤務時間を計算
	    const hours = Math.floor(totalMinutes / 60);
	    const minutes = Math.round(totalMinutes % 60);
	    const hourlyWage = att.user.hourlyWage; // 時給を取得
	    const dailyWage = (totalMinutes / 60) * hourlyWage; // 日給を計算

	    return { 
		date: checkInDate, 
		workTime: `${hours}時間${minutes}分`, // 勤務時間を「何時間何分」で表示
		dailyWage: dailyWage.toFixed(2) // 日給を2小数点で丸めて表示
	    };
	});

	res.json(workHours);
    } catch (error) {
	res.status(500).json({ message: "Error fetching work hours", error });
    }
});




module.exports = router;
