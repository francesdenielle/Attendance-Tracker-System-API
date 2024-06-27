const Notification = require('../models/notification'); // Assuming 'models' folder for Mongoose models

exports.createNotification = async (req, res) => {
  try {
    const { userId, message, status, sendTo } = req.body;

    const newNotification = new Notification({
      userId,
      message,
      status,
      sendTo,
    });

    const savedNotification = await newNotification.save();

    res.status(201).json(savedNotification);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating notification' });
  }
};

exports.getAllUserNotifications = async (req, res) => {
  const userId = req.params.id;
  try {
    const notifications = await Notification.find({ userId }); 
    res.status(200).json(notifications); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
};


exports.getNotificationById = async (req, res) => {
  const id = req.params.id;
  try {
    const notification = await Notification.findById(id);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.status(200).json(notification);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching notification' });
  }
};


exports.updateNotification = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedNotification = await Notification.findByIdAndUpdate(
      { _id: leaveId },
      { $set: req.body },
      { new: true }
    ); 

    if (!updatedNotification) return res.status(404).json({ message: 'Notification not found' });
    res.status(200).json(updatedNotification);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating notification' });
  }
};

exports.deleteNotification = async (req, res) => {
    try {
      const notificationId = req.params.id;
  
      const deletedNotification = await Notification.findByIdAndDelete(notificationId);
  
      if (!deletedNotification) {
        return res.status(404).json({ message: 'Notification not found' });
      }
  
      res.status(200).json({ message: 'Notification deleted successfully!' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error deleting Notification' });
    }
  };

exports.approveNotification = async (req, res) => {
    const id = req.params.id;
    const { status } = req.body; 
    if (!status || !['Approved', 'Rejected', 'Pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status provided' });
    }
  
    try {
      const updatedNotif = await Leave.findByIdAndUpdate(id, { status }, { new: true });
      if (!updatedNotif) return res.status(404).json({ message: 'notification request not found' });
      res.status(200).json(updatedNotif);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error approving/rejecting notification' });
    }
  };
  


module.exports = {
  createNotification: exports.createNotification,
  getAllUserNotifications: exports.getAllUserNotifications,
  getNotificationById: exports.getNotificationById,
  updateNotification: exports.updateNotification,
  deleteNotification: exports.deleteNotification,
  approveNotification: exports.approveNotification
};