import BookProgress from "../entities/BookProgress";

export default interface IBookProgressRepository {
  getProgressByUserAndBookIDs(userID: number, bookID: number): Promise<BookProgress | void>;
  saveBookProgress(bookProgress: BookProgress): Promise<void>;
}
