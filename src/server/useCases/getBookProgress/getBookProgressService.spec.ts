import { describe, expect, it } from "vitest";
import SaveBookProgressService from "../saveBookProgress/saveBookProgressService";
import GetBookProgressService from "./getBookProgressService";
import { container } from "@/server/container";

describe("Get Book Progress By UserID and BookID", () => {
  it("Should be able to get book progress by userID and bookID", async () => {
    const { bookProgressRepository } = container();
    const getBookProgressService = new GetBookProgressService({
      bookProgressRepository,
    });
    const saveBookProgressService = new SaveBookProgressService({
      bookProgressRepository,
    });


    const userID = 2;
    const bookID = 3;
    const currentChunkIndex = 2;
    const totalTypedCharacters = 10;
    const totalMistakes = 1;
    await saveBookProgressService.execute({
      userID,
      bookID,
      currentChunkIndex,
      totalTypedCharacters,
      totalMistakes,
    });

    const bookProgress = await getBookProgressService.execute(userID, bookID);
    expect(bookProgress).not.toBe(undefined);
    expect(bookProgress?.userID).toBe(userID);
    expect(bookProgress?.bookID).toBe(bookID);
    expect(bookProgress?.currentChunkIndex).toBe(currentChunkIndex);
    expect(bookProgress?.totalTypedCharacters).toBe(totalTypedCharacters);
    expect(bookProgress?.totalMistakes).toBe(totalMistakes);
  })
})
