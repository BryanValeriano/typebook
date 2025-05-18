import Book from "@/server/entities/Book";
import IBooksRepository from "../IBooksRepository";

export default class BooksRepositoryInMemory implements IBooksRepository {
  private db: Book[] = [];

  constructor() {
    this.db = [];
  }

  public async getAllBooks(): Promise<Book[]> {
    return this.db;
  }

  public async getBookById(bookId: string): Promise<Book | void> {
    return this.db.find(book => book.id === bookId);
  }

  public async saveBook(book: Book): Promise<void> {
    this.db.push(book);
  }

  public async deleteBook(bookId: string): Promise<void> {
    this.db = this.db.filter(book => book.id !== bookId);
  }
}
