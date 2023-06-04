import request from "supertest";
import { app } from "../src/app";

describe("App", () => {
  test('GET / should return "Hello, World!"', async () => {
    const response = await request(app).get("/auth/hello");
    expect(response.status).toBe(404);
    expect(response.text).toBe("Hello, World!");
  });

  test("POST /login should return a success message", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ username: "testuser", password: "password" });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "login not implemented" });
  });

  // Add more test cases for other endpoints or scenarios
});
