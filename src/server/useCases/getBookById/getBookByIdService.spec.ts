import { container } from "@/server/container";
import { describe, expect, it } from "vitest";
import GetBookByIdService from "./getBookByIdService";
import SaveBookService from "../saveBook/saveBookService";
import { v4 as uuid } from "uuid";
import Book from "@/server/entities/Book";

function createRandomBook(): Book {
  const id = uuid();
  const book: Book = {
    id: id,
    title: `Book ${Math.floor(Math.random() * 1000)}`,
    authorName: `Author ${Math.floor(Math.random() * 1000)}`,
    description: `Description ${Math.floor(Math.random() * 1000)}`,
    coverImage: `https://example.com/image${Math.floor(Math.random() * 1000)}.jpg`,
    urlTextSource: `https://example.com/book${Math.floor(Math.random() * 1000)}.txt`,
  };
  return book;
}

describe("Get Book By ID", () => {
  it("Should be able to get book by ID", async () => {
    const { booksRepository } = container();
    const getBookByIdService = new GetBookByIdService({
      bookRepository: booksRepository,
    });
    const saveBookService = new SaveBookService({
      booksRepository,
    });

    const book1 = createRandomBook();
    const book2 = createRandomBook();
    const book3 = createRandomBook();
    await saveBookService.execute(book1);
    await saveBookService.execute(book2);
    await saveBookService.execute(book3);

    const expectedBook1 = await getBookByIdService.execute(book1.id);
    const expectedBook2 = await getBookByIdService.execute(book2.id);
    const expectedBook3 = await getBookByIdService.execute(book3.id);

    expect(expectedBook1).not.toBe(undefined);
    expect(expectedBook1.id).toBe(book1.id);
    expect(expectedBook1.title).toBe(book1.title);
    expect(expectedBook1.id).not.toBe(expectedBook2.id);
    expect(expectedBook1.title).not.toBe(expectedBook2.title);
    expect(expectedBook1.authorName).toBe(book1.authorName);

    expect(expectedBook2).not.toBe(undefined);
    expect(expectedBook2.id).toBe(book2.id);
    expect(expectedBook2.title).toBe(book2.title);
    expect(expectedBook2.id).not.toBe(expectedBook3.id);

    expect(expectedBook3).not.toBe(undefined);
    expect(expectedBook3.id).toBe(book3.id);
    expect(expectedBook3.title).toBe(book3.title);
    expect(expectedBook3.authorName).toBe(book3.authorName);
  })
})
