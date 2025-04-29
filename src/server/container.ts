import IBookProgressRepository from "./repositories/IBookProgressRepository";
import BookProgressRepositoryJSON from "./repositories/json/bookProgressRepositoryJSON";

interface Container {
  bookProgressRepository: IBookProgressRepository;
}

const dev: Container = {
  bookProgressRepository: new BookProgressRepositoryJSON(),
}

export function container(): Container {
  const mode = process.env.MODE || "dev";
  switch (mode) {
    case "dev":
      return dev;
    default:
      throw new Error(`Unknown mode: ${mode}`);
  }
}
