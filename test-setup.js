import { jest } from "@jest/globals";

global.jest = jest;

jest.unstable_mockModule("./src/apps/authApp/utils/AuthMiddleware.js", () => ({
  authUser: jest.fn((req, res, next) => {
    // Default mock behavior - authenticated user
    req.user = { userId: "507f1f77bcf86cd799439011" };
    next();
  }),
}));
