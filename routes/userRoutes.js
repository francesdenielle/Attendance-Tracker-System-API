const express = require('express');
const verifyRole = require('../middlewares/roleVerification');

const userController = require('../controllers/userController');
const performanceController = require('../controllers/perfController');
const leaveController = require('../controllers/leaveController');
const attendanceController = require('../controllers/attendanceController');
const notificationController = require('../controllers/notifController');

const userRouter = express.Router();

// User routes
userRouter.post('/register', userController.registerUser);
userRouter.post('/login', userController.loginUser);
userRouter.get('/getUser/:id', userController.getUserById);
userRouter.put('/updateUser/:id', userController.updateUser);

// Performance routes
userRouter.get('/performances/:userId', performanceController.getAllUserPerformances);// Get all performances
userRouter.post('/add-performance', performanceController.createPerformance); // Create a new performance
userRouter.get('/performance/:id', performanceController.getPerformanceById); // Get a performance by ID
userRouter.put('/update-performance/:id', performanceController.updatePerformance); // Update a performance
userRouter.put('/delete-performance/:id', performanceController.deletePerformance); // Update a performance

// Attendance routes
userRouter.post('/add-attendance', attendanceController.createAttendance); 
userRouter.get('/user-attendances/:id', attendanceController.getUserAttendances); 
userRouter.get('/attendances', attendanceController.getAllAttendance); 
userRouter.get('/attendance/:id', attendanceController.getAttendanceById); 
userRouter.put('/update-attendance/:id', attendanceController.updateAttendance); 
userRouter.put('/delete-attendance/:id', attendanceController.deleteAttendance); 
userRouter.get('/pending-attendances', attendanceController.getAllPendingAttendance);

// Leave routes
userRouter.post('/add-leave', leaveController.createLeaveRequest); 
userRouter.get('/leaves/:id', leaveController.getAllUserLeaveRequests); 
userRouter.get('/leave/:id', leaveController.getLeaveRequestById); 
userRouter.put('/update-leave/:id', leaveController.updateLeaveRequest); 
userRouter.delete('/delete-leave/:id', leaveController.deleteLeaveRequest);
userRouter.get('/pending-leaves', leaveController.getAllPendingLeave);
userRouter.get('/leaves', leaveController.getAllLeaves); 
userRouter.get('/approve-leave/:id', leaveController.approveLeave); 

// Notification routes 
userRouter.post('/send-notification', notificationController.createNotification); 
userRouter.get('/notifications/:id', notificationController.getAllUserNotifications); 
userRouter.get('/notification/:id', notificationController.getNotificationById); 
userRouter.put('/update-notification/:id', notificationController.updateNotification); 
userRouter.put('/delete-notification/:id', notificationController.deleteNotification); 

// Admin-only routes
userRouter.get('/allUsers', userController.getAllUsers);
userRouter.put('/admin-edit/:id', userController.adminUpdateUser);
userRouter.put('/approve-attendance/:id/:userId', attendanceController.approveAttendance);
userRouter.put('/approve-leave/:id', leaveController.approveLeaveRequest); 
userRouter.delete('/delete-user/:id', userController.deleteUser);

module.exports = userRouter;