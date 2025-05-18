import IBookProgressRepository from "./repositories/IBookProgressRepository";
import IBooksRepository from "./repositories/IBooksRepository";
import BookProgressRepositoryInMemory from "./repositories/in-memrory/bookProgressRepositoryInMemory";
import BooksRepositoryInMemory from "./repositories/in-memrory/booksRepositoryInMemory";
import BookProgressRepositoryJSON from "./repositories/json/bookProgressRepositoryJSON";
import BooksRepositoryJSON from "./repositories/json/booksRepositoryJSON";

interface Container {
  bookProgressRepository: IBookProgressRepository;
  booksRepository: IBooksRepository;
}

const dev: Container = {
  bookProgressRepository: new BookProgressRepositoryJSON(),
  booksRepository: new BooksRepositoryJSON(),
}

const test: Container = {
  bookProgressRepository: new BookProgressRepositoryInMemory(),
  booksRepository: new BooksRepositoryInMemory(),
}

export function container(): Container {
  const mode = process.env.MODE || "dev";
  switch (mode) {
    case "dev":
      return dev;
    case "test":
      return test;
    default:
      throw new Error(`Unknown mode: ${mode}`);
  }
}
