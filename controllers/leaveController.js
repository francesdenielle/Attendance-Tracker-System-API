const Leave = require('../models/leave'); 

exports.createLeaveRequest = async (req, res) => {
  try {
    const newLeave = new Leave(req.body);
    const savedLeave = await newLeave.save(); 
    res.status(201).json(savedLeave); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating leave request' });
  }
};

exports.getAllUserLeaveRequests = async (req, res) => {
  const userId = req.params.id;
  try {
    const leaves = await Leave.find({ userId }).populate('userId');
    res.status(200).json(leaves);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching Leave Requests' });
  }
};

exports.getLeaveRequestById = async (req, res) => {
  const id = req.params.id;
  try {
    const leave = await Leave.findById(id);
    if (!leave) return res.status(404).json({ message: 'Leave request not found' });
    res.status(200).json(leave); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching leave request' });
  }
};


exports.updateLeaveRequest = async (req, res) => {
  const leaveId = req.params.leaveId;

  if (!mongoose.Types.ObjectId.isValid(leaveId)) {
    return res.status(400).json({ message: 'Invalid leave ID' });
  }

  try {
    const updatedLeave = await Leave.findOneAndUpdate(
      { _id: leaveId },
      { $set: req.body },
      { new: true }
    );

    if (!updatedLeave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    res.status(200).json(updatedLeave);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating leave request' });
  }
};

exports.approveLeaveRequest = async (req, res) => {
  const id = req.params.id;
  const { status } = req.body; 

  if (!status || !['Approved', 'Rejected', 'Pending'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status provided' });
  }

  try {
    const updatedLeave = await Leave.findByIdAndUpdate(id, { status }, { new: true });
    if (!updatedLeave) return res.status(404).json({ message: 'Leave request not found' });
    res.status(200).json(updatedLeave); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error approving/rejecting leave request' });
  }
};

exports.deleteLeaveRequest = async (req, res) => {
    try {
      const LeaveId = req.params.id;
  
      const deletedLeave= await Leave.findByIdAndDelete(LeaveId);
  
      if (!deletedLeave) {
        return res.status(404).json({ message: 'Leave Request not found' });
      }
  
      res.status(200).json({ message: 'Leave Request deleted successfully!' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error deleting Leave Request' });
    }
  };

  exports.getAllPendingLeave = async (req, res) => {
    try {
      const pendingLeave = await Leave.find({ status: 'Pending' })
        .populate('userId', 'username firstname lastname'); // Populate user details
      res.status(200).json(pendingLeave);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error fetching pending leave records' });
    }
  };


  exports.getAllLeaves = async (req, res) => {
    try {
      const leaves = await Leave.find().populate('userId', 'username firstname lastname');
      res.status(200).json(leaves); 
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error fetching leave records' });
    }
  };

  exports.approveLeave = async (req, res) => {
    const id = req.params.id;
    const attendanceStatus = req.body.status;
    console.log(attendanceStatus);
  
    if (!attendanceStatus || !['Approved', 'Rejected', 'Pending'].includes(attendanceStatus)) {
      return res.status(400).json({ message: 'Invalid status provided' });
    }
  
    try {
      const updatedLeaveStatus = await Leave.findByIdAndUpdate(id, { attendanceStatus }, { new: true });
      if (!updatedLeaveStatus) return res.status(404).json({ message: 'Leave not found' });
  
      res.status(200).json(updatedLeaveStatus);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error approving/rejecting Attendance' });
    }
  };

module.exports = {
  createLeaveRequest: exports.createLeaveRequest,
  getAllUserLeaveRequests: exports.getAllUserLeaveRequests,
  getLeaveRequestById: exports.getLeaveRequestById,
  updateLeaveRequest: exports.updateLeaveRequest,
  approveLeaveRequest: exports.approveLeaveRequest,
  deleteLeaveRequest: exports.deleteLeaveRequest,
  getAllPendingLeave: exports.getAllPendingLeave,
  getAllLeaves: exports.getAllLeaves,
  approveLeave: exports.approveLeave,
};