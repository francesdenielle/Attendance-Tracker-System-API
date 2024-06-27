const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  hoursRendered: {
    type: Number,
  },
}, { timestamps: true });

const Performance = mongoose.model('Performance', performanceSchema);

module.exports = Performance;