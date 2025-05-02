import http, { Server } from "http";
import next from "next";
import supertest from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

let server: Server | undefined;
const app = next({ dev: true })
const handler = app.getRequestHandler();

describe("API Routes", () => {
  beforeAll(async () => {
    await app.prepare();
    server = http.createServer((req, res) => {
      handler(req, res);
    });
    server.listen(4000)
  })

  afterAll(() => {
    if (server) {
      server.close();
    }
  })

  it("Should be able to save and get book progress by userID and bookID", async () => {
    const bookId = 7;
    const BookProgressInput = {
      userID: 3,
      currentChunkIndex: 10,
      totalTypedCharacters: 100,
      totalMistakes: 5,
    }

    const patchResponse = await supertest(server!)
      .patch(`/api/progress/${bookId}`)
      .send(BookProgressInput)
      .expect(201)

    expect(patchResponse.status).toBe(201);

    const getResponse = await supertest(server!)
      .get(`/api/progress/${bookId}`)
      .expect(201)

    const {
      userID,
      bookID,
      currentChunkIndex,
      totalTypedCharacters,
      totalMistakes,
    } = getResponse.body.response;

    expect(bookID).toBe(bookId);
    expect(userID).toBe(BookProgressInput.userID);
    expect(currentChunkIndex).toBe(BookProgressInput.currentChunkIndex);
    expect(totalTypedCharacters).toBe(BookProgressInput.totalTypedCharacters);
    expect(totalMistakes).toBe(BookProgressInput.totalMistakes);
  })
})
