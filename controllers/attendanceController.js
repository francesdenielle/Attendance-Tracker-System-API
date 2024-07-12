const Attendance = require('../models/attendance'); 
const moment = require('moment-timezone');
const { calculateHoursRendered, aCreatePerformance } = require('./perfController');

const timezone = 'Asia/Manila';

const startShift = moment.tz('2024-07-11T09:00:00', timezone).utc();

const endShift = moment.tz('2024-07-11T18:00:00', timezone).utc();

const addEightHours = (dateTimeString) => {
  return moment.tz(dateTimeString, timezone).add(8, 'hours').toDate();
};

const calculateOvertime = (clockin, clockout) => {
  if (!(clockin instanceof Date) || !(clockout instanceof Date)) {
    throw new Error('Invalid clockin or clockout: Must be Date objects');
  }

  const standardWorkdayMs = 8 * 60 * 60 * 1000;

  const clockinMs = clockin.getTime();
  const clockoutMs = clockout.getTime();

  const workedMs = clockoutMs - clockinMs;

  if (workedMs > standardWorkdayMs) {
    const overtimeMs = workedMs - standardWorkdayMs;

    const overtimeHours = Math.floor(overtimeMs / (60 * 60 * 1000));

    return overtimeHours;
  } else {
    return 0;
  }
};

exports.createAttendance = async (req, res) => {
  try {

    const newAttendanceData = new Attendance ({
      ...req.body,
      clockin: addEightHours(req.body.clockin),
      clockout: addEightHours(req.body.clockout),
      breakStart: addEightHours(req.body.breakStart),
      breakEnd: addEightHours(req.body.breakEnd),
    }); 

    console.log(newAttendanceData);

    const savedAttendance = await newAttendanceData.save(); 
    res.status(201).json(savedAttendance); 
  } catch (err) {
    console.error(err);
    console.log(req.body);
    res.status(500).json({ message: 'Error creating attendance' });
  }
};

exports.getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find().populate('userId', 'username firstname lastname');; // Find all attendance documents
    res.status(200).json(attendance); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching attendance records' });
  }
};

exports.getAttendanceById = async (req, res) => {
  const id = req.params.id;
  try {
    const attendance = await Attendance.findById(id);
    if (!attendance) return res.status(404).json({ message: 'Attendance not found' });
    res.status(200).json(attendance); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching attendance' });
  }
};


exports.updateAttendance = async (req, res) => {
  const id = req.params.id;
  try {
    const updatedAttendanceData = new Attendance ({
      ...req.body,
      clockin: addEightHours(req.body.clockin),
      clockout: addEightHours(req.body.clockout),
      breakStart: addEightHours(req.body.breakStart),
      breakEnd: addEightHours(req.body.breakEnd),
    });

    const updatedAttendance = await Attendance.findByIdAndUpdate(id, updatedAttendanceData, { new: true });

    if (!updatedAttendance) {
      return res.status(404).json({ message: 'Attendance not found' });
    }

    res.status(200).json(updatedAttendance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating attendance' });
  }
};

exports.deleteAttendance = async (req, res) => {
    try {
      const attendanceId = req.params.id;
  
      const deletedAttendance = await Attendance.findByIdAndDelete(attendanceId);
  
      if (!deletedAttendance) {
        return res.status(404).json({ message: 'Attendance record not found' });
      }
  
      res.status(200).json({ message: 'Attendance record deleted successfully!' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error deleting Attendance record' });
    }
  };

  exports.approveAttendance = async (req, res) => {
    const id = req.params.id;
    const userId = req.params.userId;
    const attendanceStatus = req.body.status;
    console.log(attendanceStatus);
  
    if (!attendanceStatus || !['Approved', 'Rejected', 'Pending'].includes(attendanceStatus)) {
      return res.status(400).json({ message: 'Invalid status provided' });
    }
  
    try {
      const updatedAttenStatus = await Attendance.findByIdAndUpdate(id, { attendanceStatus }, { new: true });
      if (!updatedAttenStatus) return res.status(404).json({ message: 'Attendance not found' });
  
      const attendance = updatedAttenStatus;
  
      const hoursRendered = calculateHoursRendered(attendance.clockin, attendance.clockout, attendance.breakStart, attendance.breakEnd);

      if (attendanceStatus === 'Approved') {
        try {
          const performanceCreated = await aCreatePerformance(userId, hoursRendered);
          console.error('performance created', performanceCreated);
        } catch (error) {
          console.error(error);
        }
      }
  
      res.status(200).json(updatedAttenStatus);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error approving/rejecting Attendance' });
    }
  };
  
  exports.getUserAttendances = async (req, res) => {
    console.log(req);
    console.log(req.params.id);
    const userId = req.params.id;
    try {
      const attendances = await Attendance.find({ userId }).populate('userId');
      res.status(200).json(attendances);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error fetching attendances' });
    }
  };

  exports.getAllPendingAttendance = async (req, res) => {
    try {
      const pendingAttendance = await Attendance.find({ attendanceStatus: 'Pending' })
        .populate('userId', 'username firstname lastname'); // Populate user details
      res.status(200).json(pendingAttendance);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error fetching pending attendance records' });
    }
  };

module.exports = {
  createAttendance: exports.createAttendance,
  getAllAttendance: exports.getAllAttendance,
  getAttendanceById: exports.getAttendanceById,
  updateAttendance: exports.updateAttendance,
  deleteAttendance: exports.deleteAttendance,
  approveAttendance: exports.approveAttendance,
  getUserAttendances: exports.getUserAttendances,
  getAllPendingAttendance: exports.getAllPendingAttendance
};
