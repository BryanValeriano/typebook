import Book from "../entities/Book";

export default interface IBooksRepository {
  getAllBooks(): Promise<Book[]>;
  getBookById(bookId: string): Promise<Book | void>;
  saveBook(book: Book): Promise<void>;
  deleteBook(bookId: string): Promise<void>;
}
