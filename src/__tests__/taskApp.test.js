import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import jwt from "jsonwebtoken";
import Task from "../taskApp/models/Task.js";

const { setupApp } = await import("../../app.js");

let taskId;
let mongoServer;
let app;
let validToken;

beforeAll(async () => {
  app = await setupApp();
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  validToken = jwt.sign(
    { _id: "507f1f77bcf86cd799439011" },
    process.env.ACCESS_TOKEN_SECRET
  );
}, 30000);

afterAll(async () => {
  await Task.deleteMany({});
  await mongoose.disconnect();
  await mongoServer.stop();
  jest.clearAllMocks();
});

describe("Protected Task Routes", () => {
  test("POST /api/task-backend/task - should create new task", async () => {
    const response = await request(app)
      .post("/api/task-backend/task")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ name: "New Task" });

    taskId = response.body.tasks[response.body.tasks.length - 1]._id;

    expect(response.status).toStrictEqual(201);
    expect(response.body.message).toStrictEqual(
      "New task created successfully"
    );
    expect(
      response.body.tasks[response.body.tasks.length - 1].name
    ).toStrictEqual("New Task");
    expect(response.body.tasks[response.body.tasks.length - 1].user_id).toBe(
      "507f1f77bcf86cd799439011"
    );
  });

  test("GET /api/task-backend/task - should get all tasks", async () => {
    const response = await request(app)
      .get("/api/task-backend/task")
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.status).toStrictEqual(201);
    expect(response.body.message).toStrictEqual("Successfull");
    expect(response.body.tasks.length).toBeGreaterThanOrEqual(1);
  });

  test("PATCH /api/task-backend/task/:taskId - should update task", async () => {
    const response = await request(app)
      .patch("/api/task-backend/task/" + taskId)
      .set("Authorization", `Bearer ${validToken}`)
      .send({ status: true });

    expect(response.status).toStrictEqual(201);
    expect(response.body.message).toStrictEqual("Task updated successfully");
    expect(
      response.body.tasks[response.body.tasks.length - 1].status
    ).toStrictEqual(true);
  });

  test("DELETE /api/task-backend/task/:taskId - should delete task", async () => {
    const response = await request(app)
      .delete("/api/task-backend/task/" + taskId)
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.status).toStrictEqual(201);
    expect(response.body.message).toStrictEqual("Task deleted successfully");
    expect(response.body.success).toStrictEqual(true);
  });
});
