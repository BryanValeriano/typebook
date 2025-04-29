import IBookProgressRepository from "./repositories/IBookProgressRepository";
import BookProgressRepositoryJSON from "./repositories/json/bookProgressRepositoryJSON";

interface Container {
  bookProgressRepository: IBookProgressRepository;
}

const dev: Container = {
  bookProgressRepository: new BookProgressRepositoryJSON(),
}

const test: Container = {
  // TODO inmemory database
  bookProgressRepository: new BookProgressRepositoryJSON(),
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
