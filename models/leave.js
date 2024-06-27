const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  leaveType: {
    type: String,
    required: true,
    enum: ['Annual Leave', 'Sick Leave', 'Personal Leave', 'Vacation Leave', 'Maternity Leave'],
  },
  reason: {
    type: String,
  },
  status: {
    type: String,
    required: true,
    enum: ['Rejected', 'Pending', 'Approved'],
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  }, 
}, { timestamps: true });

const Leave = mongoose.model('Leave', leaveSchema);

module.exports = Leave;