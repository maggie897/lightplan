const request = require('supertest');
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const app = require('../../server/index'); 
const User = require("../models/User");

jest.mock("../utils/mailer", () => ({
  sendVeriEmail: jest.fn().mockResolvedValue(true),
  sendResetEmail: jest.fn().mockResolvedValue(true),
}));

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to DB:", mongoose.connection.name);
  await User.deleteMany({});
});

describe('Auth API', ()=>{
  it('should register a user successfully (mocked SES)', async()=>{
    const uniqueEmail = `test${Date.now()}@mail.com`;
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: uniqueEmail,
        password: 'password123'
      }); 
      expect(res.statusCode).toBe(201);
  });

  it("should login successfully with verified user", async () => {
    const u = new User({
      username: "verified",
      email: "verified@mail.com",
      password: await bcrypt.hash("password123", 10),
      isVerified: true,
    });
    await u.save();

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        loginInput:'verified', 
        password: 'password123'
      });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("token");
      expect(res.body.user.username).toBe("verified");
  });

  it("should fail login with wrong password", async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        loginInput: 'verified',
        password: 'wrongpassword'
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Invalid password/);
  });
})

afterAll(async () => {
  await mongoose.connection.close();
});

