const verifyRole = (allowedRoles) => (req, res, next) => {
    const user = req.user; 
    if (user && allowedRoles.includes(user.role)) {
      next();
    } else {
      return res.status(403).json({ message: 'Unauthorized access' }); 
    }
};

module.exports = verifyRole;