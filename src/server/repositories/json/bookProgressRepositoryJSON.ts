import BookProgress from "@/server/entities/BookProgress";
import IBookProgressRepository from "../IBookProgressRepository";
import path from "path";
import fs from "fs";

export default class BookProgressRepositoryJSON implements IBookProgressRepository {
  private db: BookProgress[] = [];
  private filePath = path.join(
    "src",
    "server",
    "repositories",
    "json",
    "files",
    "bookProgress.json",
  )

  constructor() {
    this.getBookProgressFromFile();
  }

  public async getProgressByUserAndBookIDs(userID: number, bookID: number): Promise<BookProgress | null> {
    return this.db.find(bookProgress => bookProgress.userID === userID && bookProgress.bookID === bookID) || null;
  }

  public async getBookProgressFromFile(): Promise<BookProgress[]> {
    fs.readFile(this.filePath, "utf-8", (err, data) => {
      if (err) {
        console.error(`Error reading file ${this.filePath}:`, err);
        return [];
      }
      try {
        this.db = JSON.parse(data).map((bookProgress: BookProgress) => new BookProgress({ ...bookProgress }));
      } catch (e) {
        console.error(`Error parsing JSON from file ${this.filePath}:`, e);
        return [];
      }
    })
    return this.db;
  }
}
