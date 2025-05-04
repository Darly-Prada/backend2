
  export const authorizeRoles = (...rolPermitido) => {
    return (req, res, next) => {
      const user = req.user;
      if (!user || !rolPermitido.includes(user.role)) {
        return res.status(403).json({ error: 'No autorizado' });
      }
      next();
    };
  };