import { Router } from "express";
import { userRoles } from "../../enums/user.enums.js";
import { errorRes, successRes } from "../../utils/response.util.js";
import * as authService from "./auth.service.js";
import { validate } from "../../middleware/validate.middleware.js";
import {
  signupSchema,
  loginSchema,
  logoutSchema,
} from "../../schemas/auth.schema.js";
import { auth } from "../../middleware/auth.middleware.js";

export const authRouter = new Router();

authRouter.post("/signup", validate(signupSchema), async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      age,
      nationality,
      role = userRoles.CUSTOMER,
    } = req.body;

    const payload = await authService.signup({
      firstName,
      lastName,
      email,
      password,
      phone,
      age,
      nationality,
      role,
    });
    successRes({
      res,
      message: "User created successfully",
      status: 201,
      data: payload,
    });
  } catch (error) {
    if (error.errorResponse?.code == 11000) {
      return errorRes({ res, message: "Phone already exists", status: 400 });
    }
    errorRes({ res, message: error.message, status: error.status || 500 });
  }
});

authRouter.post("/login", validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;
    const payload = await authService.login({ email, password });
    successRes({
      res,
      message: "Login successful",
      status: 200,
      data: payload,
    });
  } catch (error) {
    errorRes({ res, message: error.message, status: error.status || 500 });
  }
});

authRouter.post("/logout", auth, validate(logoutSchema), async (req, res) => {
  try {
    const { flag } = req.body;
    const { message } = await authService.logout({
      jti: req.decoded.jti,
      user: req.user,
      iat: req.decoded.iat,
      flag,
    });
    successRes({ res, message, status: 200 });
  } catch (error) {
    errorRes({ res, message: error.message, status: error.status || 500 });
  }
});

authRouter.get("/access-token", async (req, res) => {
  try {
    const [, refreshToken] = req.headers.authorization?.split(" ") ?? [];
    const payload = await authService.generateAccessToken({ refreshToken });
    successRes({
      res,
      message: "Access token generated successfully",
      data: payload,
    });
  } catch (err) {
    errorRes({ res, message: err.message });
  }
});
