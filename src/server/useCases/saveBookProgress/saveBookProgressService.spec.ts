import { container } from "@/server/container";
import { describe, expect, it } from "vitest";
import SaveBookProgressService from "./saveBookProgressService";

describe("Save Book Progress", () => {
  it("Should be able to save book progress", async () => {
    const { bookProgressRepository } = container();
    const saveBookProgressService = new SaveBookProgressService({
      bookProgressRepository,
    });

    const userID = 3;
    const bookID = 1;
    const currentChunkIndex = 0;
    const totalTypedCharacters = 0;
    const totalMistakes = 0;
    const bookProgress = await saveBookProgressService.execute({
      userID,
      bookID,
      currentChunkIndex,
      totalTypedCharacters,
      totalMistakes,
    });

    expect(bookProgress).not.toBe(undefined);
    expect(bookProgress?.userID).toBe(userID);
  })
})
