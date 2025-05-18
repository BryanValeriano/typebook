import Book from "@/server/entities/Book";
import IBooksRepository from "@/server/repositories/IBooksRepository";

type Dependencies = {
  booksRepository: IBooksRepository;
};

export default class GetAllBooksService {
  private booksRepository: IBooksRepository;

  constructor({ booksRepository }: Dependencies) {
    this.booksRepository = booksRepository;
  }

  async execute(): Promise<Book[]> {
    const books = await this.booksRepository.getAllBooks();
    return books;
  }
}
