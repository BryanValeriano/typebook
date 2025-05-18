import Book from "@/server/entities/Book";
import IBooksRepository from "@/server/repositories/IBooksRepository";

type Dependencies = {
  booksRepository: IBooksRepository;
}

export default class SaveBookService {
  private booksRepository: IBooksRepository;

  constructor({ booksRepository }: Dependencies) {
    this.booksRepository = booksRepository;
  }

  async execute(book: Book): Promise<void> {
    await this.booksRepository.saveBook(book);
  }
}
