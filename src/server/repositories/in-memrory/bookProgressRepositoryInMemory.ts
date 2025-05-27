import BookProgress from "@/server/entities/BookProgress";
import IBookProgressRepository from "../IBookProgressRepository";

export default class BookProgressRepositoryInMemory implements IBookProgressRepository {
  private db: BookProgress[] = [];

  constructor() {
    this.db = [];
  }

  public async saveBookProgress(bookProgress: BookProgress): Promise<void> {
    this.db.push(bookProgress);
  }

  public async getProgressByUserAndBookIDs(userID: string, bookID: string): Promise<BookProgress | void> {
    return this.db.find(bookProgress => bookProgress.userID === userID && bookProgress.bookID === bookID);
  }
}
