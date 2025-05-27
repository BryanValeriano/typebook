import { container } from "@/server/container";
import { describe, expect, it } from "vitest";
import GetAllBooksService from "./getAllBooksService";
import Book from "@/server/entities/Book";
import { v4 as uuid } from "uuid";
import SaveBookService from "../saveBook/saveBookService";

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


describe("Get All Books", () => {
  it("Should be able to get all books", async () => {
    const { booksRepository } = container();
    const getAllBooksService = new GetAllBooksService({
      booksRepository,
    });
    const saveBookService = new SaveBookService({
      booksRepository,
    });

    const book1 = createRandomBook();
    const book2 = createRandomBook();
    await saveBookService.execute(book1);
    await saveBookService.execute(book2);


    const books = await getAllBooksService.execute();
    expect(books).not.toBe(undefined);
    expect(books.length).toBeGreaterThan(0);
    expect(books.length).toBe(2);
    expect(books[0].id).toBe(book1.id);
    expect(books[0].title).toBe(book1.title);
    expect(books[1].id).toBe(book2.id);
    expect(books[1].title).toBe(book2.title);
  });
})
