import sendResponse from "../utils/sendResponse.js";

export const restrictTo = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return sendResponse(
        res,
        403,
        null,
        false,
        "You do not have permission for this action."
      );
    }

    
    if (req.user.role === "staff" && !req.user.department) {
      return sendResponse(
        res,
        403,
        null,
        false,
        "Staff must belong to a department."
      );
    }

    next();
  };
};