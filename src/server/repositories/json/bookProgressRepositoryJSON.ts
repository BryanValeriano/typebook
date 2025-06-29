import BookProgress from "@/server/entities/BookProgress";
import IBookProgressRepository from "../IBookProgressRepository";
import path from "path";
import fs from "fs/promises";

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

  public async saveBookProgress(bookProgress: BookProgress): Promise<void> {
    this.db.push(bookProgress);
    await this.saveToFile();
  }

  public async getProgressByUserAndBookIDs(userID: string, bookID: string): Promise<BookProgress | void> {
    return this.db.find(bookProgress => bookProgress.userID === userID && bookProgress.bookID === bookID);
  }

  public async getDataFromFile(): Promise<BookProgress[]> {
    try {
      const data = await fs.readFile(this.filePath, "utf-8");
      const parsed = JSON.parse(data);
      return parsed.map((bookProgress: BookProgress) => new BookProgress({ ...bookProgress }));
    } catch (e) {
      console.error(`Error reading or parsing file ${this.filePath}:`, e);
      return [];
    }
  }
}
