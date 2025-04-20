import request from "supertest";
import app from "../app.js";
import Message from "../models/message.js";

describe("Endpoint tests for messages", () => {
    let createdMessageId;

    beforeAll(async () => {
        // clearing the message table before testing
        await Message.destroy({where: {}});
    });

    it("POST /messages - should create a message", async () => {
        const response = await request(app)
            .post("/messages")
            .send({content: "Test message"})
            .expect(201);

        expect(response.body).toHaveProperty("id");
        expect(response.body.content).toBe("Test message");
        createdMessageId = response.body.id;
    });

    it("GET /messages - should download a list of messages", async () => {
        const response = await request(app)
            .get("/messages")
            .expect(200);

        expect(Array.isArray(response.body)).toBeTruthy();
        const msg = response.body.find((m) => m.id === createdMessageId);
        expect(msg).toBeDefined();
    });

    it("GET /messages/:id - should download a single message", async () => {
        const response = await request(app)
            .get(`/messages/${createdMessageId}`)
            .expect(200);

        expect(response.body).toHaveProperty("id", createdMessageId);
        expect(response.body.content).toBe("Test message");
    });

    it("PUT /messages/:id - should update the message", async () => {
        const newContent = "Updated message";
        const response = await request(app)
            .put(`/messages/${createdMessageId}`)
            .send({content: newContent})
            .expect(200);

        expect(response.body.content).toBe(newContent);
    });

    it("DELETE /messages/:id - should delete the message", async () => {
        const response = await request(app)
            .delete(`/messages/${createdMessageId}`)
            .expect(200);

        expect(response.body.message).toBe("Deleted");

        await request(app)
            .get(`/messages/${createdMessageId}`)
            .expect(404);
    });
});
