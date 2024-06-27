const Performance = require('../models/performance');

const startShift = new Date();
startShift.setHours(9, 0, 0, 0); //9AM

const endShift = new Date();
endShift.setHours(18, 0, 0, 0); //6PM

exports.calculateHoursRendered = (clockin, clockout, breakStart, breakEnd) => {
  clockin = Math.max(startShift, clockin);
  clockout = Math.min(endShift, clockout);

  if (clockin >= clockout) {
    return 0;
  }

  let workTime = Math.max(0, clockout - clockin);
  workTime -= Math.max(0, Math.min(clockout, breakEnd) - Math.max(breakStart, clockin));

  const hoursRendered = workTime / (1000 * 60 * 60);

  return hoursRendered;
};

exports.getUserPerformances = async (req, res) => {
  const userId = req.params.userId;
  try {
    const performances = await Performance.find({ userId }).populate('userId');
    res.status(200).json(performances);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching performances' });
  }
};

exports.getPerformanceById = async (req, res) => {
  try {
    const performanceId = req.params.id;
    const performance = await Performance.findById(performanceId).populate('userId');

    if (!performance) {
      return res.status(404).json({ message: 'Performance not found' });
    }

    res.status(200).json(performance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching performance' });
  }
};

exports.createPerformance = async (req, res) => {
  try {
    const { userId, hoursRendered } = req.body;

    const newPerformance = new Performance({
      userId,
      hoursRendered,
    });

    const savedPerformance = await newPerformance.save();
    res.status(201).json({ message: 'Performance created successfully!', performance: savedPerformance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating performance' });
  }
};

exports.aCreatePerformance = async (userId, hoursRendered) => {
  try {
    const newPerformance = new Performance({
      userId,
      hoursRendered,
    });

    const savedPerformance = await newPerformance.save();
    console.log("performance saved successfully: ", savedPerformance);
  } catch (err) {
    console.error(err);
    console.log("performance saved unsuccessfully: ", hoursRendered);
  }
};

exports.updatePerformance = async (req, res) => {
  try {
    const performanceId = req.params.id;
    const updates = req.body;

    const updatedPerformance = await Performance.findByIdAndUpdate(performanceId, updates, { new: true }); // Return updated document

    if (!updatedPerformance) {
      return res.status(404).json({ message: 'Performance not found' });
    }

    res.status(200).json({ message: 'Performance updated successfully!', performance: updatedPerformance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating performance' });
  }
};

exports.deletePerformance = async (req, res) => {
  try {
    const performanceId = req.params.id;

    const deletedPerformance = await Performance.findByIdAndDelete(performanceId);

    if (!deletedPerformance) {
      return res.status(404).json({ message: 'Performance not found' });
    }

    res.status(200).json({ message: 'Performance deleted successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting performance' });
  }
};

module.exports = {
    createPerformance: exports.createPerformance,
    getAllUserPerformances: exports.getUserPerformances,
    getPerformanceById: exports.getPerformanceById,
    updatePerformance: exports.updatePerformance,
    deletePerformance: exports.deletePerformance,
    calculateHoursRendered: exports.calculateHoursRendered,
    aCreatePerformance: exports.aCreatePerformance,
  };