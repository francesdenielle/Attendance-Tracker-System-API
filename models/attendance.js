const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  clockin: {
    type: Date,
  },
  clockout: {
    type: Date,
  },
  breakStart: {
    type: Date,
  },
  breakEnd: {
    type: Date,
  },
  overtime: {
    type: Number,
  },
  attendanceStatus: {
    type: String,
    required: true,
    enum: ['Rejected', 'Pending', 'Approved'],
  },
  
}, { timestamps: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;