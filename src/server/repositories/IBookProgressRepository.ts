import BookProgress from "../entities/BookProgress";

export default interface IBookProgressRepository {
  getProgressByUserAndBookIDs(userID: string, bookID: string): Promise<BookProgress | void>;
  saveBookProgress(bookProgress: BookProgress): Promise<void>;
}
