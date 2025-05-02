import IBookProgressRepository from "./repositories/IBookProgressRepository";
import BookProgressRepositoryInMemory from "./repositories/in-memrory/bookProgressRepositoryInMemory";
import BookProgressRepositoryJSON from "./repositories/json/bookProgressRepositoryJSON";

interface Container {
  bookProgressRepository: IBookProgressRepository;
}

const dev: Container = {
  bookProgressRepository: new BookProgressRepositoryJSON(),
}

const test: Container = {
  bookProgressRepository: new BookProgressRepositoryInMemory(),
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
