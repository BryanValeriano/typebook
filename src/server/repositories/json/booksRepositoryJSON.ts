import Book from "@/server/entities/Book";
import IBooksRepository from "../IBooksRepository";
import path from "path";
import fs from "fs/promises";

export default class BooksRepositoryJSON implements IBooksRepository {
  private db: Book[] = [];
  private filePath = path.join(
    process.cwd(),
    "src",
    "server",
    "repositories",
    "json",
    "files",
    "books.json",
  );

  constructor() {
    this.db = [];
    this.getDataFromFile().then((data) => {
      this.db = data;
    });
  }


  private async saveToFile(): Promise<void> {
    fs.writeFile(this.filePath, JSON.stringify(this.db))
      .catch(err => {
        console.error(`Error writing to file ${this.filePath}:`, err);
      });
  }

  public async getAllBooks(): Promise<Book[]> {
    const data = await this.getDataFromFile();
    this.db = data;
    console.log("BooksRepositoryJSON: get all books length:", this.db.length);
    return this.db;
  }

  public async getBookById(bookId: string): Promise<Book | void> {
    return this.db.find(book => book.id === bookId);
  }

  public async saveBook(book: Book): Promise<void> {
    this.db.push(book);
    await this.saveToFile();
  }

  public async deleteBook(bookId: string): Promise<void> {
    this.db = this.db.filter(book => book.id !== bookId);
  }

  public async getDataFromFile(): Promise<Book[]> {
    try {
      const data = await fs.readFile(this.filePath, "utf-8");
      const parsed = JSON.parse(data);
      return parsed.map((book: Book) => new Book({ ...book }));
    } catch (e) {
      console.error(`Error reading or parsing file ${this.filePath}:`, e);
      return [];
    }
  }
}
