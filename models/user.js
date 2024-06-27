const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  role: { type: String, required: true, enum: ['Admin', 'Employee'] },
  position: { type: String, required: true },
  department: { type: String, required: true },
  attendanceRecord: { type: mongoose.Schema.Types.ObjectId, ref: 'Attendance' },
  leaveRecord: { type: mongoose.Schema.Types.ObjectId, ref: 'Leave' },
  perfRecord: { type: mongoose.Schema.Types.ObjectId, ref: 'Performance' },
  notification: { type: mongoose.Schema.Types.ObjectId, ref: 'Notification' },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
