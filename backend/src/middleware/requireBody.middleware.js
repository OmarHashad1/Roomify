import { errorRes } from "../utils/response.util.js";

export const requireBody = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return errorRes({
      res,
      message: "Request body cannot be empty",
      status: 400,
    });
  }
  next();
};
